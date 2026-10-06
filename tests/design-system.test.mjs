import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootEntries = await readdir(root, { withFileTypes: true });
const pages = [
  ...rootEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name),
  'blog/post.html',
].sort();
const pageSource = new Map(await Promise.all(pages.map(async (file) => [
  file,
  await readFile(path.join(root, file), 'utf8'),
])));
const navigablePages = pages.filter((file) => file !== 'excerpt-unfolding-origami.html');

function openingTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(([tag]) => tag);
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
}

function hasClass(tag, name) {
  return attribute(tag, 'class').split(/\s+/).includes(name);
}

test('public HTML contains no em dashes', () => {
  for (const [file, html] of pageSource) {
    assert.doesNotMatch(html, /—|&mdash;|&#0*8212;|&#x0*2014;/i, `${file} contains an em dash`);
  }
});

test('each navigable page loads the shared design CSS and menu script', () => {
  for (const file of navigablePages) {
    const html = pageSource.get(file);
    assert.match(html, /href=["']\/styles\.css(?:\?[^"']*)?["']/, `${file} should use shared styles.css`);
    assert.match(html, /src=["']\/site\.js(?:\?[^"']*)?["']/, `${file} should use shared site.js`);
    assert.doesNotMatch(html, /site-updates\.css/, `${file} should not request the retired stylesheet`);
    assert.equal(/const\s+toggleNav\s*=|function\s+toggleNav\s*\(/.test(html), false,
      `${file} should not duplicate menu handlers`);
  }
});

test('the mobile navigation has a labelled, initially inert modal drawer', () => {
  for (const file of navigablePages) {
    const html = pageSource.get(file);
    const trigger = openingTags(html, 'button').find((tag) => hasClass(tag, 'hamburger'));
    const drawer = openingTags(html, 'div').find((tag) => attribute(tag, 'id') === 'mobile-nav');
    assert.ok(trigger, `${file} should have a menu trigger`);
    assert.match(trigger, /aria-expanded=["']false["']/, `${file} menu starts collapsed`);
    assert.match(trigger, /aria-controls=["']mobile-nav["']/, `${file} trigger controls its drawer`);
    assert.ok(drawer, `${file} should have the shared mobile drawer`);
    assert.match(drawer, /role=["']dialog["']/, `${file} drawer has dialog semantics`);
    assert.match(drawer, /aria-modal=["']true["']/, `${file} drawer is modal when open`);
    assert.match(drawer, /aria-label=["'][^"']+["']/, `${file} drawer is named`);
    assert.match(drawer, /aria-hidden=["']true["']/, `${file} drawer starts hidden`);
    assert.match(drawer, /\binert(?:\s|>|=)/, `${file} drawer starts inert`);
  }
});

test('CTA links and buttons use the shared primary or secondary anatomy', () => {
  const legacyNames = /\b(?:btn-outline|author-cta|preorder-cta|speaking-cta)\b/;
  for (const file of pages) {
    const html = pageSource.get(file);
    assert.doesNotMatch(html, legacyNames, `${file} still has a legacy CTA variant`);
    const ctaTags = [
      ...openingTags(html, 'a'),
      ...openingTags(html, 'button'),
    ].filter((tag) => hasClass(tag, 'btn-primary') || hasClass(tag, 'btn-secondary'));
    for (const tag of ctaTags) {
      if (/^<a\b/i.test(tag)) {
        assert.ok(attribute(tag, 'href'), `${file} CTA link should retain an href`);
      } else {
        assert.match(tag, /type=["'](?:button|submit)["']/, `${file} CTA button should declare its type`);
      }
      assert.ok(attribute(tag, 'class').split(/\s+/).includes('btn-primary')
        || attribute(tag, 'class').split(/\s+/).includes('btn-secondary'));
    }

    for (const tag of openingTags(html, 'a').filter((item) => hasClass(item, 'btn-primary') || hasClass(item, 'btn-secondary'))) {
      const nextMarkup = html.slice(html.indexOf(tag), html.indexOf('</a>', html.indexOf(tag)) + 4);
      assert.match(nextMarkup, /class=["'][^"']*\bbtn-label\b[^"']*["']/, `${file} CTA has a separate text label`);
      assert.match(nextMarkup, /class=["'][^"']*\bbtn-arrow\b[^"']*["']/, `${file} CTA has a separate arrow`);
      const arrow = openingTags(nextMarkup, 'span').find((span) => hasClass(span, 'btn-arrow'));
      assert.ok(arrow, `${file} CTA arrow should use the decorative span wrapper`);
      assert.match(arrow, /aria-hidden=["']true["']/, `${file} CTA arrow wrapper is decorative`);
    }
  }
});

test('visible form controls have associated labels', () => {
  for (const [file, html] of pageSource) {
    const ids = new Set(openingTags(html, 'label').map((tag) => attribute(tag, 'for')).filter(Boolean));
    for (const tag of openingTags(html, 'input').concat(openingTags(html, 'textarea'), openingTags(html, 'select'))) {
      const type = attribute(tag, 'type').toLowerCase();
      if (type === 'hidden' || type === 'submit' || type === 'button') continue;
      const id = attribute(tag, 'id');
      assert.ok(id && ids.has(id), `${file} form control ${id || attribute(tag, 'name')} needs an associated label`);
    }
  }
});

test('public pages retain one H1 and non-empty image alt text', () => {
  for (const [file, html] of pageSource) {
    if (file === 'excerpt-unfolding-origami.html') continue;
    assert.equal(openingTags(html, 'h1').length, 1, `${file} should have one H1`);
    for (const tag of openingTags(html, 'img')) {
      assert.match(tag, /\balt=["']/, `${file} image should declare alt text`);
    }
  }
});
