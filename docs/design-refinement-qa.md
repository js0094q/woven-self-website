# Global website refinement: implementation and QA

Implemented against repository commit `a27696f` on `codex/global-design-refinement`.

## Components and shared styles

- `styles.css` now owns the CTA system, typography scale, readable text measure, card spacing, header geometry, focus states, and responsive navigation presentation.
- CTAs use two variants, `btn-primary` and `btn-secondary`, with a separate `btn-label` and decorative SVG `btn-arrow` inside the same clickable anchor or button. Primary actions use deep green, white text, and a pink arrow circle. Secondary actions use transparent surfaces and simple arrows, with cream text on existing dark memoir sections.
- Controls share a 52px minimum height, 15px Inter labels at weight 600, 12px label-to-arrow gap, 28px arrow area, pill radius, and 10px by 20px padding. Long labels can increase the height without colliding with the arrow.
- Shared tokens define the existing palette, font roles, H1/H2/H3 scales, section spacing, card dimensions, control dimensions, and focus colors. Existing palette aliases reference the underlying tokens.
- Cards use a 24px radius and responsive 24px to 36px padding. Path cards share vertical rhythm and push their final CTA to the bottom. Distinct author panels retain their existing art direction.
- Inter and Playfair Display remain the font pairing. Page, section, and card headings share a hierarchy; body copy uses a 16px baseline and 70ch maximum measure. Small informational headings can use the sans-serif `heading-small` role.
- The header uses a compact logo/name row and a desktop navigation row. Mobile uses a logo/menu row and a modest name row. The repeated name no longer competes with page titles.
- `site.js` replaces repeated menu handlers. Closed drawers are inert and hidden from assistive technology; open drawers receive focus, contain Tab navigation, lock background scrolling, and make background content inert. Escape, backdrop clicks, close controls, links, and desktop resizing close the drawer.
- Form loading and reset states update the label without deleting its arrow. Therapy now begins with its H1, followed by meaningful section headings.
- Existing logo artwork is also reused as the shared favicon.

## Duplicate implementations removed

- Deleted `site-updates.css` and removed every public reference to it.
- Removed outline, author primary/secondary/accent, and preorder button appearance variants, CSS-generated CTA arrows, and competing header dimensions.
- Removed conflicting CTA font, padding, radius, shadow, and display utilities, plus conflicting card padding/radius utilities.
- Removed repeated inline mobile-menu handlers. One same-origin script handles the interaction on every public page.
- Preserved ordinary inline prose, social, and email links as links.

## Pages affected

Home, About, Author, Blog index, Blog post template, Coaching, Peer Support, Speaking, Substack, Therapy, Preorder, and Preorder Thank You. The excerpt redirect and all route configuration remain unchanged.

## Fresh verification

- `node --test tests/design-system.test.mjs`: six tests passed. Covers public markup, shared asset references, menu semantics, CTA anatomy, form labels, headings, image alt attributes, and literal or encoded em dashes.
- `node tests/design-system-browser.mjs http://127.0.0.1:8765`: passed for 13 routes at 1440, 1280, 768, and 320px. Includes a rendered blog post and a deliberate missing-post recovery state.
- Browser checks cover horizontal overflow, label clipping, arrow overlap and containment, minimum touch targets, card containment, hover behavior, representative CTA text contrast, visible keyboard focus, drawer focus entry/return, Tab containment, Escape, backdrop closing, scroll locking, and desktop resize behavior.
- Inspected saved desktop/mobile screenshots of Home, Author, and Therapy, plus Coaching at tablet width. No blocking visual inconsistencies were observed in those captures. Long peer-support labels wrap within their controls on narrow screens.
- `node tests/security-headers.test.mjs`: passed. CSP and deployment security configuration remain unchanged.
- `git diff --check`: passed.
- Parsed all 13 public HTML files and compared anchor destinations with the baseline: every destination and ordering is preserved.
- Changed-source scan found no absolute workstation paths. Existing portrait metadata checks passed for all three portraits checked by the repository privacy test.
- Edited copy contains no em dashes, including HTML-encoded forms.

## Existing checks and review limits

- The existing `tests/excerpt-route.test.mjs` fails because it expects an excerpt PDF rewrite and no HTML redirect page. The current baseline instead redirects to Amazon. The test and routing were left unchanged because route changes are outside this workstream.
- The full existing repository-privacy test cannot run in this sparse checkout because it reads excluded publishing/design files from disk. Changed-source checks and its existing portrait metadata checks passed; a full-tree run remains unverified.
- Local Vercel Speed Insights 404s are expected on the Python preview server. The missing-post fixture's deliberate 404 is checked together with its visible recovery message and link.
- Local changes are committed for review. No production publication is part of this workstream.

See `design-system.md` for reusable component anatomy and token values.
