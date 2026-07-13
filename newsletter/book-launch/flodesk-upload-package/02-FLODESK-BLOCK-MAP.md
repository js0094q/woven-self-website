# Flodesk Block Map

## Global settings

- Subject: `Unfolding Origami is officially here`
- Preview text: `After years of writing, revising, and unfolding, my memoir is now available.`
- Maximum content width: 640px.
- Outer background: `#07101F`.
- Image blocks: one column, centered, full content width, no crop, 0 internal padding, 0 inter-image gap.
- Master uploads: 1280px wide PNG, exported at 2× the approved 640px desktop content width.
- Desktop CTA size: 261px wide × 54px high for all five buttons.
- Mobile CTA size: 342px wide × 54px high at the approved 390px viewport.
- Reference canvas: 1280 × 140 pixels with a centered 522 × 108 button.
- `VISUAL MATCH REQUIRED`: Flodesk controls that do not accept an exact width or 0px gap must be set to the nearest control and checked against the desktop proof.
- Mobile review: image text scales with the image. Compare a real mobile test against the approved mobile preview before sending.

## Upload-piece map

Every row below is one Image block. The source for every piece is `../launch-newsletter-preview.html`, rendered at 640 CSS pixels with device scale factor 2. Text styling, backgrounds, borders, shadows, line spacing, and internal spacing are already baked into the PNG and must not be recreated.

| Step | Piece | Content | Layout and alignment | Desktop appearance | Mobile appearance | Background | Spacing | Assembly warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `upload-pieces/01-author-identifier.png` | Author identifier | One column; centered | 640px navy band | Full available width | `#0D182A` | 0 block padding | Do not replace with native text. |
| 02 | `upload-pieces/02-hero-visual.png` | Approved book-stack hero | One column; centered; clickable | 640px × 360px display | Full width; proportional | Image | 0 | Do not crop; link entire image to Amazon. |
| 03 | `upload-pieces/03-butterfly-separator-01.png` | Butterfly separator | One column | Full width | Full width | `#F7EFE4` | Baked in | Empty alt text; do not isolate the butterfly. |
| 04 | `upload-pieces/04-hero-eyebrow-heading-and-supporting-copy.png` | Hero eyebrow, heading, support | One column; centered | Full 640px composition | Scale proportionally | `#F7EFE4` | Baked in | Do not insert manual line breaks or separate text blocks. |
| 07 | `upload-pieces/05-butterfly-separator-02.png` | Butterfly separator | One column | Full width | Full width | `#F7EFE4` | Baked in | Place after both native hero buttons. |
| 08 | `upload-pieces/06-opening-letter-part-01.png` | Greeting and first paragraph | One column; left-aligned text within image | Full width | Scale proportionally | `#F7EFE4` | Baked in | Do not add native paragraph spacing. |
| 09 | `upload-pieces/07-amazon-bestseller-rankings.png` | Bestseller sentence and three rankings | One column; left | Full width | Scale proportionally | `#F7EFE4` | Baked in | Confirm #26, #125, #151; do not add a badge. |
| 10 | `upload-pieces/08-opening-letter-part-02.png` | Letter paragraphs including acknowledgment | One column; left | Full width | Scale proportionally | `#F7EFE4` | Baked in | Revised acknowledgment must remain exact. |
| 11 | `upload-pieces/09-opening-letter-part-03.png` | Middle letter paragraphs | One column; left | Full width | Scale proportionally | `#F7EFE4` | Baked in | Do not split or reorder. |
| 12 | `upload-pieces/10-opening-letter-part-04.png` | Closing letter paragraphs and Loren signature | One column; left | Full width | Scale proportionally | `#F7EFE4` | Baked in | Do not add a separate signature block. |
| 13 | `upload-pieces/11-butterfly-separator-03.png` | Butterfly separator | One column | Full width | Full width | `#F7EFE4` | Baked in | Place before interior spread. |
| 14 | `upload-pieces/12-interior-book-spread.png` | Open-book interior image | One column; centered | 640px × 360px display | Full width; proportional | Image | 0 | Do not crop or link. |
| 15 | `upload-pieces/13-inside-unfolding-origami.png` | Section heading and two paragraphs | One column; left | Full width | Scale proportionally | `#F3E7D4` | Baked in | Native button follows immediately. |
| 17 | `upload-pieces/14-butterfly-separator-04.png` | Rule and butterfly transition | One column | Full width | Full width | `#F3E7D4` | Baked in | Do not recreate the rule natively. |
| 18 | `upload-pieces/15-sarah-edmondson-endorsement.png` | Sarah quotation only | One column; left | Full width navy quote | Scale proportionally | `#0D182A` | Baked in | Keep image unlinked; native attribution follows. |
| 20 | `upload-pieces/16-reader-review.png` | Complete reader review card | One column; centered | Full width pink panel | Scale proportionally | `#F6E3E2` | Baked in | Do not add a CTA or link. |
| 21 | `upload-pieces/17-butterfly-separator-05-and-choose-your-copy.png` | Butterfly, heading, supporting copy | One column; centered | Full width | Scale proportionally | `#F7EFE4` | Baked in | Purchase buttons follow; do not rasterize them. |
| 24 | `upload-pieces/18-signed-copy-deadline.png` | Signed-copy deadline | One column; centered | Full width | Scale proportionally | `#F7EFE4` | Baked in | Place after both purchase buttons. |
| 25 | `upload-pieces/19-support-the-book.png` | Support heading and paragraphs | One column; left | Full width title-cream panel | Scale proportionally | `#F3E7D4` | Baked in | Do not add extra CTA. |
| 26 | `upload-pieces/20-closing-letter.png` | Closing and Loren Galese signature | One column; left | Full width paper-cream panel | Scale proportionally | `#F7EFE4` | Baked in | Native footer links follow. |

