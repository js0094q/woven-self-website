# Unfolding Origami Launch Newsletter

This directory is the local production and review package for the launch newsletter for *Unfolding Origami: A Memoir* by Loren Galese, LPC, ACS. The canonical content sources are `launch-newsletter-copy.md` and `launch-newsletter.txt`. The HTML preview is the current source-level review render. The authoritative manual Flodesk assembly instructions live in `flodesk-upload-package/` and begin with `00-START-HERE.md`.

## Authoritative cover provenance

The sole replacement artwork is the PDF-derived front cover. The earlier repository raster is comparison-only and was not used as replacement artwork.

| Role | Path | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| Authoritative PDF source | `exports/kdp-ebook-cover-1600x2560-fixed.pdf` | PDF page rasterized at 1600 × 2560 | `f3a271ecb5744e938b5cec10da463f36fb8204ad6f861a809aab8ad3d48d920f` |
| Byte-identical package PDF | `assets/source/final-cover-authoritative.pdf` | PDF page rasterized at 1600 × 2560 | `f3a271ecb5744e938b5cec10da463f36fb8204ad6f861a809aab8ad3d48d920f` |
| Authoritative PDF-derived raster | `assets/source/final-cover-authoritative-pdf.png` | 1600 × 2560 RGB PNG | `9782e48049538b72eafb98dc1090f2237ae68743ca044e84130120f0b59f0e8e` |
| Comparison-only prior raster | `assets/source/final-cover.png` | 1600 × 2560 RGBA PNG | `b14bbe7ffde2be8e8a11a7ae82b44eecc5b32f7f495b98fef93cb4542317d996` |
| Paperback wrap reference only | `assets/source/paperback-wrap-reference.pdf` | PDF | `116d0b605051b5c90d15a030fbc894ee6613bcf6a886bdf942d336277f03216a` |

The authoritative raster preserves the complete approved cover as one unit: centered `A Memoir`, title, endorsement, butterfly arrangement, origami box, author line, and publisher mark.

## Source mockup inventory

The source copies below remain unchanged. The three lowercase aliases are byte-identical retained package inputs from the earlier newsletter package.

| Source file | Dimensions | SHA-256 | Use |
| --- | --- | --- | --- |
| `assets/source/Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web).png` | 7500 × 4219 RGB PNG | `a93d8e6e38067daae1d8c002d30aa09b95b291f8af5919a2c0e8f5fee4b7e727` | Ereader scene; physical paperback front corrected |
| `assets/source/Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta).png` | 3010 × 3762 RGBA PNG | `362d3fd1a0396db88f4ae85638417267d7a4cbb3c5251ebc9dbd562424f008cf` | Instagram upright and top covers corrected |
| `assets/source/Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin).png` | 3500 × 1968 RGB PNG | `cd4659d8cfec35b6c1ae246edeb6071257e0e57400271639d68c973fcf7d67f2` | LinkedIn upright and top covers corrected; newsletter hero source |
| `assets/source/Loren-Galese-Unfolding-Origami-OpenBook-Mockup-(linkedin).png` | 4000 × 2250 RGB PNG | `01d25af1e8adb10343bf228c1917abe5d9967e17de8c8f662a69ebf4d119ccea` | Unchanged open-book source |
| `assets/source/unfolding-origami-book-stack-instagram.png` | 3010 × 3762 RGBA PNG | `362d3fd1a0396db88f4ae85638417267d7a4cbb3c5251ebc9dbd562424f008cf` | Retained byte-identical source alias |
| `assets/source/unfolding-origami-book-stack-linkedin.png` | 3500 × 1968 RGB PNG | `cd4659d8cfec35b6c1ae246edeb6071257e0e57400271639d68c973fcf7d67f2` | Retained byte-identical source alias |
| `assets/source/unfolding-origami-open-book-linkedin.png` | 4000 × 2250 RGB PNG | `01d25af1e8adb10343bf228c1917abe5d9967e17de8c8f662a69ebf4d119ccea` | Retained byte-identical source alias |

## Accepted quadrilaterals and polygons

Quadrilaterals define the perspective transform. The accepted multi-point polygons clip the two bowed horizontal top-cover boundaries.

### Ereader physical paperback upright front

Quadrilateral:

```text
((4580, 1018), (6172, 1018), (6172, 3468), (4580, 3468))
```

### Instagram upright front

Quadrilateral:

```text
((317, 1088), (1157, 1088), (1157, 2709), (317, 2736))
```

