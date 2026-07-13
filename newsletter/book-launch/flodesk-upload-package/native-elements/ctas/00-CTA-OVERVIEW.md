# CTA Overview

These five files are production assembly specifications for native Flodesk button blocks. The clean PNGs in `references/` preserve the approved appearance and surrounding spacing without annotations. Use them for visual matching, but create every clickable CTA as the native Flodesk button documented in its Markdown file.

## Uniform sizing contract

- Desktop CTA size: 261px wide × 54px high for all five buttons.
- Mobile CTA size: 342px wide × 54px high at the approved 390px viewport.
- Reference canvas: 1280 × 140 pixels with a centered 522 × 108 button.
- Reference canvas backgrounds: `#F7EFE4` for CTA 01, CTA 02, CTA 04, and CTA 05; `#F3E7D4` for CTA 03.

At the approved 390px viewport, the 342px mobile width leaves 24px side margins. Each CTA file below keeps its label, destination, colors, padding, section spacing, and preceding and following elements explicit.

## Complete CTA table

| CTA number | Label | Destination | Section | Sequence position | Previous element | Next element |
| --- | --- | --- | --- | ---: | --- | --- |
| CTA 01 | Buy the Book on Amazon | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Hero CTA group | 05 | `upload-pieces/04-hero-eyebrow-heading-and-supporting-copy.png` | CTA 02 — Read an Excerpt |
| CTA 02 | Read an Excerpt | `https://wovenself.com/excerpt-unfolding-origami.html` | Hero CTA group | 06 | CTA 01 — Buy the Book on Amazon | `upload-pieces/05-butterfly-separator-02.png` |
| CTA 03 | Buy the Memoir Now | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Inside Unfolding Origami | 16 | `upload-pieces/13-inside-unfolding-origami.png` | `upload-pieces/14-butterfly-separator-04.png` |
| CTA 04 | Buy on Amazon | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Choose Your Copy purchase group | 22 | `upload-pieces/17-butterfly-separator-05-and-choose-your-copy.png` | CTA 05 — Order Your Signed Copy |
| CTA 05 | Order Your Signed Copy | `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00` | Choose Your Copy purchase group | 23 | CTA 04 — Buy on Amazon | `upload-pieces/18-signed-copy-deadline.png` |

## CTA hierarchy

| CTA | Hierarchy | Route role |
| --- | --- | --- |
| CTA 01 | Primary | Hero purchase route to Amazon paperback |
| CTA 02 | Secondary | Hero excerpt route |
| CTA 03 | Primary | Interior purchase route to Amazon paperback |
| CTA 04 | Primary | Purchase-group Amazon route |
| CTA 05 | Secondary | Purchase-group signed-copy Stripe route |

The Amazon and signed-copy routes are intentionally separate. Do not replace CTA 05 with an Amazon link and do not replace CTAs 01, 03, or 04 with the Stripe link.

## Mobile requirements

The following three requirements apply to CTA 04 and CTA 05 in the two-button `Choose Your Copy` purchase group only:

- CTA 04, `Buy on Amazon`, appears first.
- The two buttons stack vertically.
- The vertical separation between CTA 04 and CTA 05 is 12px.

Amazon-first order and the 12px mobile gap are specific to CTA 04 and CTA 05. The uniform dimensions above apply to all five CTAs; use each CTA file for its complete individual assembly settings.

## Hero image link

- Clickable upload asset: `upload-pieces/02-hero-visual.png`
- Approved source asset: `newsletter/book-launch/assets/email/unfolding-origami-launch-hero-corrected.jpg`
- Approved destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
- Assembly position: 02
- Alt text: `Unfolding Origami by Loren Galese displayed upright beside a stack of paperback copies.`

To build the link:

1. Add `upload-pieces/02-hero-visual.png` as the full-width Flodesk image block at Step 02.
2. Disable cropping and set the block to the full 640px content width.
3. Enter the exact alt text above.
4. Select the image block's link setting.
5. Paste the exact Amazon destination above.
6. Save the image block.
7. Reopen its link setting and confirm the saved URL still contains `B0H7YZ5N28` and has no query string or tracking parameter.
8. Use Flodesk preview to click the image and confirm that it opens the intended Amazon paperback product page.

## Production-image boundary

Each individual PNG in `references/` is a footer-free 1280 × 140 production canvas containing a centered 522 × 108 source-rendered button on its approved section background. No added reference label, watermark, instruction panel, or reference footer may be added. The production email still uses five native Flodesk buttons so the destinations remain clickable, accessible, and editable.
