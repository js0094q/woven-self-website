# Magazine Ad — Unfolding Origami

## Files
- `magazine-ad.html`
- `magazine-ad-minimal.html`
- `magazine-ad-half-horizontal.html`
- `magazine-ad-half-vertical.html`
- `magazine-ad.css`
- `assets/qr-author.png`

## Dark Book-Cover Palette Revision
This revision uses only the *Unfolding Origami* book-cover palette. The ad field is dark midnight navy, smoky blue, origami blue, butterfly pink/coral, and warm title cream. Woven Self website colors, therapy-practice softness, beige backgrounds, gray-green text, and logo branding are intentionally excluded from the ad face.

## Final Print Concept Refinement
The half-page layouts use a local-author book-ad hierarchy:
- `SIGNED PAPERBACK PREORDER`
- `Unfolding Origami`
- `A Memoir by Loren Galese`
- `A local New Jersey author's memoir of survival, self-trust, and healing.`
- Sarah Edmondson endorsement excerpt
- `Preorder your signed copy`
- `wovenself.com/author`

The book cover remains the dominant sales object. Author context is handled through the byline and local-author copy, not a therapy-practice brand block.
Conference sell-sheet metadata is intentionally omitted from the magazine consumer ad.

## Half-Page Layouts
Files:
- `magazine-ad-half-horizontal.html`
- `magazine-ad-half-vertical.html`

Approximate working sizes:
- Horizontal: `7.5in x 4.875in`
- Vertical: `3.625in x 9.75in`

These must be adjusted if the magazine provides exact dimensions.

## Quote Source
Sarah Edmondson quote should match the quote stored in `author.html`.

## Preview
Open:
`marketing/magazine-ad/magazine-ad.html`
in a browser.

Optional minimal version:
`marketing/magazine-ad/magazine-ad-minimal.html`

Half-page versions:
- `marketing/magazine-ad/magazine-ad-half-horizontal.html`
- `marketing/magazine-ad/magazine-ad-half-vertical.html`

## Export to PDF
Use browser print:
- Paper size: Letter
- Scale: 100%
- Margins: None
- Background graphics: On

## Exported Visuals
Final generated files live in:
`marketing/magazine-ad/exports/`

Files:
- `magazine-ad.png` — print proof image, 2550x3300px
- `magazine-ad.pdf` — print proof PDF, Letter size
- `magazine-ad.jpg` — lightweight full-page proof image
- `magazine-ad-minimal.png` — alternate print proof image
- `magazine-ad-minimal.pdf` — alternate print proof PDF
- `magazine-ad-preview.jpg` — lightweight preview image
- `magazine-ad-half-horizontal.png` — half-page horizontal print proof image, approximately 2250x1463px
- `magazine-ad-half-horizontal.pdf` — half-page horizontal print proof PDF, 7.5in x 4.875in
- `magazine-ad-half-horizontal.jpg` — lightweight half-page horizontal proof image
- `magazine-ad-half-vertical.png` — half-page vertical print proof image, approximately 1088x2925px
- `magazine-ad-half-vertical.pdf` — half-page vertical print proof PDF, 3.625in x 9.75in
- `magazine-ad-half-vertical.jpg` — lightweight half-page vertical proof image
- `magazine-ad-half-horizontal-preview.jpg` — lightweight half-page horizontal preview image
- `magazine-ad-half-vertical-preview.jpg` — lightweight half-page vertical preview image

## Regenerate Exports
Run:

```bash
npm install
npm run export:magazine-ad
```

If Playwright browsers are missing, run:

```bash
npx playwright install chromium
```

## QA Requirements
Run:

```bash
npm run export:magazine-ad
git diff --check -- marketing/magazine-ad package.json package-lock.json
```

Verify:

```text
Half-page horizontal PNG exists.
Half-page horizontal PNG is approximately 2250x1463.
Half-page vertical PNG exists.
Half-page vertical PNG is approximately 1088x2925.
Half-page PDFs are created.
QR still decodes to https://wovenself.com/author.
Book cover is not distorted.
Sarah Edmondson quote is exact or clearly marked as a shortened excerpt.
No invented quote wording appears.
Background is visibly dark navy / smoky blue like the book cover.
Pink accents match the cover butterflies.
Blue accents match the origami box.
Printed URL remains wovenself.com/author.
CTA reads Preorder your signed copy.
CTA is readable as a warm paper object on the dark field.
No raw Stripe URL appears as printed text.
No therapy booking CTA appears.
No therapy-practice logo or booking language appears on the main ad face.
No Woven Self color variables, green-gray therapy-site colors, or conference metadata appear in the ad files.
No safe-area overflow.
No broken images.
```

If available, run:

```bash
identify marketing/magazine-ad/exports/*.png
pdfinfo marketing/magazine-ad/exports/*.pdf
```

## Visual QA Requirements
After generating exports, verify:

```text
Primary PNG exists.
Primary PNG is approximately 2550x3300px.
Minimal PNG exists.
Minimal PNG is approximately 2550x3300px.
Primary PDF exists.
Minimal PDF exists.
Preview JPG exists.
Primary JPG exists.
Half-page horizontal PNG exists.
Half-page horizontal PNG is approximately 2250x1463px.
Half-page horizontal JPG exists.
Half-page vertical PNG exists.
Half-page vertical PNG is approximately 1088x2925px.
Half-page vertical JPG exists.
Half-page PDFs exist.
Half-page horizontal preview JPG exists.
QR remains readable.
Book cover remains undistorted.
Sarah Edmondson quote is exact or clearly marked as a shortened excerpt.
Printed URL remains wovenself.com/author.
CTA reads Preorder your signed copy.
No raw Stripe URL appears as printed text.
No therapy booking CTA appears.
No therapy-practice logo or booking language appears on the main ad face.
The first visual association is the book cover, not the therapy website.
No safe-area overflow.
No broken images.
```

Use available tools, for example:

```bash
file marketing/magazine-ad/exports/*
identify marketing/magazine-ad/exports/*.png
pdfinfo marketing/magazine-ad/exports/*.pdf
```

If ImageMagick or pdfinfo are unavailable, use Node-based checks.

## Book Cover Color Palette
Magazine ad CSS uses this ad-local palette only:
- Midnight background: `#07101F`
- Navy background: `#0D182A`
- Smoke blue: `#1B2F46`
- Slate blue: `#2F4F70`
- Origami blue: `#5F86AD`
- Origami light: `#9FB9D3`
- Butterfly pink/coral: `#D86F82`
- Butterfly light: `#E89AAA`
- Title cream: `#F3E7D4`
- Paper cream: `#F7EFE4`
- Ink: `#0B1020`

## QR Code
The QR code points to:
`https://wovenself.com/author`

To regenerate:

```bash
npx --yes qrcode -e H -w 1200 -q 4 -o marketing/magazine-ad/assets/qr-author.png "https://wovenself.com/author"
```

## Final Submission Checklist
Confirm the magazine’s exact requirements before submission:
- Trim size
- Bleed
- Safe margin
- Color profile
- PDF/X requirement
- Minimum image resolution
- Accepted file type
