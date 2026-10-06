# Final website integration QA

## Scope

Base: current `main`, `a27696fe3f8f2a17d43793d5aa4d76bdbdc93e9a`, confirmed against GitHub and both Vercel production projects.

Integrated workstreams: `1e2260f` global design, `4dcfc84` site continuity, and `2914ceb` post-college group. Applied in that order on `codex/final-website-integration`.

## Integration corrections

- Reconciled overlapping page markup, retained coaching and post-college messaging, and consolidated active navigation/contact behavior into `site.js`.
- Removed retired `site-updates.css` and the unused duplicate navigation script.
- Reconciled all CTA markup with the shared label, arrow, typography, radius, spacing, hover, and focus system.
- Restored menu positioning, skip-link behavior, footer layout, and group-form styles that were lost during the initial merge.
- Preserved button structure through submission errors/retries and added a bounded timeout to the group form.
- Removed the duplicate homepage group card.
- Updated public signed-copy copy and Product metadata after Loren confirmed signed copies are available to order and ship now. Preserved checkout URLs, price, ISBN, and existing routes.
- Added the existing logo as the favicon after browser QA identified the default favicon request returning 404.
- Increased the standalone homepage social-link tap areas to 44 pixels.

## Verified checks

- All 10 source regression checks pass: shared design, continuity, security headers, complete repository privacy, and excerpt routing.
- Existing browser regression passes 13 route cases at 1440, 1280, 768, and 320 pixels, including mobile menu keyboard/resize behavior, CTA geometry, hover/focus states, and representative CTA contrast.
- Independent responsive matrix covers all 12 navigable pages at 1440, 1280, 768, 390, and 320 pixels: 60 successful HTTP responses, zero horizontal page overflow, associated form labels, and intact CTA controls. Screenshots were captured after scrolling to load lazy images. Menu opening/closing and a visible keyboard skip link were verified.
- Final navigation smoke passes all 39 checks: actual header/footer links, homepage and service CTAs, group interest anchor, memoir formats anchor, desktop/mobile skip links, and mobile Contact navigation with correct focus after smooth scrolling completes.
- All 13 public HTML files have valid local link/asset targets; all five JSON-LD blocks and sitemap XML parse.
- No literal or encoded em dashes in edited public HTML, stale group framing, merge markers, retired stylesheet imports, or public local-development paths.
- Full tracked-file scan covered 157 existing files with no credential-file candidates or matches for common private-key and secret-token patterns. The repository privacy test includes portrait metadata checks.

## Forms

Both forms passed required-field and malformed-email validation, keyboard submission, simulated HTTP failure, value preservation, retry, restored button anatomy, error focus, and announced success focus. Mocked requests were isolated from Formspree.

Separate safe live tests: Formspree accepted one synthetic interest-list POST with HTTP 200; a synthetic contact submission reached the browser success state. Inbox receipt and recipient routing remain unverified because authenticated Formspree dashboard access is unavailable. No credentials or clinical information were submitted.

## Legacy excerpt test

Commit `b3aff284f08cbe9f978796b29bf64b64b46a1709` intentionally replaced the PDF route with the Amazon excerpt destination. The old test still expected the retired PDF behavior on unchanged main. Updated the test to assert both current redirects, the static fallback, and the author CTA; no test was disabled or deleted.

## Deployment contract

Existing static HTML/CSS/JavaScript deployment, repository-root output, no application build step and no new environment variables. `vercel.json` and security policy are unchanged. Existing GitHub-to-Vercel production deployment uses `main`.

- `woven-self-website`: `wovenself.com`.
- `woven-self-website-main`: `www.wovenself.com`.

Deployment and production smoke results are recorded separately after publication.
