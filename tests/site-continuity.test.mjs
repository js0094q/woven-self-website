import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'therapy.html', 'coaching.html', 'peer-support.html', 'author.html', 'about.html', 'speaking.html', 'substack.html', 'blog.html', 'blog/post.html', 'preorder.html', 'preorder-thank-you.html'];
const expected = ['Home', 'Therapy', 'Coaching', 'Groups', 'Author', 'About', 'Contact'];
for (const path of pages) {
  const html = readFileSync(new URL(path, root), 'utf8');
  assert.doesNotMatch(html, /\u2014|&mdash;|&#(?:8212|x2014);/i, `${path}: copy punctuation`);
  assert.match(html, /class="skip-link" href="#main-content"/, `${path}: skip link`);
  assert.match(html, /id="mobile-nav" hidden inert/, `${path}: closed menu is excluded from keyboard navigation`);
  assert.match(html, /src="\/site.js"/, `${path}: shared behavior`);
  for (const label of ['Primary', 'Mobile']) {
    const nav = html.match(new RegExp(`<nav[^>]*aria-label="${label}"[^>]*>([\\s\\S]*?)<\\/nav>`))?.[1];
    assert.ok(nav, `${path}: ${label} navigation exists`);
    const names = [...nav.matchAll(/<a\b[^>]*class="nav-link"[^>]*>(.*?)<\/a>/g)].map(m => m[1]);
    assert.deepEqual(names, expected, `${path}: ${label} labels and order`);
  }
  assert.match(html, /aria-label="Footer"/, `${path}: footer navigation`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${path}: unique IDs`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"\s]+)"[^>]*>/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://wovenself.com/' + (path === 'index.html' ? '' : path));
    if (url.origin !== 'https://wovenself.com') continue;
    let destination = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    if (!destination.includes('.')) destination += '.html';
    // Clean excerpt URL is handled by Vercel's existing redirect configuration.
    if (destination.startsWith('excerpt-unfolding-origami')) continue;
    assert.ok(existsSync(new URL(destination, root)), `${path}: destination ${url.pathname}`);
    if (url.hash) {
      const target = readFileSync(new URL(destination, root), 'utf8');
      assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: section ${url.pathname}${url.hash}`);
    }
  }
}
const home = readFileSync(new URL('index.html', root), 'utf8');
for (const term of ['Turn Insight Into Action', 'COMING SOON', 'What Comes Next', 'Beyond the Letters: Life After the Degree', 'Join the interest list']) assert.ok(home.includes(term), `Required homepage wording: ${term}`);
const group = readFileSync(new URL('peer-support.html', root), 'utf8');
assert.match(group, /id="group-interest-form"[^>]*action="https:\/\/formspree.io\//, 'Existing group inquiry backend');
assert.doesNotMatch(group, /Greek.life|hazing|Cornell|In development/i, 'Current post-college positioning');
const coaching = readFileSync(new URL('coaching.html', root), 'utf8');
assert.doesNotMatch(coaching, /Peer Support After Greek Life|navigate college life|Greek-life involvement/i, 'Broad coaching positioning');
console.log(`Continuity checks passed for ${pages.length} pages.`);
