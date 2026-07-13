# Corrected Mockups And Launch Newsletter Design

Date: 2026-07-09

## Status

Approved implementation specification; production work not yet authorized.

## Context

The existing `newsletter/book-launch/` package uses promotional mockups whose visible front-cover planes contain an outdated subtitle position. The approved ebook cover centers `A Memoir` beneath `UNFOLDING ORIGAMI`. The newsletter also needs a coordinated launch-day copy, link, review, deadline, and decorative-butterfly revision.

The work is local campaign production only. It does not change the public website, book-cover design, InDesign source, deployment configuration, or unrelated newsletter packages.

## Approved Sources

- Final front cover: `exports/kdp-ebook-cover-1600x2560-fixed.png`
- Paperback wrap and spine reference: `exports/kdp-paperback-cover-updated-synopsis-final.pdf`
- Ereader and physical-cover mockup: `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web).png`
- Open-book mockup: `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-OpenBook-Mockup-(linkedin).png`
- Instagram book-stack mockup: `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta).png`
- LinkedIn book-stack mockup: `/Users/josephstewart/Downloads/Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin).png`
- Approved decorative art: `images/unfolding-origami-butterfly-1.png`, `images/unfolding-origami-butterfly-2.png`, and `images/unfolding-origami-butterfly-3.png`

The final ebook cover and rendered paperback wrap both visibly confirm the centered subtitle, intact title, endorsement, butterflies, origami box, and author credentials.

Before copying assets, verify each absolute source path exists. If both PNG and JPEG versions exist, compare pixel dimensions and compression quality and use the highest-quality source without silently changing the approved composition. Record the selected source and SHA-256 hash in the package README.

## Goals

1. Replace the outdated complete cover artwork on every visible front or top cover plane in the three affected promotional mockups.
2. Preserve the existing scene, perspective, book dimensions, spines, page blocks, lighting, texture, highlights, shadows, and edge softness.
3. Preserve the open-book mockup byte-identically because it contains no cover plane.
4. Update the existing launch-newsletter source, plain text, HTML preview, Flodesk guide, link map, package README, and preview captures as one coordinated package.
5. Produce corrected masters, optimized email assets, social variants, and old/corrected/reference comparison proofs.

## Non-Goals

1. Do not redesign, retype, redraw, or generatively recreate the cover.
2. Do not modify the paperback PDF or InDesign source.
3. Do not paste front-cover art onto spines or fabricate hidden wrap artwork.
4. Do not alter the ereader screen unless inspection proves it uses the outdated cover artwork; its current interior/title treatment should remain intact.
5. Do not change the public website, therapy pages, blog, Part 2 newsletter package, campaign design files, deployment configuration, or existing unrelated user changes.
6. Do not commit, push, deploy, publish, schedule, or send the newsletter without explicit authorization.

## Approved Mockup Method

Use the approved hybrid deterministic composite.

For each affected cover plane:

1. Measure the exact visible cover corners from the source mockup.
2. Perspective-warp the complete approved ebook cover as one image into that plane.
3. Mask the replacement to the plane boundary so it cannot spill onto the spine, page block, background, or adjacent books.
4. Derive a restrained luminance/detail layer from the original mockup plane and blend it over the warped cover to retain environmental shading, glare, texture, and depth.
5. Feather only the cover boundary enough to match the source edge softness without blurring the cover typography.
6. Compare the composite against both the original mockup and the approved cover at high zoom.

No generative layer is allowed. The approved cover remains the sole source for all title, subtitle, endorsement, author, butterfly, origami, and publisher artwork appearing on replaced planes.

Do not crop or non-uniformly scale the approved cover to force it into a measured plane. Apply one perspective transform to the complete cover bounds. If the source plane’s apparent proportions conflict materially with the final cover, stop and report the discrepancy rather than stretching the artwork.

For horizontal top-cover planes, derive the four visible plane corners from the outer cover edges—not from the page block or spine. Preserve any source shadow cast across the plane after replacement. Do not extend the artwork beyond the physical fore-edge or hinge.

## Mockup Decisions

### Ereader And Physical Cover

- Replace the upright physical paperback cover only.
- Preserve the ereader and tablet displays, devices, stylus, shadows, and background.
- Export a corrected master, email variant, social variant, and comparison proof.

