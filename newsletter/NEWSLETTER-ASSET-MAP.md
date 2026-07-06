# Newsletter Asset Map

This map shows the current editable homes for the newsletter pieces in this repo. Generated previews and image-only blocks are listed separately from copy sources so the source of truth stays clear.

| Newsletter Piece | Source File | Purpose | Notes |
|---|---|---|---|
| Subject line | `newsletter/book-launch-newsletter-template.md` | Primary launch newsletter send-setting source | Recommended subject plus alternate options live here. |
| Preview text | `newsletter/book-launch-newsletter-template.md` | Primary launch newsletter send-setting source | Recommended preview text plus alternate options live here. |
| Flodesk send settings | `flodesk-build-kit/01-send-settings.md` | Manual Flodesk setup reference | Mirrors the launch subject, preview text, sender, audience, and primary link. |
| Hero/logo image | `flodesk-build-kit/assets/unfolding-origami-flodesk-hero-card.png` | Primary Flodesk launch hero image | Use with `flodesk-build-kit/02-image-assets.md` and `flodesk-build-kit/03-flodesk-build-order.md`. |
| Header/logo assets | `newsletter/assets/flodesk/` | Newsletter logo image asset folder | Contains Woven Self header/footer logo variants for email assets. |
| Public newsletter image copies | `images/newsletter/` | Deployed/static copies of launch newsletter images | Used when Flodesk needs public image URLs. |
| Book cover image | `images/unfolding-origami-cover.jpg` | Launch newsletter cover image reference | Used by `newsletter/book-launch-newsletter-template.html`. |
| Book cover image, official ebook cover | `images/unfolding-origami-ebook-cover.jpg` | Newsletter Part 2 image generation source | Used by `newsletter/part-2-images/export-newsletter-images.mjs`. |
| Opening note from Loren | `newsletter/book-launch-newsletter-template.md` | Primary editable launch newsletter copy source | Section 2 is the editable source. |
| Opening note from Loren, Flodesk block | `flodesk-build-kit/copy-blocks/04-opening-note.txt` | Paste-ready native Flodesk text block | Keep aligned with the Markdown source before manual Flodesk build. |
| Synopsis/book description | `newsletter/book-launch-newsletter-template.md` | Launch newsletter book descriptor source | Current newsletter uses a short hero descriptor, not the full approved synopsis block. |
| Synopsis/book description, Flodesk block | `flodesk-build-kit/copy-blocks/03-hero-status.txt` | Paste-ready hero status descriptor | Current block is a compact descriptor for the hero card, not the back-cover synopsis. |
| Endorsement/praise quote | `newsletter/book-launch-newsletter-template.md` | Launch newsletter quote copy source | Section 4 contains the featured pull quote. |
| Endorsement/praise quote image | `flodesk-build-kit/assets/unfolding-origami-flodesk-quote-card.png` | Optional Flodesk image quote block | Upload only if using the hybrid launch build. |
| Preorder CTA/button copy | `newsletter/book-launch-newsletter-template.md` | Primary launch newsletter CTA source | Section 5 contains button text and Stripe target. |
| Preorder CTA/button copy, Flodesk block | `flodesk-build-kit/copy-blocks/08-preorder-cta.txt` | Paste-ready native Flodesk CTA copy | Add the real Flodesk button after this text block. |
| Signed paperback preorder link | `flodesk-build-kit/04-link-map.md` | Central launch newsletter link map | Stripe link must remain `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`. |
| Amazon Kindle preorder link | `newsletter/newsletter-part-2-flodesk.md` | Newsletter Part 2 Kindle CTA source | Uses the Amazon Kindle product URL for Part 2. |
| Price copy | `newsletter/newsletter-part-2-flodesk.md` | Newsletter Part 2 price/source copy | Signed paperback and Kindle price language lives in preorder reminder sections. |
| Excerpt section | `newsletter/newsletter-part-2-flodesk.md` | Primary editable Part 2 Flodesk copy source | Contains the excerpt headline, content note, and CTA label. |
| Excerpt plain-text backup | `newsletter/newsletter-part-2-plain-text.txt` | Plain-text backup for Newsletter Part 2 | Includes excerpt link and preorder links. |
| Excerpt website destination | `excerpt-unfolding-origami.html` | Hidden excerpt landing page | Keep hidden-by-link and outside sitemap/navigation unless explicitly changed. |
| Excerpt PDF asset | `assets/unfolding-origami-excerpt.pdf` | Hosted excerpt download/open asset | Linked from the hidden excerpt page. |
| Footer/signoff | `newsletter/book-launch-newsletter-template.md` | Primary launch newsletter footer copy source | Section 8 contains compact footer copy. |
| Footer/signoff, Flodesk block | `flodesk-build-kit/copy-blocks/11-footer.txt` | Paste-ready native Flodesk footer copy | Flodesk native unsubscribe footer still needs to render separately. |
| Social/Substack links | `flodesk-build-kit/copy-blocks/10-follow-book-journey.txt` | Paste-ready follow section | Contains author page and Substack links. |
| Social/Substack/link map | `flodesk-build-kit/04-link-map.md` | Central launch newsletter link map | Includes Stripe, author page, Substack, Instagram, and email. |
| Future updates section | `flodesk-build-kit/copy-blocks/09-future-updates.txt` | Paste-ready launch newsletter text block | Optional launch newsletter content block. |
| HTML preview/source file | `newsletter/book-launch-newsletter-template.html` | Visual/reference launch newsletter HTML | Reference only; Flodesk should be built with native blocks, not imported HTML. |
| Flodesk manual build guide | `flodesk/flodesk-build-guide-book-launch.md` | Native Flodesk build instructions | Treat as the final manual-build reference for the launch newsletter. |
| Flodesk build order | `flodesk-build-kit/03-flodesk-build-order.md` | Step-by-step launch build order | Lists the launch newsletter blocks in order. |
| Flodesk copy source files | `flodesk-build-kit/copy-blocks/` | Paste-ready launch newsletter copy block folder | Edit source copy before pasting into Flodesk. |
| Image-only export blocks | `newsletter/part-2-images/export-newsletter-images.mjs` | Newsletter Part 2 image block generator | Regenerates the Part 2 PNG/JPG image blocks and preview HTML. |
| Image-only export block map | `newsletter/part-2-images/flodesk-image-build-map.md` | Newsletter Part 2 upload/link map | Lists each generated image block, link target, and alt text. |
| Image-only export blocks | `newsletter/part-2-images/01-header-logo.png` through `newsletter/part-2-images/07-footer.png` | Generated Newsletter Part 2 image blocks | Do not edit generated images directly; update sources and rerun the generator. |
| Image-only HTML preview | `newsletter/part-2-images/preview.html` | Newsletter Part 2 generated preview | Visual check for generated image blocks. |
| HTML preview images | `newsletter/part-2-images/preview-desktop.png` and `newsletter/part-2-images/preview-mobile.png` | Newsletter Part 2 generated previews | Regenerated by the image export script. |
| Newsletter Part 2 build guide | `newsletter/newsletter-part-2-build-guide.md` | Manual Flodesk build guidance | Describes the Part 2 section order and image/text treatments. |
| Newsletter Part 2 Flodesk copy | `newsletter/newsletter-part-2-flodesk.md` | Primary editable Part 2 Flodesk copy source | Use this when manually building or revising the second newsletter. |

## How to Edit the Newsletter Without Getting Lost

1. Edit copy only in the source file listed in the table.
2. Regenerate exports only after source copy is approved.
3. Do not manually edit generated files unless the table marks them as source files.
4. Use the Flodesk source copy as the final manual-build reference.
