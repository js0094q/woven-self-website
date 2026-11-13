import importlib.util
import io
import json
from pathlib import Path
from http.server import HTTPServer
from threading import Thread
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("substack_api", ROOT / "api/substack.py")
api = importlib.util.module_from_spec(SPEC)


def item(slug, date, image="", extra="", title="A &amp; B"):
    return f"""<item><title>{title}</title>
    <link>https://quietalchemywloren.substack.com/p/{slug}</link>
    <pubDate>{date}</pubDate><description><![CDATA[<p>Words &#8217; more</p>]]></description>
    {image}{extra}</item>"""


def feed(*items):
    return ('<rss xmlns:content="http://purl.org/rss/1.0/modules/content/">'
            '<channel>' + ''.join(items) + '</channel></rss>').encode()


class SubstackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not (ROOT / "api/substack.py").exists():
            raise AssertionError("Automatic Substack feed endpoint is missing")
        SPEC.loader.exec_module(api)

    def test_newest_three_unique_posts_with_decoded_text(self):
        posts = api.parse_feed(feed(
            item("old", "Thu, 01 Oct 2026 18:00:00 GMT"),
            item("second", "Fri, 06 Nov 2026 01:26:56 GMT"),
            item("new", "Wed, 11 Nov 2026 01:41:25 GMT"),
            item("third", "Sat, 31 Oct 2026 05:35:18 GMT"),
            item("new", "Wed, 11 Nov 2026 01:41:25 GMT"),
        ))
        self.assertEqual([p['url'].rsplit('/', 1)[1] for p in posts], ['new', 'second', 'third'])
        self.assertEqual(posts[0]['title'], 'A & B')
        self.assertEqual(posts[0]['description'], 'Words ’ more')
        self.assertEqual(posts[0]['publishedAt'], '2026-11-11T01:41:25+00:00')

    def test_featured_image_and_audio_post_content_image(self):
        posts = api.parse_feed(feed(
            item('image', 'Wed, 11 Nov 2026 01:41:25 GMT',
                 '<enclosure type="image/jpeg" url="https://substackcdn.com/cover.jpg"/>'),
            item('audio', 'Fri, 06 Nov 2026 01:26:56 GMT',
                 '<enclosure type="audio/mpeg" url="https://api.substack.com/podcast.mp3"/>',
                 '<content:encoded><![CDATA[<p>Intro</p><img src="https://substack-post-media.s3.amazonaws.com/public/photo.jpg">]]></content:encoded>'),
            item('no-image', 'Sat, 31 Oct 2026 05:35:18 GMT'),
        ))
        self.assertEqual([p['image'] for p in posts], [
            'https://substackcdn.com/cover.jpg',
            'https://substack-post-media.s3.amazonaws.com/public/photo.jpg', None])

    def test_invalid_links_dates_and_images_are_not_published(self):
        posts = api.parse_feed(feed(
            item('bad', 'Wed, 11 Nov 2026 01:41:25 GMT').replace(
                'https://quietalchemywloren.substack.com/p/bad', 'javascript:alert(1)'),
            item('bad-date', 'invalid'),
            item('safe', 'Sat, 31 Oct 2026 05:35:18 GMT',
                 '<enclosure type="image/jpeg" url="https://substackcdn.com.evil.test/image.jpg"/>'),
        ))
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]['image'], None)

    def test_empty_malformed_and_dtd_feeds_fail(self):
        for xml in [feed(), b'<not-xml', b'<!DOCTYPE rss><rss><channel/></rss>']:
            with self.subTest(xml=xml), self.assertRaises(ValueError):
                api.parse_feed(xml)

    def request(self, upstream):
        server = HTTPServer(('127.0.0.1', 0), api.handler)
        thread = Thread(target=server.handle_request)
        with patch.object(api, 'urlopen', side_effect=upstream if isinstance(upstream, Exception) else None,
                          return_value=None if isinstance(upstream, Exception) else io.BytesIO(upstream)):
            thread.start()
            try:
                try:
                    response = urlopen(f'http://127.0.0.1:{server.server_port}/api/substack', timeout=5)
                except HTTPError as error:
                    response = error
                with response:
                    return response.status, response.headers, json.load(response)
            finally:
                thread.join(timeout=5)
                server.server_close()

    def test_success_is_cacheable_json(self):
        status, headers, body = self.request(feed(item('new', 'Wed, 11 Nov 2026 01:41:25 GMT')))
        self.assertEqual(status, 200)
        self.assertIn('s-maxage=3600', headers['Cache-Control'])
        self.assertIn('application/json', headers['Content-Type'])
        self.assertEqual(body['posts'][0]['title'], 'A & B')

    def test_upstream_failure_is_uncached_and_does_not_expose_details(self):
        status, headers, body = self.request(OSError('private upstream details'))
        self.assertEqual(status, 503)
        self.assertEqual(headers['Cache-Control'], 'no-store')
        self.assertNotIn('private upstream details', json.dumps(body))

    def test_oversize_feed_is_rejected(self):
        status, _, _ = self.request(b' ' * (2 * 1024 * 1024 + 1))
        self.assertEqual(status, 503)


if __name__ == '__main__':
    unittest.main()
