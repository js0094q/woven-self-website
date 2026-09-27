import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const author = read('author.html');
const homepage = read('index.html');
const orderPage = read('preorder.html');
const confirmationPage = read('preorder-thank-you.html');
const stripeUrl = 'https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00';

assert.doesNotMatch(author, /available only through July 20, 2026/i);
assert.doesNotMatch(author, /"validThrough"\s*:/);
assert.match(author, new RegExp(stripeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(author, />Order Signed Copy<\/a>/);

assert.doesNotMatch(homepage, /author and preorder page/i);
assert.match(homepage, /Visit Loren's author page/);

assert.match(orderPage, /<title>Order a Signed Copy of Unfolding Origami/);
assert.match(orderPage, />\s*Order Signed Paperback →\s*<\/a>/);
assert.match(orderPage, new RegExp(stripeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.doesNotMatch(orderPage, /Preorder Signed|Preorder Details|This is a preorder|preorder customers|Ask a preorder question|scheduled for release|Ebook release details/i);

assert.match(confirmationPage, /<title>Thank You for Your Order \| Unfolding Origami<\/title>/);
assert.match(confirmationPage, /Thank you for your order\./);
assert.doesNotMatch(confirmationPage, /Thank You for Your Preorder|preordering|Your preorder|preorder customers|preorder questions|July 20, 2026/i);

console.log('Signed-copy ordering content check passed.');