## Native element map

### Step 05 — Buy the Book on Amazon

- Source HTML element: first `.email-shell a.button-link`, exact text `Buy the Book on Amazon`.
- Label: `Buy the Book on Amazon`.
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`.
- Flodesk block type: Button.
- Styling: centered; 261px desktop target; 54px high; `#0D182A` background; `#F3E7D4` text; 2px `#0D182A` border; 4px radius; Arial 16px/700; 26px horizontal and 16px vertical padding.
- Desktop behavior: fixed 261px target width and centered.
- Mobile behavior: 342px full width inside 24px side margins at the 390px viewport; hero stack order 1; 12px gap after.
- Preceding upload piece: `upload-pieces/04-hero-eyebrow-heading-and-supporting-copy.png`.
- Following element: native CTA `Read an Excerpt`.
- Reference image: `native-elements/ctas/references/01-buy-the-book-on-amazon-reference.png`.
- Common assembly mistake: placing the label in an adjacent image or linking the reference PNG instead of adding a native button.

### Step 06 — Read an Excerpt

- Source HTML element: second `.email-shell a.button-link`, exact text `Read an Excerpt`.
- Label: `Read an Excerpt`.
- Destination: `https://wovenself.com/excerpt-unfolding-origami.html`.
- Flodesk block type: Button.
- Styling: centered; 261px desktop target; 54px high; `#F7EFE4` background; `#0D182A` text and 2px border; 4px radius; Arial 16px/700; 26px horizontal and 16px vertical padding.
- Desktop behavior: fixed 261px target width and centered.
- Mobile behavior: 342px full width inside 24px side margins at the 390px viewport; hero stack order 2; 12px gap before and 10px gap after.
- Preceding element: native CTA `Buy the Book on Amazon`.
- Following upload piece: `upload-pieces/05-butterfly-separator-02.png`.
- Reference image: `native-elements/ctas/references/02-read-an-excerpt-reference.png`.
- Common assembly mistake: reversing the hero CTAs or substituting an inferred excerpt route.

### Step 16 — Buy the Memoir Now

