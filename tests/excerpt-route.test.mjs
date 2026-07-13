import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const author = readFileSync(new URL('../author.html', import.meta.url), 'utf8');
const pdf = readFileSync(new URL('../assets/unfolding-origami-excerpt.pdf', import.meta.url));
const publicRoute = '/excerpt-unfolding-origami';
const pdfRoute = '/assets/unfolding-origami-excerpt.pdf';

assert.equal(existsSync(new URL('../excerpt-unfolding-origami.html', import.meta.url)), false, 'The excerpt must not have an HTML page.');
assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-', 'The authoritative excerpt asset must remain a PDF.');
assert.deepEqual(
  config.rewrites.find(({ source }) => source === publicRoute),
  { source: publicRoute, destination: pdfRoute },
  'The clean excerpt route must rewrite directly to the PDF.'
);
assert.deepEqual(
  config.redirects?.find(({ source }) => source === `${publicRoute}.html`),
  { source: `${publicRoute}.html`, destination: publicRoute, permanent: true },
  'The legacy HTML URL must redirect to the clean PDF route.'
);
assert.match(sitemap, /<loc>https:\/\/wovenself\.com\/excerpt-unfolding-origami<\/loc>/, 'The clean PDF route must remain in the sitemap.');
assert.match(author, /href="\/excerpt-unfolding-origami"/, 'The author-page excerpt CTA must use the clean PDF route.');
assert.doesNotMatch(author, /\/excerpt-unfolding-origami\.html/, 'The author-page excerpt CTA must not use the legacy HTML URL.');

console.log('Excerpt PDF route configuration check passed.');