### Instagram Book Stack

- Replace the upright book's front cover.
- Replace the top book's visible top-cover plane.
- Preserve every spine, page block, stacked-book edge, shadow, and background.
- Export a corrected master, social variant, and comparison proof.

### LinkedIn Book Stack

- Replace the upright book's front cover.
- Replace the top book's visible top-cover plane.
- Preserve every spine, page block, stacked-book edge, shadow, and background.
- Use this corrected landscape composition as the newsletter hero.
- Export a corrected master, email hero, social variant, and comparison proof.

### Open Book

- No cover correction is required.
- Copy the original open-book source into `assets/source/` without transcoding and verify that copy against the source SHA-256 hash.
- Separately generate the optimized newsletter derivative in `assets/email/`; the derivative is not expected to be byte-identical.
- Use the optimized derivative for the newsletter interior image without changing composition.

## Asset Organization

```txt
newsletter/book-launch/assets/
  source/
    final-cover.png
    paperback-wrap-reference.pdf
    Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web).png
    Loren-Galese-Unfolding-Origami-OpenBook-Mockup-(linkedin).png
    Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta).png
    Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin).png
  corrected/
    Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web)-corrected.jpeg
    Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta)-corrected.jpeg
    Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin)-corrected.jpeg
  email/
    unfolding-origami-launch-hero-corrected.jpg
    unfolding-origami-ereader-and-cover-corrected.jpg
    unfolding-origami-interior-spread.jpg
  social/
    unfolding-origami-book-stack-instagram-corrected.jpg
    unfolding-origami-book-stack-linkedin-corrected.jpg
    unfolding-origami-ereader-and-cover-web-corrected.jpg
  decorative/
    pink-butterfly-small.png
    pink-butterfly-medium.png
    pink-butterfly-pair.png
```

Source files must remain unchanged. Corrected masters preserve each source mockup's pixel dimensions and aspect ratio. Email and social variants may be resized and JPEG-optimized without recropping important content.

## In-Scope Newsletter Files

Update only these campaign documents:

- `newsletter/book-launch/launch-newsletter-copy.md`
- `newsletter/book-launch/launch-newsletter.txt`
- `newsletter/book-launch/launch-newsletter-preview.html`
- `newsletter/book-launch/flodesk-build-guide.md`
- `newsletter/book-launch/link-map.md`
- `newsletter/book-launch/README.md`
- `newsletter/book-launch/previews/launch-newsletter-desktop.png`
- `newsletter/book-launch/previews/launch-newsletter-mobile.png`

Create the corrected and derivative assets defined in this design. Do not create parallel `v2`, `final-final`, or alternate campaign directories.

## Newsletter Structure

The HTML preview and Flodesk build guide use this exact visible order:

1. Author identifier.
2. Corrected LinkedIn book-stack hero.
3. Decorative butterfly.
4. Eyebrow: `UNFOLDING ORIGAMI: A MEMOIR`.
5. Heading: `The book is officially here.`
6. Supplied launch subheading.
7. Primary `Buy the Book on Amazon` button.
8. Secondary `Read an Excerpt` button.
9. Decorative butterfly.
10. Supplied shortened opening letter.
11. Decorative butterfly.
12. Open-book interior image.
13. `Inside Unfolding Origami` section with supplied copy.
14. Centered `Buy the Memoir Now` button.
15. Decorative butterfly.
16. Sarah Edmondson endorsement in its existing dark professional-endorsement panel.
17. Decorative butterfly.
18. Separate pale reader-review section with visible five stars and accessible `5 out of 5 stars` text.
19. Decorative butterfly.
20. `Choose Your Copy` section with equal desktop buttons and stacked mobile buttons.
21. Signed-copy deadline: `Signed-copy orders are available through July 20, 2026.`
22. Final support/review section.
23. Closing.
24. Decorative butterfly.
25. Author links and Flodesk native compliance footer instructions.

## Authoritative Links

- Amazon: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
- Excerpt: `https://wovenself.com/excerpt-unfolding-origami`
- Signed copy: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`
- Sarah Edmondson: `https://alittlebitculty.com/`

