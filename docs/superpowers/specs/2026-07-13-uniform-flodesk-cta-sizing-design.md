# Uniform Flodesk CTA Sizing Design

Date: 2026-07-13

## Status

Approved sizing direction; implementation pending design-record review.

## Goal

Make all five approved newsletter CTA components render at one uniform production size in the authoritative HTML, native Flodesk instructions, upload-package references, manifests, proofs, and validators. Preserve the approved newsletter design and content.

## Verified Current State

The Flodesk upload package currently mixes two reference-image scales:

- `Buy the Book on Amazon`, `Read an Excerpt`, and `Buy the Memoir Now` are exported on 1280-pixel-wide canvases.
- `Buy on Amazon` and `Order Your Signed Copy` are exported as 566-pixel-wide crops.
- Flodesk displays each selected image block at 600 pixels wide, so the two 566-pixel assets are enlarged while the 1280-pixel assets are reduced. This makes the final purchase pair look much larger even though their source HTML buttons are approximately the same height as the other CTAs.
- The authoritative HTML uses a 54-pixel desktop target for the purchase pair and full-width mobile purchase buttons in Amazon-first order with a 12-pixel gap.

The scaling mismatch is in the upload-package reference export, not in the approved labels or destinations.

## Approved CTA Inventory

The following order, labels, and destinations remain unchanged:

1. `Buy the Book on Amazon` — `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
2. `Read an Excerpt` — `https://wovenself.com/excerpt-unfolding-origami.html`
3. `Buy the Memoir Now` — `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
4. `Buy on Amazon` — `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
5. `Order Your Signed Copy` — `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`

Amazon and Stripe remain separate routes.

## Approved Sizing Contract

### Desktop Button

Every CTA uses the same visible desktop dimensions:

- Width: 261 CSS pixels
- Height: 54 CSS pixels
- Alignment: centered
- Border radius: 4 CSS pixels
- Label font: Arial or the existing equivalent Flodesk sans-serif
- Label size: 16 CSS pixels
- Label weight: 700
- Label line height: 18 CSS pixels

The existing primary and secondary color treatments remain unchanged:

- Primary: `#0D182A` background and border with `#F3E7D4` text
- Secondary: section-colored background with `#0D182A` border and text

### Retina Reference Asset

Every CTA reference PNG uses one identical 2x canvas:

- Canvas: 1280 x 140 pixels
- Rendered button: 522 x 108 pixels
- Horizontal canvas margin: 379 pixels on each side
- Vertical canvas margin: 16 pixels above and below
- Button alignment: centered on both axes

Canvas backgrounds match the approved section in which each CTA appears:

- CTA 01: `#F7EFE4`
- CTA 02: `#F7EFE4`
- CTA 03: `#F3E7D4`
- CTA 04: `#F7EFE4`
- CTA 05: `#F7EFE4`

The PNGs are visual references and scale-consistent assembly assets. The production links remain native Flodesk button blocks; no PNG becomes the only clickable implementation.

### Mobile Button

At the approved 390-pixel mobile viewport:

- Each CTA is 342 CSS pixels wide, using 24-pixel left and right margins.
- Buttons remain 54 CSS pixels high.
- Buttons stack vertically where the source already specifies stacking.
- In the `Choose Your Copy` group, `Buy on Amazon` appears before `Order Your Signed Copy`.
- The purchase pair has 12 CSS pixels of separation.

The mobile rule does not change section order, copy, or surrounding layout.

## Implementation Design

### Authoritative HTML

Update `newsletter/book-launch/launch-newsletter-preview.html` so `.button-link` has a 261-pixel desktop width and a 54-pixel height target. Preserve the existing mobile rule that makes `.mobile-button` full width. Ensure the first two hero buttons also receive the same approved full-width mobile behavior without changing their order or surrounding section spacing.

Do not alter labels, URLs, primary/secondary treatments, typography, border treatment, newsletter copy, or section order.

### Reference Exporter

Update `newsletter/book-launch/scripts/export_flodesk_upload_pieces.mjs` to render the exact visible button rectangle for each CTA at 2x scale and composite it onto the corresponding 1280 x 140 section-colored canvas. All five exports use the same algorithm; none uses a small per-button crop or a different full-row crop.

Regenerate:

- all five CTA reference PNGs;
- `all-ctas-contact-sheet.png`;
- desktop reassembly proof;
- mobile reassembly proof;
- any derived preview whose CTA geometry is sourced from the authoritative HTML.

No reference-only caption, design annotation, or proof footer is added to a production upload asset.

### Package Documentation And Manifests

Synchronize each CTA file, CTA overview, links-and-buttons guide, block map, assembly checklist, upload sequence, main package manifest, and CTA manifest with:

- 261 x 54 desktop geometry;
- 342 x 54 mobile geometry;
- exact reference-image dimensions of 1280 x 140;
- unchanged labels, destinations, order, colors, and placement;
- explicit native Flodesk button construction.

Every CTA remains present exactly once in the 28-position assembly sequence and exactly once in each manifest.

### Validation

Extend the CTA package validator and focused tests so they fail when:

- any CTA desktop width target is not 261 pixels;
- any CTA desktop height target is not 54 pixels;
- any CTA mobile width target is not 342 pixels;
- any CTA reference PNG is not exactly 1280 x 140 pixels;
- the five CTA reference canvases are not uniform;
- a label, destination, order, sequence position, or native-button requirement changes;
- the purchase pair is not Amazon-first with a 12-pixel mobile gap;
- a production asset includes a reference-only footer or annotation.

Use test-driven development: add or update the focused checks so they fail against the current mismatched assets and metadata before changing the exporter or source HTML.

## Acceptance Criteria

1. All five authoritative desktop CTA buttons render at 261 x 54 CSS pixels.
2. All five CTA reference PNGs are exactly 1280 x 140 pixels.
3. Each reference contains a centered 522 x 108 rendered button with the approved section background.
4. At a 390-pixel viewport, each CTA is 342 x 54 CSS pixels with 24-pixel side margins.
5. The purchase pair remains Amazon-first and vertically separated by 12 pixels on mobile.
6. All five labels and destinations match the authoritative source exactly.
7. All five CTAs appear exactly once in the assembly sequence and both manifests.
8. Desktop proof, mobile proof, and contact sheet visibly show all five CTAs at consistent scale.
9. CTA-focused tests fail for a reintroduced size mismatch and pass for the corrected package.
10. Newsletter validator, Flodesk package validator, focused CTA tests, package tests, both JSON parses, reference-image inspection, proof review, and `git diff --check` pass.

## Boundaries

- No CTA label changes.
- No destination changes.
- No newsletter-copy changes.
- No layout redesign or section reordering.
- No replacement of a native button with an image-only link.
- No changes to the unrelated `author.html` working-tree modification.
- No live Flodesk editing, email assembly, test send, scheduling, or sending.
- No deployment or push to `main`.
