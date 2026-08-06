import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const sitePolicy = config.headers?.find(({ source }) => source === '/(.*)');

assert.ok(sitePolicy, 'A site-wide Vercel header policy must exist.');

const headers = new Map(sitePolicy.headers.map(({ key, value }) => [key.toLowerCase(), value]));
assert.equal(headers.size, sitePolicy.headers.length, 'Security headers must not contain duplicate keys.');

assert.equal(
  headers.get('strict-transport-security'),
  'max-age=63072000; includeSubDomains; preload',
  'HSTS must cover the full domain tree and remain preload-eligible.'
);
assert.equal(headers.get('x-frame-options'), 'DENY', 'Legacy browsers must deny framing.');
assert.equal(headers.get('x-content-type-options'), 'nosniff', 'MIME sniffing must remain disabled.');
assert.equal(
  headers.get('referrer-policy'),
  'strict-origin-when-cross-origin',
  'Cross-origin navigation must not disclose full referrer paths.'
);
assert.equal(
  headers.get('permissions-policy'),
  'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Unused browser capabilities must remain disabled.'
);

const csp = headers.get('content-security-policy');
assert.ok(csp, 'A Content-Security-Policy header must exist.');
const cspDirectives = new Map(
  csp.split(';').map((directive) => {
    const [name, ...values] = directive.trim().split(/\s+/);
    return [name, values.join(' ')];
  })
);

assert.equal(cspDirectives.size, 11, 'The complete reviewed CSP directive set must remain intact.');
assert.equal(cspDirectives.get('default-src'), "'self'", 'Resources must default to same-origin.');
assert.equal(cspDirectives.get('img-src'), "'self' https: data:", 'Reviewed image sources must remain intact.');
assert.equal(
  cspDirectives.get('style-src'),
  "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'Reviewed style sources must remain intact.'
);
assert.equal(
  cspDirectives.get('font-src'),
  "'self' https://fonts.gstatic.com",
  'Reviewed font sources must remain intact.'
);
assert.equal(
  cspDirectives.get('script-src'),
  "'self' https://cdn.jsdelivr.net https://cdn.tailwindcss.com 'unsafe-inline' https://*.vercel-scripts.com",
  'Reviewed script sources must remain intact.'
);
assert.equal(
  cspDirectives.get('connect-src'),
  "'self' https://formspree.io https://*.vercel-analytics.com",
  'Reviewed connection sources must remain intact.'
);
assert.equal(cspDirectives.get('object-src'), "'none'", 'Plugins and embedded objects must remain disabled.');
assert.equal(cspDirectives.get('base-uri'), "'self'", 'Base URL injection must remain constrained.');
assert.equal(cspDirectives.get('form-action'), 'https://formspree.io', 'Forms must submit only to Formspree.');
assert.equal(cspDirectives.get('frame-ancestors'), "'none'", 'Modern browsers must deny framing.');
assert.equal(cspDirectives.get('upgrade-insecure-requests'), '', 'Insecure subresources must be upgraded.');

console.log('Security header policy check passed.');
