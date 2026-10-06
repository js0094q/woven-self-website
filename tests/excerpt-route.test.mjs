import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const author = readFileSync(new URL('../author.html', import.meta.url), 'utf8');
const publicRoute = '/excerpt-unfolding-origami';
const amazonExcerpt = 'https://www.amazon.com/dp/B0H27BM8K1?asin=B0H27BM8K1&revisionId=d20c49a2&format=3&depth=1';

for (const route of [publicRoute, `${publicRoute}.html`]) {
  assert.deepEqual(
    config.redirects?.find(({ source }) => source === route),
    { source: route, destination: amazonExcerpt, permanent: false },
    `The ${route} route must open the current Amazon excerpt page.`
  );
}
assert.equal(existsSync(new URL('../excerpt-unfolding-origami.html', import.meta.url)), true, 'Keep the direct-link fallback page for static hosts.');
const fallback = readFileSync(new URL('../excerpt-unfolding-origami.html', import.meta.url), 'utf8');
assert.match(fallback, /<meta http-equiv="refresh" content="0;url=https:\/\/www\.amazon\.com\/dp\/B0H27BM8K1/, 'The static fallback must point readers to the current Amazon excerpt.');
assert.match(fallback, /<a href="https:\/\/www\.amazon\.com\/dp\/B0H27BM8K1/, 'The static fallback must include a usable direct link.');
assert.match(sitemap, /<loc>https:\/\/wovenself\.com\/excerpt-unfolding-origami<\/loc>/, 'The clean excerpt route must remain in the sitemap.');
assert.match(author, /href="https:\/\/www\.amazon\.com\/dp\/B0H27BM8K1\?asin=B0H27BM8K1&amp;revisionId=d20c49a2&amp;format=3&amp;depth=1"/, 'The author-page excerpt CTA must use the same current Amazon excerpt destination.');
assert.doesNotMatch(author, /href="\/excerpt-unfolding-origami(?:\.html)?"/, 'The author-page excerpt CTA must not use a retired internal route.');

console.log('Excerpt Amazon destination configuration check passed.');