The excerpt destination is verified from the existing hidden-by-link page and campaign sources. This task links to it but does not change its indexing, navigation, or visibility model.

## Butterfly System

Reuse the existing transparent cover-derived butterfly PNGs. Create email-ready named derivatives without redrawing them.

- Desktop target: four to six restrained butterfly appearances. Begin with five and add a sixth only if the rendered composition still feels balanced.
- Mobile target: retain at least three; hide only placements that crowd the flow.
- Use normal email image rows or table cells, not absolute positioning, floats, CSS backgrounds, emoji, or animation.
- Every butterfly uses `alt=""`; presentation containers use `role="presentation"` where appropriate.
- No butterfly may overlap copy, buttons, quotes, or mockups.
- Butterfly rows must use minimal vertical padding. The decorative element should act as a transition accent, not create a full standalone section. Target approximately 8–16 pixels of combined padding around a small butterfly unless the surrounding section spacing already provides sufficient separation.

## Review Attribution

Use this attribution exactly:

```text
- Amazon Review
```

The review quotation must be copied from the user-supplied review text. Do not reconstruct it from the Amazon page, alter its wording for length, combine noncontiguous sentences, or add ellipses unless the approved newsletter copy explicitly includes them.

## HTML And Accessibility Design

- Keep the existing table-based, approximately 640-pixel email shell.
- Use inline critical styling, system fonts, responsive images, and no JavaScript, forms, Tailwind, web-font dependency, or external stylesheet.
- Keep body text at 16 pixels or larger.
- Keep the Amazon CTA visually primary and the excerpt/signed-copy CTAs secondary.
- Use full-width mobile buttons with at least 12 pixels between stacked actions.
- Keep the Sarah Edmondson endorsement and Amazon reader review in visibly separate treatments.
- Use the supplied meaningful-image alt text.
- Provide hidden assistive text for the five-star rating rather than relying on star characters alone.
- Require zero horizontal overflow, clipped text, broken images, or decorative-image announcements.

## Deadline Safety

The signed-copy CTA and July 20 deadline are valid only for a send occurring on or before July 20, 2026.

If implementation or sending occurs after July 20, 2026:

- do not publish or send the signed-copy CTA;
- do not silently extend the deadline;
- flag the campaign as requiring content review;
- preserve the Amazon purchase path as the default active option.

## QA And Acceptance

### Cover QA

- Confirm the centered subtitle on every replaced plane.
- Confirm title, endorsement, author credentials, butterflies, origami box, and publisher art are intact.
- Confirm typography remains sharp and perspectively correct.
- Confirm masks do not enter spines, page blocks, backgrounds, or adjacent books.
- Confirm scene brightness, highlights, shadows, texture, edge softness, resolution, and aspect ratio remain consistent.
- Generate old/corrected/reference proofs for LinkedIn, Instagram, and ereader mockups.

### Newsletter QA

- Confirm exact block order and supplied copy.
- Confirm no active `B0H27BM8K1`, old CTA labels, ambiguous signed-copy language, preorder language, or coming-soon language remains in `newsletter/book-launch/`.
- Confirm every Amazon CTA uses `B0H7YZ5N28`, the signed-copy CTA uses Stripe, the excerpt CTA uses the verified hidden page, and the endorsement attribution uses `alittlebitculty.com`.
- Confirm the supplied Amazon review excerpt and `- Amazon Review` attribution match exactly and contain no reviewer name or verified-purchase claim.
- Confirm every signed-copy deadline uses `July 20, 2026`.
- Confirm four to six butterfly appearances on desktop and at least three on mobile, with empty alt text and no overlaps.

### Rendering QA

- Render the HTML preview at desktop and mobile widths with Playwright.
- Capture new desktop and mobile previews.
- Check image load state, geometry, button alignment/stacking, minimum text sizing, accessible labels, and `scrollWidth === clientWidth`.
- Inspect the generated proof images and both newsletter previews visually.
- Run `git diff --check` and inspect the scoped diff.

## Handoff Boundary

The completed local package is a production guide and review artifact. Flodesk assembly, test-email delivery, scheduling, sending, publishing, deployment, committing, and pushing remain outside this task unless explicitly authorized.
