# Magazine Ad — Unfolding Origami

## Files
- `magazine-ad.html`
- `magazine-ad-minimal.html`
- `magazine-ad-half-horizontal.html`
- `magazine-ad-half-vertical.html`
- `magazine-ad.css`
- `assets/qr-author.png`

## Loren Feedback Revision
This revision adds half-page layouts, incorporates Loren’s author image, uses pink accents sampled from the book-cover butterflies, and verifies Sarah Edmondson’s quote from the live author page.

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
- `magazine-ad-minimal.png` — alternate print proof image
- `magazine-ad-minimal.pdf` — alternate print proof PDF
- `magazine-ad-preview.jpg` — lightweight preview image
- `magazine-ad-half-horizontal.png` — half-page horizontal print proof image, approximately 2250x1463px
- `magazine-ad-half-horizontal.pdf` — half-page horizontal print proof PDF, 7.5in x 4.875in
- `magazine-ad-half-vertical.png` — half-page vertical print proof image, approximately 1088x2925px
- `magazine-ad-half-vertical.pdf` — half-page vertical print proof PDF, 3.625in x 9.75in
- `magazine-ad-half-horizontal-preview.jpg` — lightweight half-page horizontal preview image

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
Loren portrait is not distorted.
Sarah Edmondson quote is exact or clearly marked as a shortened excerpt.
No invented quote wording appears.
Pink accents are sampled from the cover, especially the butterflies.
Printed URL remains wovenself.com/author.
No raw Stripe URL appears as printed text.
No therapy booking CTA appears.
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
Half-page horizontal PNG exists.
Half-page horizontal PNG is approximately 2250x1463px.
Half-page vertical PNG exists.
Half-page vertical PNG is approximately 1088x2925px.
Half-page PDFs exist.
Half-page horizontal preview JPG exists.
QR remains readable.
Book cover remains undistorted.
Loren portrait remains undistorted.
Sarah Edmondson quote is exact or clearly marked as a shortened excerpt.
Printed URL remains wovenself.com/author.
No raw Stripe URL appears as printed text.
No therapy booking CTA appears.
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
Approximate colors sampled from `design/book-cover-unfolding-origami/front-cover-concept-v7-title-author-allcaps-larger.png`:
- Deep blue: `#040716`
- Muted blue: `#1C273C`
- Pale blue: `#6F98C0`
- Warm cream: `#F0E0CF`
- Soft gold / tan: `#A8A19A`
- Text dark: `#03050F`
- Rose accent: `#D36A7C`
- Butterfly pink accent: `#DD7888`

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
