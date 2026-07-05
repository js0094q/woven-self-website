# AGENTS.md

Operational rules for coding agents working in this repository.

## Start Here

1. Read this file first.
2. Read `context.md` for the current campaign state and low-token handoff notes.
3. Inspect the relevant source files before editing. Treat the working tree as the source of truth.
4. Keep changes narrow, reversible, and consistent with the existing static site.

## Project Shape

The Woven Self website is a plain static site for two related public identities:

- Therapy practice: trauma-informed therapy, EMDR, IFS, couples work, and New Jersey client inquiries.
- Author platform: Loren Galese's memoir campaign, preorder pages, book updates, blog/newsletter assets, and literary content.

Stack:

- Plain HTML and CSS
- Tailwind CDN
- Small client-side JavaScript
- Static Markdown/JSON blog content
- GitHub to Vercel deployment
- No app framework or build step

Do not introduce React, Next.js, Astro, Vite, new package managers, or deployment tooling unless the user explicitly asks.

## Core Files

- `index.html`: therapy homepage
- `about.html`: clinical background and author bridge
- `author.html`: primary author/book/preorder landing page
- `preorder.html`: signed paperback preorder page
- `preorder-thank-you.html`: Stripe thank-you page
- `blog.html`, `blog/post.html`, `blog/posts.json`, `blog/posts/*.md`: static blog system
- `styles.css`: shared site styles
- `vercel.json`: clean URLs, rewrites, and security headers
- `sitemap.xml`, `robots.txt`: public SEO surfaces
- `context.md`: current handoff state for future threads

Some local campaign folders are intentionally untracked or ignored. Do not add or edit them unless the task specifically targets those assets.

## Design Direction

Preserve the current visual system:

- Minimal, calm, accessible, and trust-building
- Warm off-white backgrounds
- Soft sage/green-gray accents
- Serif headings with clean sans-serif body copy
- Rounded cards, generous whitespace, subtle borders
- Literary and book-focused on author pages
- Clinically grounded and non-promissory on therapy pages

Avoid broad redesigns, loud gradients, heavy animation, stock imagery, sales-heavy copy, or clinical framing inside book-only campaign surfaces.

## Content Boundaries

Therapy pages should be grounded, clinically appropriate, non-alarmist, and clear about fit and services. Do not promise outcomes or invite visitors to share sensitive clinical details in public-facing forms.

Author/book pages should be literary, restrained, personal without being overexposed, and book-focused. Do not sensationalize trauma, coercive control, abuse, or survival.

Book-only newsletter and campaign files should not include Headway, therapy-booking CTAs, or therapy marketing unless the user explicitly asks.

## Current Book Anchors

Use these unless the user gives newer explicit instructions:

- Title: `Unfolding Origami: A Memoir`
- Author: Loren Galese
- Release date: `July 20, 2026`
- Signed paperback price: `$24.99`
- ISBN: `979-8-9956116-0-8`
- Kindle ASIN: `B0H27BM8K1`
- Kindle preorder URL: `https://www.amazon.com/dp/B0H27BM8K1`
- Signed paperback Stripe URL: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`
- Writing/Substack URL: `https://substack.com/@quietalchemywloren`

Use the direct Kindle product URL for Kindle preorder CTAs, not the generic Amazon author page. Do not add Amazon Associates tags or tracking parameters unless requested.

## Editing Rules

- Prefer existing HTML/CSS patterns and class names.
- Use `apply_patch` for manual edits.
- Keep static pages simple and dependency-free.
- Preserve existing CSP/security headers unless a task explicitly requires a reviewed change.
- Preserve useful alt text; decorative images should use `alt=""` and `aria-hidden="true"` where appropriate.
- External links should use `target="_blank" rel="noopener noreferrer"`.
- Do not overwrite unrelated user changes in a dirty worktree.
- Do not commit, push, deploy, publish, or email unless explicitly requested.

## Validation

Use the smallest validation that matches the change:

- Static page preview: `python3 -m http.server 8080`
- Author page preview: `http://localhost:8080/author.html`
- Diff hygiene: `git diff --check`
- Link/source checks: `rg`
- Browser/mobile checks: Playwright is available as a dev dependency when visual QA is needed.

Expected local preview noise:

- Tailwind CDN production warning
- `/_vercel/speed-insights/script.js` 404 on the Python server

Those are acceptable for local static-server QA unless the task is specifically about those scripts.

## Final Response Shape

For implementation tasks, keep the final concise:

Summary:
- What changed

Files changed:
- Paths

Assumptions:
- Anything uncertain or intentionally scoped

Needs review:
- User-facing review points or placeholders

QA:
- Commands/checks run and pass/fail status
