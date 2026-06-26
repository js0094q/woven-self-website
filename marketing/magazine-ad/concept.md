# Magazine Ad Concept — Unfolding Origami

## Objective

Revise the half-page magazine/book print ad so it feels more like a polished book advertisement than a web banner. The final ad should be suitable for a family/local magazine while still preserving the literary, trauma-informed tone of *Unfolding Origami: A Memoir*.

The ad should prioritize:

1. Immediate recognition of the book cover and title.
2. Warm local-author credibility.
3. Clear preorder action.
4. A restrained, editorial print layout.
5. Exact quote handling with no AI-invented wording.

## Format Assumption

Design for a horizontal half-page magazine ad unless the publication gives a different spec.

Use print-safe settings:

- 300 DPI export.
- CMYK-ready colors where possible.
- 0.125 inch bleed if the printer requests bleed.
- Keep all live text and QR code inside a safe margin.
- Export final PNG and PDF.
- Export a lightweight JPG preview.

## Revised Creative Direction

Use an editorial book-ad structure, not a crowded promotional flyer.

The ad should feel like:

- A local author announcement.
- A memoir preorder feature.
- A literary magazine placement.
- A family/local publication ad that is emotionally mature but not too heavy.

Avoid:

- Overloading the ad with too many quotes.
- Making the trauma language the first visual impression.
- Using generic pink accents unrelated to the cover.
- Creating fake review copy or altering quoted text.
- Making Loren look angry or severe.

## Recommended Layout

### Primary Layout: Editorial Split

Use a three-zone composition:

1. **Left zone — book cover**
   - Large book cover.
   - It should be the dominant sales object.
   - Add a soft drop shadow or slight paper lift effect.
   - Pull background/accent colors from the cover artwork.

2. **Center zone — title, author, preorder message**
   - Stack the title and author together:
     - `Unfolding Origami`
     - `A Memoir by Loren Galese, LPC, ACS`
   - Keep “A Memoir” directly tied to the title, not floating in a separate corner.
   - Use a compact local framing line:
     - `A local New Jersey author’s memoir of survival, self-trust, and healing.`

3. **Right zone — author portrait and CTA**
   - Include Loren’s photo as a small editorial portrait, not a full secondary hero.
   - Crop as contemplative, composed, and approachable.
   - Place near the CTA or endorsement area so the ad has a human anchor.
   - Do not style her as angry. Aim for “serious author portrait,” not “distressed memoir subject.”

## Quote Strategy

Use only one endorsement quote in the main layout unless the final half-page size still has clean breathing room.

### Required quote handling

- Use Sarah Edmondson’s quote exactly as approved on the website.
- Do not paraphrase Sarah’s quote.
- Do not use AI-generated additions.
- If the design includes the “wounds” line and a separate Sarah attribution, switch their placement so the Sarah quote is not visually competing with another large pull quote.

### Sarah Edmondson quote

“Some wounds don’t bleed—they fold you inward. Galese traces that quiet unraveling and the courageous work of unfolding back into yourself. This memoir is both a survival guide and a testament to transforming pain into something fiercely alive and meaningful.”

— Sarah Edmondson, Podcast Host & Author of *A Little Bit Culty*

### Placement recommendation

For a half-page ad, set the Sarah quote as a smaller editorial endorsement beneath the headline or beside the cover. Keep it readable but secondary to title + preorder CTA.

Do not let the quote dominate the ad.

## Copy Hierarchy

Use this hierarchy:

1. **Title:** `Unfolding Origami`
2. **Subtitle/byline:** `A Memoir by Loren Galese, LPC, ACS`
3. **Local reader line:** `A local New Jersey author’s memoir of survival, self-trust, and healing.`
4. **Endorsement:** Sarah Edmondson quote, exact wording only.
5. **Preorder CTA:** `Preorder your signed copy`
6. **Details:** `$24.99 • Signed paperback • Includes a surprise from the author`
7. **URL/QR:** `wovenself.com/author`

## CTA / QR Code

The QR code should point to:

`https://wovenself.com/author`

Use the visible URL:

`wovenself.com/author`

CTA language:

`Preorder your signed copy`

Supporting line:

`Signed paperback preorders include a surprise from Loren.`

Do not use `wovenself.com/unfolding`.

## Color Direction

The ad should incorporate the book cover palette more directly.

Use:

- Deep teal/sage from the site and cover family.
- Warm cream/off-white background.
- Muted navy/ink text if present in the cover.
- Pink accents pulled from the butterfly artwork, not generic bright pink.

Replace any existing unrelated pink accents with butterfly-derived pink. Specifically update “A Memoir” and small dividers/accent rules to use the butterfly pink.

Keep contrast print-safe. Avoid pale pink for small text.

## Typography Direction

Use a literary serif for title and endorsement. Use a clean sans-serif for details and CTA.

Recommended hierarchy:

- Title: large serif, highest contrast.
- “A Memoir by Loren Galese, LPC, ACS”: smaller serif or small caps sans.
- Quote: italic serif, controlled width.
- CTA/details: sans-serif, direct and legible.

Do not use too many font weights.

## Local Magazine Adjustment

Because this is for a family/local magazine, soften the positioning:

Better:

`A local New Jersey author’s memoir of survival, self-trust, and healing.`

Use carefully, only if space allows:

`A story of coercive control, recovery, and coming back to yourself.`

Avoid making “sexual assault,” “cult-like,” or institutional failure the top-level ad hook in this placement. Those can remain on the website, but the ad should invite a broader local readership first.

## Visual Notes for Codex

Implement the ad as an editable source file, not only a flat raster.

Recommended repo structure:

```txt
marketing/magazine-ad/
  README.md
  concept.md
  half-page-ad.html
  half-page-ad.css
  export-visuals.mjs
  exports/
    unfolding-origami-half-page-ad.pdf
    unfolding-origami-half-page-ad.png
    unfolding-origami-half-page-ad-preview.jpg
```

If files already exist locally from a prior branch, update them rather than duplicating.

## Acceptance Criteria

- The ad is horizontal half-page format.
- The book cover is the primary visual object.
- Loren’s portrait is included as an editorial author element.
- The title/byline reads: `Unfolding Origami: A Memoir by Loren Galese, LPC, ACS` or a stacked equivalent.
- Sarah Edmondson’s quote is exact and unaltered.
- The CTA points to `https://wovenself.com/author`.
- The visible URL is `wovenself.com/author`.
- The design uses butterfly-derived pink accents instead of unrelated pink.
- The layout has enough whitespace for a half-page print ad.
- PNG, PDF, and JPG preview exports are regenerated.
- README instructions document how to export the ad.

## Final Design Summary

Create a polished, restrained half-page magazine ad that reads as a local literary preorder announcement. Make the book cover dominant, bring in Loren’s portrait as a serious but approachable author presence, tie the title and “A Memoir by Loren Galese, LPC, ACS” together, use the Sarah Edmondson quote exactly, and shift the color system toward the actual cover palette—especially the butterfly pink accents.