### Instagram top cover

Quadrilateral:

```text
((1215, 2140), (1949, 2064), (2828, 2220), (2024, 2317))
```

Accepted polygon:

```text
((1215, 2140), (1288, 2132), (1361, 2126), (1434, 2121),
 (1507, 2116), (1580, 2111), (1653, 2106), (1726, 2101),
 (1799, 2092), (1872, 2080), (1949, 2064), (2036, 2079),
 (2123, 2094), (2210, 2109), (2297, 2125), (2384, 2140),
 (2471, 2155), (2558, 2171), (2645, 2186), (2732, 2201),
 (2828, 2220), (2024, 2317))
```

### LinkedIn upright front

Quadrilateral:

```text
((508, 133), (1402, 133), (1406, 1750), (473, 1792))
```

### LinkedIn top cover

Quadrilateral:

```text
((1465, 1187), (2213, 1112), (3078, 1267), (2269, 1364))
```

Accepted polygon:

```text
((1465, 1187), (1539, 1178), (1613, 1172), (1687, 1167),
 (1761, 1162), (1835, 1158), (1909, 1152), (1983, 1147),
 (2057, 1137), (2131, 1124), (2213, 1112), (2299, 1129),
 (2385, 1144), (2471, 1159), (2557, 1174), (2643, 1189),
 (2729, 1205), (2815, 1219), (2901, 1235), (2987, 1250),
 (3078, 1267), (2269, 1364))
```

## Composite method

Each affected plane receives one perspective warp of the complete authoritative raster. Horizontal top covers are clipped with the accepted polygon; upright covers use their accepted cover boundary. The deterministic composite preserves only low-frequency environmental illumination, shadow, glare, tonal falloff, and edge softness from the scene. It does not transfer old typography or other high-frequency cover detail. Minimal feathering is applied after clipping. Spines, page blocks, hinges, fore-edges, devices, backgrounds, adjacent books, and scene geometry remain outside the replacement masks.

Lossless corrected PNGs are written first. Corrected JPEG masters and later email/social derivatives are exported from those PNGs, preventing cumulative JPEG degradation.

## Correction inventory

| Output | Dimensions | SHA-256 | Corrected planes |
| --- | --- | --- | --- |
| `assets/corrected-working/ereader-corrected.png` | 7500 × 4219 RGB PNG | `e10af4e3f42cb6746353817fcef77d27cb7c4502e5f59926900e39cf09d16c30` | Physical paperback upright front |
| `assets/corrected-working/instagram-stack-corrected.png` | 3010 × 3762 RGB PNG | `8d50c8c401a335fe5bb3613c5d1bf5556f25f0e428fe8f0e3121943dd26c3d58` | Upright front and bowed top cover |
| `assets/corrected-working/linkedin-stack-corrected.png` | 3500 × 1968 RGB PNG | `dc0a7b8a320866dea430ab49a1ed0b493cdd37d4ceada407ee74fd3eefad78b4` | Upright front and bowed top cover |
| `assets/corrected/Loren-Galese-Unfolding-Origami-ereader-and-cover-Mockup-(web)-corrected.jpeg` | 7500 × 4219 RGB JPEG | `05f0d16c3a0ca10d374054cd386d68e9cbed1bb8c78a5612e00cc1dbc797d376` | Corrected ereader-scene master |
| `assets/corrected/Loren-Galese-Unfolding-Origami-BookStack-Mockup-(insta)-corrected.jpeg` | 3010 × 3762 RGB JPEG | `d9684d93750822da0d411468c4dccc34f0091bcdea06b38a5c749a9b62bab55a` | Corrected Instagram master |
| `assets/corrected/Loren-Galese-Unfolding-Origami-BookStack-Mockup--(linkedin)-corrected.jpeg` | 3500 × 1968 RGB JPEG | `aa828f243dfdb3893a53c888b4d0c1bd23d90cfa7ab8c9c23ed0aec14e56a84a` | Corrected LinkedIn master |

Comparison proofs are `previews/mockup-correction-proof-ereader.png`, `previews/mockup-correction-proof-instagram.png`, and `previews/mockup-correction-proof-linkedin.png`. Each proof uses the order `old mockup | corrected mockup | authoritative final cover reference`.

## Derivative inventory

