# Links and Buttons

Use these destinations exactly. Do not shorten them, add redirects, or append tracking parameters. `APPROVED SOURCE MATCH` means the URL matches the approved local newsletter source.

| ID | Element | Visible label | Destination | Type | Sequence position | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| hero-image | Hero book-stack image | Approved hero alt text; whole image is the hit area | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Clickable image | 02 | APPROVED SOURCE MATCH |
| cta-01 | Hero primary CTA | Buy the Book on Amazon | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Native button | 05 | APPROVED SOURCE MATCH |
| cta-02 | Hero secondary CTA | Read an Excerpt | `https://wovenself.com/excerpt-unfolding-origami.html` | Native button | 06 | APPROVED SOURCE MATCH |
| cta-03 | Interior-section CTA | Buy the Memoir Now | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Native button | 16 | APPROVED SOURCE MATCH |
| native-sarah-attribution | Sarah Edmondson attribution | Sarah Edmondson plus title line | `https://alittlebitculty.com/` | Native linked text | 19 | APPROVED SOURCE MATCH |
| cta-04 | Purchase-group Amazon CTA | Buy on Amazon | `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` | Native button | 22 | APPROVED SOURCE MATCH |
| cta-05 | Purchase-group signed-copy CTA | Order Your Signed Copy | `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00` | Native button | 23 | APPROVED SOURCE MATCH; deadline review after July 20, 2026 |
| author-instagram | Author social link | Loren Galese Author Instagram | `https://www.instagram.com/lorengaleseauthor/` | Native linked text | 27 | APPROVED SOURCE MATCH |
| author-book-page | Author/book link | Unfolding Origami book page | `https://wovenself.com/author.html` | Native linked text | 27 | APPROVED SOURCE MATCH |
| author-substack | Author newsletter link | Quiet Alchemy with Loren on Substack | `https://substack.com/@quietalchemywloren` | Native linked text | 27 | APPROVED SOURCE MATCH |
| author-site | Author website link | The Woven Self website | `https://wovenself.com/` | Native linked text | 27 | APPROVED SOURCE MATCH |
| compliance-unsubscribe | Flodesk compliance footer | Unsubscribe | Flodesk-generated; do not hardcode | Native compliance link | 28 | VERIFY IN TEST EMAIL |
| compliance-preferences | Flodesk compliance footer, only when Flodesk inserts it | Manage preferences | Flodesk-generated; do not hardcode | Native compliance link | 28 | CONDITIONAL; VERIFY IN TEST EMAIL |

The approved source contains no custom preference-management URL. Do not add a manual preferences link.

## Native button specifications

| Step | Label | Desktop width | Height | Alignment | Background | Text | Border/radius | Mobile behavior | Spacing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 05 | Buy the Book on Amazon | 249px target | 54px | Center | `#0D182A` | `#F3E7D4` | 2px navy / 4px | Full width inside 24px margins | 12px before Step 06 mobile |
| 06 | Read an Excerpt | 181px target | 54px | Center | `#F7EFE4` | `#0D182A` | 2px navy / 4px | Full width; second | 10px before piece 05 |
| 16 | Buy the Memoir Now | 214px target | 54px | Center | `#0D182A` | `#F3E7D4` | 2px navy / 4px | Full width | 8px before; 26px after |
| 22 | Buy on Amazon | Equal half-row | 54px | Center | `#0D182A` | `#F3E7D4` | 2px navy / 4px | Full width; first | 14px desktop gap; 12px mobile gap |
| 23 | Order Your Signed Copy | Equal half-row | 54px | Center | `#F7EFE4` | `#0D182A` | 2px navy / 4px | Full width; second | Immediately before piece 18 |

## Exact link-entry sequence

### Link 01 — Hero image

1. Select the Step 02 image.
2. Paste `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`.
3. Confirm the inventory alt text.
4. Save.
5. Open link settings again and confirm the complete saved destination.

### Link 02 — Buy the Book on Amazon

1. Open `native-elements/ctas/01-buy-the-book-on-amazon.md`.
2. Add a native Button block at Step 05, after upload piece 04.
3. Enter `Buy the Book on Amazon` exactly.
4. Paste `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` exactly.
5. Apply the CTA file's explicit desktop styling and 249px width target.
6. Apply its full-width mobile behavior and place it first in the hero CTA stack.
7. Save.
8. Reopen link settings and confirm the complete destination and exact label.
9. Preview desktop and mobile.
10. Confirm `Read an Excerpt` follows it with the documented mobile gap.

