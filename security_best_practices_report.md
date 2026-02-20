# Security Best Practices Report – The Woven Self (static site)
Date: 2026-02-20
Scope: `/Users/josephstewart/Downloads/woven-self-website-main` (static HTML/CSS with vanilla JS and markdown blog rendering)

## Executive Summary
- Blog rendering uses `marked` to convert local markdown into HTML and injects it without sanitization, enabling XSS if post content is compromised.
- Blog index builds cards via `innerHTML` from `posts.json`, so any poisoned content there would render raw HTML.
- Third-party CDN scripts (Tailwind, Marked) are loaded without pinning or Subresource Integrity checks, increasing supply-chain risk.
- No Content Security Policy is set in the repo; adding one would constrain script/style sources and reduce XSS blast radius.

## Findings

### High
**F-1: Markdown rendered to DOM without sanitization**  
- **Location:** blog/post.html:149-150  
- **Evidence:** `const html = marked.parse(md, ...); document.getElementById('post-content').innerHTML = html;`  
- **Impact:** If an attacker can modify a markdown file (e.g., compromised repo, malicious contributor), they can run arbitrary JS in visitors’ browsers (stored XSS), potentially defacing the site or stealing session data for any authenticated contexts on the same origin.  
- **Fix:** Sanitize the rendered HTML before insertion using a vetted library such as DOMPurify and enforce Trusted Types where supported: `const safeHtml = DOMPurify.sanitize(marked.parse(md, { headerIds:true, mangle:false })); postContent.innerHTML = safeHtml;`. Consider disabling raw HTML in markdown entirely (`marked.use({ renderer: { html() { return ''; }}})`) if rich HTML is not needed. Add a CSP that disallows inline scripts unless nonce’d to contain residual risk.

### Medium
**F-2: Blog cards built with unsanitized `innerHTML`**  
- **Location:** blog.html:157-167  
- **Evidence:** Template literals inject `title`, `excerpt`, `tags`, and `date` from `posts.json` straight into `a.innerHTML`.  
- **Impact:** If `posts.json` is tampered with, the blog listing would render attacker-supplied HTML/JS (reflected/stored XSS).  
- **Fix:** Build DOM nodes with `textContent` / `createElement` for text fields, or sanitize the assembled HTML before assigning to `innerHTML`. Keep `tags` to an allowlist and escape text by default.

**F-3: Third-party CDN scripts lack SRI and version pinning**  
- **Location:** index.html:27; blog.html:42, blog/post.html:43 & 49  
- **Evidence:** Scripts pulled from `https://cdn.tailwindcss.com` and `https://cdn.jsdelivr.net/npm/marked/marked.min.js` without `integrity` attributes or fixed versions.  
- **Impact:** If the CDN is compromised or serves unexpected code, attackers gain full script execution on the site.  
- **Fix:** Pin explicit versions and include Subresource Integrity hashes (with `crossorigin="anonymous"`), or self-host the compiled assets and reference them locally.

### Low
**F-4: No Content Security Policy defined**  
- **Location:** Site-wide (no meta `Content-Security-Policy` present)  
- **Impact:** Absence of CSP leaves no defense-in-depth against XSS or rogue third-party scripts.  
- **Fix:** Add a meta CSP suited for static hosting, e.g.:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://cdn.jsdelivr.net https://cdn.tailwindcss.com; object-src 'none'; base-uri 'self'; form-action https://formspree.io">
  ```
  Adjust directives to match required origins and replace `'unsafe-inline'` with nonces/hashes where possible.

## Suggested Next Steps
1) Wire in DOMPurify (pinned + SRI) and sanitize markdown output in `blog/post.html` before insertion.  
2) Refactor `blog.html` card rendering to build elements with `textContent` (or sanitize prior to `innerHTML`).  
3) Pin CDN assets with SRI or self-host them; then add a CSP aligned with the chosen sources.  
4) Re-run a quick check after changes to ensure no remaining unsafe sinks (`innerHTML`, `insertAdjacentHTML`, `eval`/`Function`, `setTimeout` strings).
