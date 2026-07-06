# Woven Self Handoff Context

Last updated: 2026-07-06

This file is intentionally compact. Read it after `AGENTS.md` before spending tokens on broad repo discovery.

## Current Site Shape

- Static site only: HTML, CSS, Tailwind CDN, small JavaScript, Vercel config.
- No build step is required for normal page edits.
- Local preview: `python3 -m http.server 8080`, then open `http://localhost:8080/author.html`.
- Playwright and Sharp are available as dev dependencies for visual QA and asset work.

## Active Author Campaign State

`author.html` is the primary public book/preorder landing page for Loren Galese's memoir.

Use these current campaign anchors:

- Title: `Unfolding Origami: A Memoir`
- Author: Loren Galese
- Release date: `July 20, 2026`
- Signed paperback price: `$24.99`
- ISBN: `979-8-9956116-0-8`
- Kindle ASIN: `B0H27BM8K1`
- Signed paperback Stripe URL: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`
- Kindle preorder URL: `https://www.amazon.com/dp/B0H27BM8K1`
- Loren Substack URL: `https://substack.com/@quietalchemywloren`

The Kindle CTA should use the direct Amazon product page, not the Amazon author/store page.

## Recent Author Campaign Work

Current intended author/preorder behavior:

- Hero shows the official ebook cover with alt text: `Cover of Unfolding Origami: A Memoir by Loren Galese`.
- Hero has two preorder CTAs: signed paperback via Stripe and Kindle ebook via Amazon.
- `Read Loren's Writing` is centered below the preorder CTAs and links to Substack.
- Preorder section supports both signed paperback and Kindle ebook.
- Preorder detail card includes real butterfly/origami accents extracted from the final cover art.
- Decorative butterfly images use empty alt text and are wrapped by `aria-hidden="true"`.

Butterfly extraction source:

- `exports/kdp-ebook-cover-1600x2560-fixed.png`

Extracted assets:

- `images/unfolding-origami-butterfly-1.png`
- `images/unfolding-origami-butterfly-2.png`
- `images/unfolding-origami-butterfly-3.png`

Asset QA already performed in the prior pass:

- `file images/unfolding-origami-butterfly-*.png`
- Python/Pillow alpha check confirmed `RGBA` PNGs with transparent pixels.

July 2026 synopsis cleanup:

- Approved synopsis copy now appears in `author.html`, `preorder.html` product JSON-LD, and the book-launch source files under `marketing/book-launch/`.
- Newsletter component ownership is mapped in `newsletter/NEWSLETTER-ASSET-MAP.md`. The `newsletter/` folder is generally ignored local work product, so force-add only deliberate files from that folder.
- Keep endorsements, preorder links, pricing, CTAs, and book positioning untouched unless the user explicitly asks.

July 2026 paperback cover QA:

- Updated InDesign source: `design/book-cover-unfolding-origami/indesign-handoff/reference/Unfolding Origami - Updated Synopsis.indd`.
- Final repaired cover export: `exports/kdp-paperback-cover-updated-synopsis-final.pdf`.
- Final proof PNG: `exports/kdp-paperback-cover-updated-synopsis-final.png`.
- Final QA report: `exports/kdp-paperback-cover-updated-synopsis-final-qa-report.md`.
- Verdict: `PASS WITH MINOR NOTES`; proceed to ebook work from the final repaired cover export or a later export from the repaired INDD.
- Important note: the initial InDesign QA export had a blank barcode/ISBN box. The repaired INDD restores the barcode via `design/book-cover-unfolding-origami/indesign-handoff/reference/barcode-isbn-9798995611608.png`.
- Existing placed artwork still reports about `159-161 PPI`, matching the supplied reference's effective resolution class; the restored barcode is 300 DPI.

## Source Files To Inspect First

For author/preorder work:

1. `author.html`
2. `styles.css`
3. `sitemap.xml`
4. `images/unfolding-origami-ebook-cover.jpg`
5. `images/unfolding-origami-butterfly-*.png`
6. `exports/kdp-ebook-cover-1600x2560-fixed.png`, only if cover-derived asset work is needed

For routing/security:

1. `vercel.json`
2. page-level CSP in the relevant HTML file

For blog work:

1. `blog/posts.json`
2. `blog/posts/*.md`
3. `blog/post.html`

## Validation Notes

Useful checks:

```bash
git diff --check
rg -n "Read Loren's Writing|B0H27BM8K1|buy.stripe.com|quietalchemywloren" author.html styles.css
python3 -m http.server 8080
```

Expected local browser noise:

- Tailwind CDN production warning.
- `/_vercel/speed-insights/script.js` 404 when served by Python instead of Vercel.

Recent visual QA screenshots from the butterfly refinement were saved in `/tmp`:

- `/tmp/woven-author-butterfly-desktop-hero.png`
- `/tmp/woven-author-butterfly-desktop-preorder.png`
- `/tmp/woven-author-butterfly-mobile-hero.png`
- `/tmp/woven-author-butterfly-mobile-card.png`

Those screenshots are local evidence, not durable repo artifacts. Re-run browser QA after any visual edit.

## Working Tree Caution

This repo often has intentional local campaign assets and ignored work product. Do not clean or delete untracked folders unless the user explicitly asks.

Local work-product paths are intentionally ignored to keep `git status` usable:

- `Loren/`
- `exports/`
- `design-qa.md`

Tracked files under ignored paths remain tracked. For future intentional generated exports or newsletter files, use `git add -f path/to/file` after reviewing the artifact.

Stage only reviewed files that are relevant to the user's request.
