"""Read-only public Substack feed. No credentials, visitor data, or dependencies."""

from datetime import timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from http.server import BaseHTTPRequestHandler
import json
import logging
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


FEED_URL = 'https://quietalchemywloren.substack.com/feed'
POST_HOST = 'quietalchemywloren.substack.com'
IMAGE_HOSTS = {'substackcdn.com', 'substack-post-media.s3.amazonaws.com'}
MAX_FEED_BYTES = 2 * 1024 * 1024


def allowed_url(value, hosts):
    try:
        url = urlsplit(value or '')
        return (url.scheme == 'https' and url.hostname in hosts
                and not url.username and not url.password and url.port in (None, 443))
    except ValueError:
        return False


class FeedHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.images = []

    def handle_data(self, data):
        self.text.append(data)

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            src = dict(attrs).get('src', '')
            if allowed_url(src, IMAGE_HOSTS):
                self.images.append(src)


def plain_text(value):
    parser = FeedHTML()
    parser.feed(value or '')
    return ' '.join(' '.join(parser.text).split())


def parse_feed(xml):
    if len(xml) > MAX_FEED_BYTES or b'<!DOCTYPE' in xml.upper() or b'<!ENTITY' in xml.upper():
        raise ValueError('Unsupported feed')
    try:
        root = ET.fromstring(xml)
    except ET.ParseError as error:
        raise ValueError('Invalid feed') from error
    posts = []
    seen = set()
    for item in root.findall('./channel/item'):
        url = (item.findtext('link') or '').strip()
        title = plain_text(item.findtext('title'))
        if not title or not allowed_url(url, {POST_HOST}) or not urlsplit(url).path.startswith('/p/'):
            continue
        if url in seen:
            continue
        try:
            date = parsedate_to_datetime(item.findtext('pubDate') or '')
            if date.tzinfo is None:
                continue
            date = date.astimezone(timezone.utc)
        except (TypeError, ValueError, OverflowError):
            continue
        image = None
        enclosure = item.find('enclosure')
        if enclosure is not None and enclosure.get('type', '').startswith('image/'):
            candidate = enclosure.get('url')
            if allowed_url(candidate, IMAGE_HOSTS):
                image = candidate
        if not image:
            content = FeedHTML()
            content.feed(item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded') or '')
            image = next(iter(content.images), None)
        seen.add(url)
        posts.append({
            'title': title,
            'url': url,
            'description': plain_text(item.findtext('description')),
            'publishedAt': date.isoformat(),
            'image': image,
        })
    posts.sort(key=lambda post: post['publishedAt'], reverse=True)
    if not posts:
        raise ValueError('No valid posts')
    return posts[:3]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            request = Request(FEED_URL, headers={
                'User-Agent': 'TheWovenSelfWebsite/1.0',
                'Accept': 'application/rss+xml, application/xml, text/xml',
            })
            with urlopen(request, timeout=8) as response:
                posts = parse_feed(response.read(MAX_FEED_BYTES + 1))
            status, body = 200, {'posts': posts}
            cache = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
        except Exception:
            # Do not expose feed content or upstream error details to visitors.
            logging.warning('Public Substack feed is temporarily unavailable')
            status, body, cache = 503, {'error': 'Feed temporarily unavailable'}, 'no-store'
        payload = json.dumps(body, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', cache)
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
