# Magazine Ad — Unfolding Origami

## Files
- `magazine-ad.html`
- `magazine-ad-minimal.html`
- `magazine-ad.css`
- `assets/qr-author.png`

## Preview
Open:
`marketing/magazine-ad/magazine-ad.html`
in a browser.

Optional minimal version:
`marketing/magazine-ad/magazine-ad-minimal.html`

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
QR remains readable.
Book cover remains undistorted.
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
