# CTA Overview

These five items are native Flodesk button blocks. The PNGs in `references/` are visual proofs only; never upload a reference PNG as the clickable implementation.

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

The following five requirements apply to the two-button `Choose Your Copy` purchase group only:

- CTA 04, `Buy on Amazon`, appears first.
- CTA 04 and CTA 05 are full-width at 342px in the approved 390px mobile viewport, leaving 24px side margins.
- The two buttons stack vertically.
- The vertical separation between CTA 04 and CTA 05 is 12px.
- Both purchase buttons target a 54px desktop height.

The other three CTAs have their independently verified desktop and mobile behavior in their own files. Do not generalize the purchase-group rule without using those files.

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

## Reference-image boundary

Every PNG in `references/` must visibly state `REFERENCE ONLY — BUILD AS A NATIVE FLODESK BUTTON`. These files document appearance and spacing only. The five live buttons must be created from the native Flodesk button files in this folder.
