# Print Template Specs

## Sell Sheet

Source path: `templates/sell-sheet.html`

Format: `8.5 x 11 in`

Output: `exports/sell-sheet.pdf`

Required sections:

- Book title and hook.
- Book description.
- Book cover image from `images/unfolding-origami-cover.jpg`.
- Emotional threads.
- Preorder CTA.
- QR code from `assets/preorder-qr.svg`.
- Contact details.

Required content:

- `Unfolding Origami: A Memoir`
- `Loren Galese`
- `Some wounds don't bleed - they fold you inward.`
- `A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.`
- `Preorders are open. Signed copies are $24.99 and include a surprise from Loren. Release date: July 20.`
- `Preorder Now`
- `wovenself.com/author`
- `loren@wovenself.com`
- `wovenself.com`
- `Substack @quietalchemywloren`

Emotional threads list:

- Rapid intimacy / false destiny.
- Confusion before recognition.
- The split self.
- Memory fragmentation.
- The body knew first.
- Reality reversal.
- The delayed collapse.
- Naming what happened.
- Folding back to yourself.
- Re-defining your shape.

Design requirements:

- Use the Quiet Paper System.
- Keep text editable in source HTML.
- Use restrained origami and fold-line motifs.
- Keep the generated preorder QR code pointed at `https://wovenself.com/author`.
- Avoid rasterized text.
- Keep footer contact details clean and readable.

## Table Tent

Source path: `templates/table-tent.html`

Format: `6 x 9 in portrait`

Output: `exports/table-tent.pdf`

Required content:

- `Unfolding Origami: A Memoir`
- `Loren Galese, LPC, ACS`
- `Some wounds don't bleed - they fold you inward.`
- `Coming July 2026`
- `A memoir about coercive control, trauma, identity, and the nonlinear journey back to self-trust.`
- `Join the preorder & launch list`
- `wovenself.com/author`
- `Email: loren@wovenself.com`
- `Social/Substack: @quietalchemywloren`
- `Website: wovenself.com`

Required layout elements:

- Book cover image from `images/unfolding-origami-cover.jpg`.
- QR code from `assets/preorder-qr.svg`.
- Dark navy and pink visual system matching the most recent table tent reference.
- Clean readable footer.
- Editable HTML text.

Print requirements:

- Page must be portrait `6 x 9 in`.
- Margins must keep all content inside the visible border.
- QR code must be at least `0.25in` from all page edges.
- Do not rasterize text.
- Keep contrast high enough for bookstore, event table, and signing-table use.