| Output | Dimensions | SHA-256 | Source |
| --- | --- | --- | --- |
| `assets/email/unfolding-origami-launch-hero-corrected.jpg` | 1280 × 720 RGB JPEG | `4b92751be3f3a12e77c7352f6c6ec29083d5f935971179153fa8c3317c8807ed` | Corrected LinkedIn lossless PNG |
| `assets/email/unfolding-origami-ereader-and-cover-corrected.jpg` | 1280 × 720 RGB JPEG | `1fd1b0f271352aa8d179afaf5a0edc65161851b7670a9a0445fdfc72e266a088` | Corrected ereader lossless PNG |
| `assets/email/unfolding-origami-interior-spread.jpg` | 1280 × 720 RGB JPEG | `0552a74e167e0f7cd9261771e5c4344e2fc0016f6c527f1e1b6c6f8393ff635d` | Unchanged open-book source |
| `assets/social/unfolding-origami-book-stack-instagram-corrected.jpg` | 1024 × 1280 RGB JPEG | `e6f98249b4023a154666361919f5b063b01f7cf4b12b4644cf9716fb169ce3d6` | Corrected Instagram lossless PNG |
| `assets/social/unfolding-origami-book-stack-linkedin-corrected.jpg` | 1280 × 720 RGB JPEG | `4b92751be3f3a12e77c7352f6c6ec29083d5f935971179153fa8c3317c8807ed` | Corrected LinkedIn lossless PNG |
| `assets/social/unfolding-origami-ereader-and-cover-web-corrected.jpg` | 1280 × 720 RGB JPEG | `1fd1b0f271352aa8d179afaf5a0edc65161851b7670a9a0445fdfc72e266a088` | Corrected ereader lossless PNG |
| `assets/decorative/pink-butterfly-small.png` | 32 × 23 RGBA PNG | `dbd6921abdc7f89e4ccf0fcfa4f2c65701a3631febcac039a1ee7646c1c1ebcc` | Cover-derived butterfly 3 |
| `assets/decorative/pink-butterfly-medium.png` | 48 × 41 RGBA PNG | `03e0f6c001f82ec2cda70d73a085dfc2e0baf3e54859c9ef50e4105e3981d470` | Cover-derived butterfly 2 |
| `assets/decorative/pink-butterfly-pair.png` | 64 × 24 RGBA PNG | `c1b5ca6ce5109344dba5783b2685e84e8b617d8857385002240adac511e00860` | Cover-derived butterflies 1 and 3 |

The selected email hero is `assets/email/unfolding-origami-launch-hero-corrected.jpg`.

## Butterfly provenance and placement

| Cover-derived source | Dimensions | SHA-256 | Derivative use |
| --- | --- | --- | --- |
| `images/unfolding-origami-butterfly-1.png` | 204 × 163 RGBA PNG | `3396c1e9eea663bf4227840668e7cd4196bef28808182a58c3bb61c635721942` | Pair |
| `images/unfolding-origami-butterfly-2.png` | 195 × 168 RGBA PNG | `647d27f7b966397b2476d17dd4fd139200446540c5478d19e6f03362124a7604` | Medium |
| `images/unfolding-origami-butterfly-3.png` | 152 × 109 RGBA PNG | `13697c2304d17c606550ed28d57c1dfc1549ac197a5a5a48ce4b09cbd3c08fdd` | Small and pair |

Begin the rendered email with five restrained decorative placements: between hero and eyebrow, between hero CTAs and letter, between letter and interior, between interior CTA and Sarah endorsement, and between reader review and `Choose Your Copy`. Use normal image rows, empty alt text, presentation-only containers, and 4–8 pixels above and below. Do not use decorative markers in the plain-text fallback. Desktop target is 4–6 appearances; mobile must retain at least 3. No decorative image may overlap copy, buttons, quotations, hero, or interior imagery.

## Open-book preservation

The open-book mockup has no cover plane. `assets/source/Loren-Galese-Unfolding-Origami-OpenBook-Mockup-(linkedin).png` remains byte-identical to its supplied source at SHA-256 `01d25af1e8adb10343bf228c1917abe5d9967e17de8c8f662a69ebf4d119ccea`. Only the optimized email derivative `assets/email/unfolding-origami-interior-spread.jpg` was created; composition was not altered.

## Production links

- Amazon: https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28
- Excerpt: https://wovenself.com/excerpt-unfolding-origami.html
- Signed copy: https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00
- Sarah Edmondson attribution: https://alittlebitculty.com/
- Author Instagram: https://www.instagram.com/lorengaleseauthor/
- Book page: https://wovenself.com/author.html
- Quiet Alchemy with Loren: https://substack.com/@quietalchemywloren
- The Woven Self: https://wovenself.com/