### Link 03 — Read an Excerpt

1. Open `native-elements/ctas/02-read-an-excerpt.md`.
2. Add a native Button block at Step 06, after `Buy the Book on Amazon`.
3. Enter `Read an Excerpt` exactly.
4. Paste `https://wovenself.com/excerpt-unfolding-origami.html` exactly.
5. Apply the CTA file's explicit desktop styling and 181px width target.
6. Apply its full-width mobile behavior, second-place stack order, and 12px gap above.
7. Save.
8. Reopen link settings and confirm the complete destination and exact label.
9. Preview desktop and mobile.
10. Confirm upload piece 05 follows the button.

### Link 04 — Buy the Memoir Now

1. Open `native-elements/ctas/03-buy-the-memoir-now.md`.
2. Add a native Button block at Step 16, after upload piece 13.
3. Enter `Buy the Memoir Now` exactly.
4. Paste `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` exactly.
5. Apply the CTA file's explicit desktop styling, 214px width target, and vertical spacing.
6. Apply its full-width mobile behavior.
7. Save.
8. Reopen link settings and confirm the complete destination and exact label.
9. Preview desktop and mobile.
10. Confirm upload piece 14 follows the button.

### Link 05 — Sarah Edmondson attribution

1. Select only the two attribution lines in Step 19.
2. Paste `https://alittlebitculty.com/`.
3. Confirm the Step 18 quotation image is unlinked.
4. Save.
5. Reopen link settings and confirm the destination and exact attribution text.

### Link 06 — Buy on Amazon

1. Open `native-elements/ctas/04-buy-on-amazon.md`.
2. Add a native Button block at Step 22, after upload piece 17.
3. Enter `Buy on Amazon` exactly.
4. Paste `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28` exactly.
5. Apply the CTA file's explicit styling and first equal-width desktop purchase column.
6. On mobile, set full width, stack order 1, and a 12px gap after it.
7. Save.
8. Reopen link settings and confirm the complete destination and exact label.
9. Preview desktop and mobile.
10. Confirm `Order Your Signed Copy` follows it and the routes remain distinct.

### Link 07 — Order Your Signed Copy

1. Open `native-elements/ctas/05-order-your-signed-copy.md`.
2. Add a native Button block at Step 23, after `Buy on Amazon`.
3. Enter `Order Your Signed Copy` exactly.
4. Paste `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00` exactly.
5. Apply the CTA file's explicit styling and second equal-width desktop purchase column.
6. On mobile, set full width, stack order 2, and a 12px gap above it.
7. Save.
8. Reopen link settings and confirm the complete Stripe destination and exact label.
9. Preview desktop and mobile.
10. Confirm upload piece 18 follows it and the Amazon destination was not copied into this button.

### Link 08 — Instagram

1. Select `Loren Galese Author Instagram` in Step 27.
2. Paste `https://www.instagram.com/lorengaleseauthor/`.
3. Save.
4. Reopen link settings and confirm the exact destination.

### Link 09 — Book page

1. Select `Unfolding Origami book page` in Step 27.
2. Paste `https://wovenself.com/author.html`.
3. Save.
4. Reopen link settings and confirm the exact destination.

### Link 10 — Substack

1. Select `Quiet Alchemy with Loren on Substack` in Step 27.
2. Paste `https://substack.com/@quietalchemywloren`.
3. Save.
4. Reopen link settings and confirm the exact destination.

### Link 11 — Woven Self website

1. Select `The Woven Self website` in Step 27.
2. Paste `https://wovenself.com/`.
3. Save.
4. Reopen link settings and confirm the exact destination.

### Link 12 — Unsubscribe

1. Select the Step 28 native footer.
2. Confirm Flodesk generated an unsubscribe link.
3. Do not paste a URL.
4. Save.
5. Verify the link from the internal test email.

### Link 13 — Preferences

1. Inspect the Step 28 native footer.
2. If Flodesk generated a preferences link, retain it unchanged.
3. If Flodesk did not generate one, do not add one.
4. Save.
5. When present, verify it from the internal test email.
