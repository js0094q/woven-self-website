# Unfolding Origami Campaign And Website Design

Date: 2026-06-16

## Status

Approved design for implementation planning.

## Context

The Woven Self website is a static HTML/CSS/Tailwind-CDN site deployed through Vercel. The current live-facing author and preorder pages use `Unfolding Origami: A Memoir` as the book title. The attached campaign brief and existing untracked marketing assets used mixed `Folding Origami` and `Unfolding Origami` language.

`Unfolding Origami: A Memoir` is the correct public title and must be used for live website copy, campaign templates, SEO metadata, social captions, and print assets.

The requested work is an integrated campaign and website update. It should not redesign the full website.

## Goals

1. Create a coherent campaign system for Loren Galese's preorder and launch campaign.
2. Update the live author page messaging to Loren's latest positioning.
3. Normalize campaign copy around the correct title, preorder CTA, Stripe link, and reader-facing language.
4. Preserve the existing website architecture, preorder flow, therapy booking flow, and security posture.
5. Keep the visual language literary, restrained, warm, trauma-informed, and consistent with The Woven Self identity.

## Non-Goals

1. Do not redesign the whole website.
2. Do not change the Stripe Payment Link.
3. Do not add checkout handling, payment collection, lead capture, or therapy intake to the website.
4. Do not change Vercel security headers or rewrites unless a specific implementation need is discovered.
5. Do not publish, deploy, push, or modify production infrastructure as part of this design.
6. Do not commit unrelated untracked campaign folders unless they are intentionally included in the implementation plan.

## Approved Approach

Use the integrated website plus asset system approach.

The campaign will be a lightweight static-site extension:

- `author.html` receives public-facing copy and SEO/social metadata updates.
- `styles-campaign.css` provides reusable campaign tokens and motifs without replacing `styles.css`.
- `design/unfolding-origami-campaign/` becomes the durable campaign design-system and template folder.
- `marketing/book-launch/` copy is normalized around the approved message architecture.
- Existing site navigation, Stripe preorder details, security headers, therapy booking links, and static-site deployment model stay intact.

## Approved Visual Direction

Use the Quiet Paper System.

The system should feel minimal, literary, emotional but restrained, trauma-informed, warm, authorial, clean, elegant, and quietly powerful.

Use these visual motifs:

- paper texture;
- soft crease lines;
- folded-corner details;
- soft paper cards;
- restrained origami line art;
- generous whitespace;
- warm cream and white surfaces;
- sage and ink typography;
- clay accents.

Avoid:

- red and black danger palettes;
- sensational trauma-marketing visuals;
- stock therapy cliches;
- overcrowded layouts;
- heavy effects;
- excessive gradients;
- rage-bait visual language;
- too many fonts.

## Campaign Palette

Use a restrained palette aligned with the existing Woven Self colors:

```css
:root {
  --campaign-cream: #FBF7F0;
  --campaign-warm-white: #FFFDF9;
  --campaign-sage: #4A5C5A;
  --campaign-muted-sage: #7D8C88;
  --campaign-clay: #B98F76;
  --campaign-soft-clay: #E6D1C3;
  --campaign-ink: #2F3A38;
  --campaign-mist: #EDE8E1;
  --campaign-border: #D8CEC2;
}
```

Use the existing site typography direction:

- Playfair Display for headings, pull quotes, and book-title emphasis.
- Inter for body copy, labels, metadata, and CTAs.

## Message Architecture

Use this primary campaign positioning:

> A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.

The message system has four lanes:

1. Therapist-after-trauma credibility: Loren writes with clinical experience and personal lived experience.
2. Quiet survivor recognition: the campaign speaks to readers who survived quietly, questioned themselves deeply, and are learning to trust themselves again.
3. Folding and unfolding metaphor: the copy uses folding, unfolding, re-defining shape, crease, return, and self-trust as recurring language.
4. Direct preorder conversion: preorder language remains clear, current, and action-oriented.

Controlled callout language may be used in social copy, but should stay specific and grounded. Avoid exploitative or sensational claims.

## Required Public Details

Preserve these public campaign details:

