# Final QA Checklist

Do not schedule or send until every applicable item is checked and reviewed.

## A. Content

- [ ] Subject is exactly `Unfolding Origami is officially here`.
- [ ] Preview text is exactly `After years of writing, revising, and unfolding, my memoir is now available.`
- [ ] Opening letter matches upload pieces 06–10 and `04-COPY-PASTE-TEXT.md` exactly.
- [ ] Revised acknowledgment paragraph is present exactly.
- [ ] `Amazon Bestseller` usage matches the approved source.
- [ ] Ranking is `#26 in Trauma Psychology eBooks`.
- [ ] Ranking is `#125 in Trauma Psychology Books`.
- [ ] Ranking is `#151 in Survival Biographies`.
- [ ] Ranking order is #26, #125, #151.
- [ ] Superseded editor-conversation wording is absent.
- [ ] No preorder-era wording remains except approved `preordered a copy` and signed-copy deadline language.
- [ ] No placeholder text remains.
- [ ] No upload piece or native element is duplicated.
- [ ] No upload piece or native element is missing.
- [ ] The 28-step assembly order matches `07-UPLOAD-SEQUENCE.md`.

## B. Links

- [ ] Link 01 — hero image opens the exact approved Amazon URL.
- [ ] Link 02 — `Buy the Book on Amazon` opens the exact approved Amazon URL.
- [ ] Link 03 — `Read an Excerpt` opens `https://wovenself.com/excerpt-unfolding-origami.html`.
- [ ] Link 04 — `Buy the Memoir Now` opens the exact approved Amazon URL.
- [ ] Link 05 — Sarah attribution opens `https://alittlebitculty.com/`; quotation remains unlinked.
- [ ] Link 06 — `Buy on Amazon` opens the exact approved Amazon URL.
- [ ] Link 07 — `Order Your Signed Copy` opens `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`.
- [ ] Link 08 — Instagram opens `https://www.instagram.com/lorengaleseauthor/`.
- [ ] Link 09 — book page opens `https://wovenself.com/author.html`.
- [ ] Link 10 — Substack opens `https://substack.com/@quietalchemywloren`.
- [ ] Link 11 — website opens `https://wovenself.com/`.
- [ ] Link 12 — Flodesk-native unsubscribe works in the test email.
- [ ] Link 13 — native preferences works when Flodesk inserts it; otherwise none was added manually.
- [ ] No affiliate tag, redirect, shortened URL, or new tracking parameter was added.

## B1. Native CTA build components

- [ ] All five CTA files under `native-elements/ctas/` were used individually.
- [ ] Each CTA appears exactly once in the 28-position assembly sequence.
- [ ] Each CTA appears exactly once in `package-manifest.json` and `native-elements/ctas/cta-manifest.json`.
- [ ] Each CTA reference PNG exists as an unannotated exact source crop with no label, watermark, instruction panel, or footer.
- [ ] `native-elements/ctas/references/all-ctas-contact-sheet.png` shows all five CTAs in approved order.
- [ ] The Amazon and Stripe purchase routes remain distinct.
- [ ] Every CTA remains a native Flodesk Button block; no reference image is the clickable implementation.
- [ ] The Step 02 hero image link is present and re-opened after saving.

## C. Upload Pieces

For every line, confirm the exact file, correct position, uncropped full-width display, no blur, no corruption, and the exact alt-text instruction in `05-IMAGE-INVENTORY.md`.

- [ ] Piece 01 — `01-author-identifier.png`.
- [ ] Piece 02 — `02-hero-visual.png`; entire image uses Link 01.
- [ ] Piece 03 — `03-butterfly-separator-01.png`; empty alt; unlinked.
- [ ] Piece 04 — `04-hero-eyebrow-heading-and-supporting-copy.png`.
- [ ] Piece 05 — `05-butterfly-separator-02.png`; empty alt; after both hero buttons.
- [ ] Piece 06 — `06-opening-letter-part-01.png`.
- [ ] Piece 07 — `07-amazon-bestseller-rankings.png`; exact claims present.
- [ ] Piece 08 — `08-opening-letter-part-02.png`; revised acknowledgment present.
- [ ] Piece 09 — `09-opening-letter-part-03.png`.
- [ ] Piece 10 — `10-opening-letter-part-04.png`.
- [ ] Piece 11 — `11-butterfly-separator-03.png`; empty alt.
- [ ] Piece 12 — `12-interior-book-spread.png`; no crop and no link.
- [ ] Piece 13 — `13-inside-unfolding-origami.png`; native Step 16 follows.
- [ ] Piece 14 — `14-butterfly-separator-04.png`; empty alt.
- [ ] Piece 15 — `15-sarah-edmondson-endorsement.png`; quotation unlinked; attribution follows natively.
- [ ] Piece 16 — `16-reader-review.png`; no CTA or link.
- [ ] Piece 17 — `17-butterfly-separator-05-and-choose-your-copy.png`; native purchase buttons follow.
- [ ] Piece 18 — `18-signed-copy-deadline.png`; after both purchase buttons.
- [ ] Piece 19 — `19-support-the-book.png`.
- [ ] Piece 20 — `20-closing-letter.png`; native author links follow.
- [ ] Every file visually matches its thumbnail in `reference/upload-pieces-contact-sheet.png`.

## D. Desktop

- [ ] Content width is 640px or the exact nearest Flodesk control.
- [ ] All 28 steps appear in order with no extra blocks.
- [ ] Consecutive image pieces touch without unintended gaps.
- [ ] Native-element alignment matches `reference/reassembled-upload-pieces-proof.png`.
- [ ] Buttons have consistent 54px height.
- [ ] Purchase buttons share one equal-width row with 14px separation.
- [ ] No clipping, overflow, image crop, or unintended white gap appears.
- [ ] Full build matches `reference/approved-desktop-preview.png` top to bottom.

## E. Mobile

- [ ] Amazon purchase button appears before signed-copy button.
- [ ] Purchase buttons are stacked and full width.
- [ ] Purchase-button visual separation is 12px.
- [ ] Hero buttons are stacked and full width.
- [ ] Text inside every raster piece is readable at 100% zoom.
- [ ] Rasterized body text is compared with the approved 16px mobile intent; any material reduction is reviewed and approved.
- [ ] No text is clipped.
- [ ] No horizontal overflow appears.
- [ ] Every butterfly remains visible.
- [ ] Paragraph groups remain readable and in order.
- [ ] Full build is compared with `reference/approved-mobile-preview.png` and `reference/reassembled-upload-pieces-mobile-proof.png`.

## F. Test Email

- [ ] Send only to the designated internal test recipient.
- [ ] Open in desktop Gmail.
- [ ] Open in mobile Gmail.
- [ ] Open in another available email client.
- [ ] Click every link individually.
- [ ] Confirm Flodesk generated the unsubscribe link and physical mailing address.
- [ ] Confirm sender name.
- [ ] Confirm reply-to address.
- [ ] Confirm exact subject line.
- [ ] Confirm exact preview text.

## G. Stop Point

STOP. Do not schedule or send until the completed checklist, mobile text-size review, and test email have been reviewed and approved.