No fresh remote HTTP checks were performed for the Task 4 copy update. `link-map.md` records the current contract source for each production destination. No Amazon Associates parameters or placeholder URLs are permitted.

## Reader-review source

Use the supplied excerpt exactly and keep it separate from Sarah Edmondson's professional endorsement:

> “What stood out most to me was how the book captures the subtle ways manipulation and trauma can reshape a person’s identity. Rather than focusing only on what happened, it explores what it takes to rebuild trust in yourself afterward.”

- Amazon Review

Do not add a reviewer name, a purchase-verification claim, or retailer-origin or retailer-endorsement wording.

## Signed-copy deadline safety

Order the memoir through Amazon, or reserve a signed paperback directly from Loren through July 20, 2026.

Signed-copy orders are available through July 20, 2026.

The signed-copy CTA is valid only for a campaign sent on or before July 20, 2026. If validation runs after that date while `Order Your Signed Copy` and the Stripe destination remain active, it must fail with `DEADLINE_REVIEW_REQUIRED`. Do not silently remove or extend the deadline. Amazon remains the default purchase path.

## Final visible build order

1. Author identifier: `LOREN GALESE, LPC, ACS · AUTHOR`.
2. Corrected LinkedIn book-stack hero.
3. Decorative butterfly.
4. Eyebrow: `UNFOLDING ORIGAMI: A MEMOIR`.
5. Heading: `The book is officially here.`
6. Launch subheading.
7. Primary `Buy the Book on Amazon` button.
8. Secondary `Read an Excerpt` button.
9. Decorative butterfly.
10. Approved shortened opening letter.
11. Decorative butterfly.
12. Open-book interior image.
13. `Inside Unfolding Origami` section.
14. Centered `Buy the Memoir Now` button.
15. Decorative butterfly.
16. Sarah Edmondson endorsement.
17. Separate reader-review section.
18. Decorative butterfly.
19. `Choose Your Copy` section.
20. Signed-copy deadline.
21. Final support/review section.
22. Closing.
23. Author links.
24. Native Flodesk compliance footer instructions.

## Mobile behavior

- Images scale proportionally to full available width without cropping or horizontal overflow.
- Hero Amazon and excerpt CTAs stack vertically at full width with at least 12 pixels between them.
- In `Choose Your Copy`, Amazon remains first; Amazon and signed-copy buttons stack vertically at full width with at least 12 pixels spacing.
- Body text remains at least 16 pixels.
- At least three decorative butterflies remain visible without overlap or crowding.
- Desktop purchase buttons are equal width, height, and padding; mobile buttons are full-width and stacked.

## Current QA status

- Asset pipeline: 31 tests passed at the Task 3 checkpoint; corrected masters and derivative inventories passed source-resolution visual QA.
- Composite proofs: five affected planes passed the prior internal 100% and 200% review; comparison proofs exist for all three corrected scenes.
- Task 4 canonical Markdown, plain text, link map, and README are validated with `python3 newsletter/book-launch/scripts/validate_launch_newsletter.py --task4-only`.
- README active-versus-legacy context is validated with `python3 newsletter/book-launch/scripts/validate_launch_newsletter.py --check-readme-context`.
- The Task 5 HTML preview and numbered Flodesk upload package are current with the post-launch Amazon Bestseller copy.
- The full active-package validator passes on July 11, 2026; after July 20, 2026 it must return `DEADLINE_REVIEW_REQUIRED` while the signed-copy CTA remains active.
- Desktop/mobile newsletter proof images were regenerated on July 11, 2026 at 20:08 EDT. Both render audits passed with zero broken images, horizontal overflow, or clipping; 16-pixel minimum body text; unchanged 54-pixel purchase-button heights; and valid approved Amazon, Stripe, excerpt, and Sarah Edmondson destinations.
- No fresh remote destination checks, inbox tests, Flodesk tests, or live campaign checks were performed for this source update.

## Send boundary

Desktop and mobile Flodesk test sends are required before any send. The final HTML and numbered Flodesk package must match the canonical sources and approved reference previews, every link must be opened from an actual test email, and Flodesk's native unsubscribe link and physical mailing address must be confirmed. This local package is not a sent or published campaign.

No Flodesk campaign was assembled or sent.

No commit, push, deployment, publication, Flodesk assembly, scheduling, or sending occurred.