- Book: `Unfolding Origami: A Memoir`
- Author: Loren Galese
- Price: `$24.99`
- Release date: `July 20`
- Preorder incentive: signed copy plus a surprise from Loren
- Primary CTA: `Preorder Now`
- Primary campaign URL: `https://wovenself.com/author`
- Stripe Payment Link: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`

All external Stripe links should use:

```html
target="_blank" rel="noopener noreferrer"
```

## Website Design

Update `author.html` without changing the overall layout structure.

Recommended live-page updates:

- Keep the hero focused on `Unfolding Origami: A Memoir`.
- Replace weaker general memoir copy with the therapist-after-trauma positioning.
- Add a secondary line about folding back to yourself and trusting your own shape again.
- Add reader-community copy near the preorder CTA or book description.
- Keep preorder details visible and unchanged.
- Keep CTA text as `Preorder Now`.
- Keep the CTA linked to the Stripe Payment Link.
- Update metadata descriptions to reflect trauma, coercive control, survival, re-defining shape, and folding back to yourself.

The author page should not become a separate landing-page redesign. It should remain part of the existing Woven Self site.

## Campaign Asset System

Create a reusable campaign folder:

```txt
design/unfolding-origami-campaign/
  README.md
  campaign-design-system.md
  campaign-copy.md
  social-template-specs.md
  website-component-specs.md
  print-template-specs.md
  export-checklist.md
  svg/
    origami-crane-line.svg
    fold-lines.svg
    paper-corner.svg
  templates/
    instagram-post-preorder.html
    instagram-post-quote.html
    instagram-post-community.html
    instagram-story-preorder.html
    instagram-story-quote.html
    sell-sheet.html
    table-tent.html
```

If `design/` or related campaign folders are untracked at implementation time, inspect them before editing and commit only intentionally changed campaign files.

## Template Requirements

HTML templates should be browser-renderable and exportable as screenshots or print/PDF.

Use fixed canvas sizes:

- Instagram feed post: `1080 x 1080`
- Instagram story: `1080 x 1920`
- Sell sheet: print-friendly page layout
- Table tent: print-friendly table-tent layout

Template rules:

- Use one clear message per graphic.
- Include book title and author name.
- Use subtle fold-line or paper-crease backgrounds.
- Keep margins generous.
- Use `wovenself.com/author` as the visible URL where appropriate.
- Do not cram all preorder details into quote cards.
- Do not use unsupported awards, credentials, or claims.

## Marketing Copy Updates

Normalize `marketing/book-launch/` around `Unfolding Origami`.

Copy should include:

- "folding back to yourself";
- "re-defining your shape";
- "trauma therapist's memoir";
- reader-community language for people who survived quietly;
- clear preorder language;
- signed copy plus surprise from Loren;
- `https://wovenself.com/author` for campaign traffic.

Replace stale `Folding Origami` references unless a file is intentionally documenting prior naming.

## Data Flow And Safety

The campaign remains static.

Data flow:

```txt
Social / Email / Print / Outreach
  -> https://wovenself.com/author
  -> Preorder Now
  -> Stripe Checkout
  -> preorder thank-you flow
```

Safety rules:

- Do not collect payment data on the website.
- Do not collect therapy-related, clinical, or protected health information through preorder flows.
- Keep therapy scheduling through Headway and preorder payment through Stripe.
- Keep error handling explicit and sanitized where existing JavaScript is touched.
- Keep security headers and CSP behavior intact unless replacing them with equivalent or stronger behavior.

## Validation Plan

Use the smallest relevant validation for the static site and campaign templates:

1. Search for stale live-facing copy:

```bash
rg -n "Folding Origami|Join the Launch List|launch list|coming soon|memoir is currently in development|more updates to come" \
  --glob '!/.git/**' \
  --glob '!node_modules/**'
```

2. Confirm live-facing files use `Unfolding Origami`.
3. Confirm `author.html` includes:
   - `Preorder Now`;
   - the Stripe Payment Link;
   - therapist-after-trauma positioning;
   - folding back to yourself language;
   - re-defining your shape language;
   - reader-community language.
4. Run a local static server:

```bash
python3 -m http.server 8080
```

5. Inspect:

```txt
http://localhost:8080/author.html
```

6. Inspect representative campaign templates in a browser for layout, readable text, correct title, and export dimensions.

## Implementation Boundaries

Implementation should proceed in narrow commits or patches:

1. Website copy and metadata updates.
2. Campaign CSS and motifs.
3. Campaign docs and template specs.
4. Marketing copy normalization.
5. Browser validation and grep checks.

Do not deploy, push, or publish unless explicitly requested after implementation.