- Source HTML element: third `.email-shell a.button-link`, exact text `Buy the Memoir Now`.
- Label: `Buy the Memoir Now`.
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`.
- Flodesk block type: Button.
- Styling: centered; 261px desktop target; 54px high; `#0D182A` background; `#F3E7D4` text; 2px `#0D182A` border; 4px radius; Arial 16px/700; 26px horizontal and 16px vertical padding.
- Desktop behavior: fixed 261px target width; 8px above and 26px below.
- Mobile behavior: 342px full width inside 24px side margins at the 390px viewport; retain 8px above and 26px below.
- Preceding upload piece: `upload-pieces/13-inside-unfolding-origami.png`.
- Following upload piece: `upload-pieces/14-butterfly-separator-04.png`.
- Reference image: `native-elements/ctas/references/03-buy-the-memoir-now-reference.png`.
- Common assembly mistake: placing it after piece 14 or using a generic Amazon author URL.

### Step 19 — Sarah Edmondson attribution

- Flodesk block type: Text with link.
- Content: exact two lines from `04-COPY-PASTE-TEXT.md`.
- Layout/alignment: left; full-width navy continuation; 24px side padding.
- Styling: `#9FB9D3` link text; retain italic intent on *A Little Bit Culty*.
- Spacing: visually continue Step 18 with no cream gap. `VISUAL MATCH REQUIRED` if Flodesk inserts text-block padding.
- Warning: link only the attribution, never the quotation image.

### Step 22 — Buy on Amazon

- Source HTML element: first `.email-shell a.purchase-button`, exact text `Buy on Amazon`.
- Label: `Buy on Amazon`.
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`.
- Flodesk block type: Button.
- Styling: centered; 261px desktop target in a 536px row; 54px high; `#0D182A` background; `#F3E7D4` text; 2px `#0D182A` border; 4px radius; Arial 16px/700; 18px horizontal and 16px vertical padding.
- Desktop behavior: first of two 261px buttons in the 536px purchase row with a 14px group gap.
- Mobile behavior: 342px full width inside 24px side margins at the 390px viewport; purchase stack order 1; 12px gap after.
- Preceding upload piece: `upload-pieces/17-butterfly-separator-05-and-choose-your-copy.png`.
- Following element: native CTA `Order Your Signed Copy`.
- Reference image: `native-elements/ctas/references/04-buy-on-amazon-reference.png`.
- Common assembly mistake: placing the signed-copy CTA first or replacing the live button with the reference PNG.

### Step 23 — Order Your Signed Copy

- Source HTML element: second `.email-shell a.purchase-button`, exact text `Order Your Signed Copy`.
- Label: `Order Your Signed Copy`.
- Destination: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`.
- Flodesk block type: Button.
- Styling: centered; 261px desktop target in a 536px row; 54px high; `#F7EFE4` background; `#0D182A` text and 2px border; 4px radius; Arial 16px/700; 18px horizontal and 16px vertical padding.
- Desktop behavior: second of two 261px buttons in the 536px purchase row with a 14px group gap.
- Mobile behavior: 342px full width inside 24px side margins at the 390px viewport; purchase stack order 2; 12px gap before.
- Preceding element: native CTA `Buy on Amazon`.
- Following upload piece: `upload-pieces/18-signed-copy-deadline.png`.
- Reference image: `native-elements/ctas/references/05-order-your-signed-copy-reference.png`.
- Common assembly mistake: copying the Amazon route into this button instead of the distinct Stripe route.

### Step 27 — Author links and copyright

- Flodesk block type: Text with four links.
- Layout/alignment: centered, full-width navy block; four link lines plus unlinked copyright.
- Styling: approved light text on `#0D182A`; underline link intent; at least 10px tappable separation mobile.
- Spacing: no cream gap after piece 20.
- Warning: use all four destinations exactly; copyright is not clickable.

### Step 28 — Flodesk compliance footer

- Flodesk block type: Footer.
- Layout/alignment: full width; centered; permit natural mobile wrapping.
- Styling: navy background, smoke-blue text, blue top divider.
- Content: Flodesk-generated mailing address and unsubscribe link; preferences only when generated natively.
- Warning: never rasterize or hardcode legal links.
