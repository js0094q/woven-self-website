# Unfolding Origami Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Unfolding Origami campaign system, author page messaging, reusable campaign assets, and marketing copy normalization.

**Architecture:** Keep the site as a static HTML/CSS/Tailwind-CDN project. Add a scoped campaign stylesheet and a durable `design/unfolding-origami-campaign/` asset system while preserving `styles.css`, the existing page layout, Stripe checkout flow, Headway therapy flow, Vercel security headers, and static deployment model.

**Tech Stack:** Static HTML, CSS, Tailwind CDN classes, Markdown campaign docs, SVG motifs, browser-renderable HTML templates, Python static file server for validation.

---

## File Structure

Create or modify these files:

- Modify: `author.html`
  - Update title, meta description, Open Graph/Twitter descriptions, schema descriptions, hero deck, launch/preorder section copy, and memoir copy.
  - Preserve existing header, navigation, mobile nav script, Stripe Payment Link, Headway links, images, section order, and layout classes.
- Create: `styles-campaign.css`
  - Add scoped campaign variables, paper backgrounds, paper cards, labels, title/body/quote helpers, CTA button, folded-corner motif, divider, and badge styles.
- Create: `design/unfolding-origami-campaign/README.md`
- Create: `design/unfolding-origami-campaign/campaign-design-system.md`
- Create: `design/unfolding-origami-campaign/campaign-copy.md`
- Create: `design/unfolding-origami-campaign/social-template-specs.md`
- Create: `design/unfolding-origami-campaign/website-component-specs.md`
- Create: `design/unfolding-origami-campaign/print-template-specs.md`
- Create: `design/unfolding-origami-campaign/export-checklist.md`
- Create: `design/unfolding-origami-campaign/svg/origami-crane-line.svg`
- Create: `design/unfolding-origami-campaign/svg/fold-lines.svg`
- Create: `design/unfolding-origami-campaign/svg/paper-corner.svg`
- Create: `design/unfolding-origami-campaign/templates/instagram-post-preorder.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-post-quote.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-post-community.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-story-preorder.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-story-quote.html`
- Create: `design/unfolding-origami-campaign/templates/sell-sheet.html`
- Create: `design/unfolding-origami-campaign/templates/table-tent.html`
- Modify: `marketing/book-launch/README.md`
- Modify: `marketing/book-launch/launch-copy.md`
- Modify: `marketing/book-launch/social-captions.md`
- Modify: `marketing/book-launch/talking-points.md`
- Modify: `marketing/book-launch/email-campaign.md`
- Modify: `marketing/book-launch/metadata.md`
- Modify: `marketing/book-launch/press-kit.md`
- Modify: `marketing/book-launch/outreach-templates.md`
- Modify: `marketing/book-launch/faq.md`
- Modify: `marketing/book-launch/graphics-copy/instagram-posts.md`
- Modify: `marketing/book-launch/graphics-copy/instagram-stories.md`
- Modify: `marketing/book-launch/graphics-copy/quote-graphics.md`
- Modify: `marketing/book-launch/graphics-copy/sell-sheet-copy.md`
- Modify: `marketing/book-launch/graphics-copy/table-tent-copy.md`

Do not modify:

- `vercel.json`
- `preorder.html`
- `preorder-thank-you.html`
- Headway links
- Stripe Payment Link value
- existing `design/unfolding-origami-launch-card/` unless a validation search proves it is in the active campaign surface and the change is intentional
- `.superpowers/` generated brainstorming files
- unrelated `README.md` changes already present in the working tree

---

### Task 1: Update Author Page Messaging And Metadata

**Files:**
- Modify: `author.html`

- [ ] **Step 1: Inspect the current author page sections**

Run:

```bash
sed -n '1,280p' author.html
sed -n '281,560p' author.html
```

Expected: current metadata, hero, preorder section, memoir section, speaking section, and footer are visible.

- [ ] **Step 2: Update metadata in `author.html`**

Replace the current title and descriptions with:

```html
  <title>Unfolding Origami: A Memoir | Loren Galese | The Woven Self</title>
  <meta name="description" content="Preorder Unfolding Origami: A Memoir by Loren Galese, a trauma therapist's personal story of trauma, coercive control, survival, re-defining your shape, and folding back to yourself." />
```

Replace Open Graph and Twitter descriptions with:

```html
  <meta property="og:title" content="Unfolding Origami: A Memoir | Loren Galese" />
  <meta property="og:description" content="A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself." />
  <meta name="twitter:title" content="Unfolding Origami: A Memoir | Loren Galese" />
  <meta name="twitter:description" content="A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself." />
```

Update schema descriptions and names to:

```json
"description": "A trauma therapist's memoir about surviving trauma, coercive control, re-defining your shape, and folding back to yourself."
```

Use this page schema name:

```json
"name": "Unfolding Origami: A Memoir | Loren Galese | The Woven Self"
```

- [ ] **Step 3: Update the hero copy**

Keep the existing `author-hero` layout. Replace the current release line and hero deck with:

```html
          <p class="release-line">Release date: July 20</p>
          <p class="hero-deck">
            A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.
          </p>
```

Keep this existing CTA unchanged:

```html
            <a
              href="https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >Preorder Now</a>
```

- [ ] **Step 4: Update the launch/preorder section copy**

Keep the existing `section id="launch-list"` and `launch-grid` structure. Replace the left-column paragraph with:

```html
          <p>
            <em>Unfolding Origami: A Memoir</em> is Loren Galese's personal story of surviving trauma,
            naming coercive control, and re-defining her shape after being folded inward by pain.
          </p>
          <p>
            After trauma, healing is not always becoming someone new. Sometimes it is folding back to yourself
            and learning to trust your own shape again.
          </p>
          <p>
            For readers who have survived quietly, questioned themselves deeply, or are learning to trust their own instincts again,
            this memoir offers a personal story of trauma, survival, and return.
          </p>
```

Keep the card details, `$24.99`, `July 20`, `Signed copy plus a surprise from Loren`, and the Stripe CTA.

- [ ] **Step 5: Update the memoir section copy**

Replace the current memoir section paragraphs with:

```html
          <p class="lead">
            <em>Unfolding Origami</em> is a trauma therapist's memoir about surviving trauma,
            naming coercive control, and learning to trust your own shape again.
          </p>
          <p>
            The story traces how confusion, manipulation, and reality reversal can separate someone from
            their intuition, their voice, and their sense of safety.
          </p>
          <p>
            It is also a memoir of return: surviving quietly, re-defining your shape,
            and moving through the long, nonlinear work of folding back to yourself.
          </p>
          <aside class="pull-quote">
            Healing is not becoming untouched. Sometimes it is folding back to yourself and learning how to hold the crease.
          </aside>
```

- [ ] **Step 6: Validate author page source requirements**

Run:

```bash
rg -n "trauma therapist|surviving trauma|re-defining your shape|folding back to yourself|survived quietly|Preorder Now|\\$24\\.99|July 20|signed copy plus a surprise from Loren|https://buy\\.stripe\\.com/dRm28r0bp9Mc8ocdD53cc00" author.html
```

Expected: every required phrase appears in `author.html`.

- [ ] **Step 7: Commit author page changes**

Run:

```bash
git diff -- author.html
git add author.html
git commit -m "Update Unfolding Origami preorder messaging"
```

Expected: commit includes only `author.html`.

---

### Task 2: Add Campaign CSS And SVG Motifs

**Files:**
- Create: `styles-campaign.css`
- Create: `design/unfolding-origami-campaign/svg/origami-crane-line.svg`
- Create: `design/unfolding-origami-campaign/svg/fold-lines.svg`
- Create: `design/unfolding-origami-campaign/svg/paper-corner.svg`

- [ ] **Step 1: Create the campaign stylesheet**

Create `styles-campaign.css` with this exact content:

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

.campaign-section {
  background:
    linear-gradient(135deg, rgba(74, 92, 90, 0.045) 0 1px, transparent 1px 100%),
    linear-gradient(45deg, rgba(185, 143, 118, 0.04) 0 1px, transparent 1px 100%),
    var(--campaign-cream);
  background-size: 120px 120px, 180px 180px, auto;
}

.campaign-paper-card {
  background: rgba(255, 253, 249, 0.88);
  border: 1px solid var(--campaign-border);
  border-radius: 28px;
  box-shadow: 0 18px 45px rgba(47, 58, 56, 0.08);
}

.campaign-label {
  font-family: Inter, sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: var(--campaign-clay);
}

.campaign-title {
  font-family: "Playfair Display", serif;
  color: var(--campaign-sage);
  letter-spacing: -0.02em;
}

.campaign-body {
  font-family: Inter, sans-serif;
  color: var(--campaign-ink);
  line-height: 1.75;
}

.campaign-quote {
  font-family: "Playfair Display", serif;
  color: var(--campaign-ink);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.campaign-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--campaign-sage);
  color: var(--campaign-warm-white);
  padding: 0.85rem 1.4rem;
  font-family: Inter, sans-serif;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 12px 24px rgba(47, 58, 56, 0.14);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.campaign-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(47, 58, 56, 0.18);
}

.origami-corner {
  position: relative;
  overflow: hidden;
}

.origami-corner::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  border-top: 44px solid var(--campaign-soft-clay);
  border-left: 44px solid transparent;
  opacity: 0.75;
}

.campaign-divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(74, 92, 90, 0.24),
    transparent
  );
}

.campaign-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--campaign-border);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  background: rgba(255, 253, 249, 0.7);
  color: var(--campaign-sage);
  font-size: 0.8rem;
  font-weight: 700;
}
```

- [ ] **Step 2: Create SVG motif directory**

Run:

```bash
mkdir -p design/unfolding-origami-campaign/svg
```

Expected: directory exists.

- [ ] **Step 3: Create `origami-crane-line.svg`**

Create `design/unfolding-origami-campaign/svg/origami-crane-line.svg`:

```svg
<svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Minimal origami crane line art">
  <path d="M22 92L78 42L112 88L164 28L198 132L112 88L88 138L78 42L22 92Z" stroke="#4A5C5A" stroke-width="2" stroke-linejoin="round"/>
  <path d="M78 42L112 88M112 88L88 138M112 88L198 132" stroke="#B98F76" stroke-width="1.5" stroke-linejoin="round" opacity="0.65"/>
</svg>
```

- [ ] **Step 4: Create `fold-lines.svg`**

Create `design/unfolding-origami-campaign/svg/fold-lines.svg`:

```svg
<svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M50 520L300 80L550 520" stroke="#4A5C5A" stroke-width="1" opacity="0.14"/>
  <path d="M120 80L480 520" stroke="#B98F76" stroke-width="1" opacity="0.12"/>
  <path d="M480 80L120 520" stroke="#4A5C5A" stroke-width="1" opacity="0.10"/>
  <path d="M300 80V520" stroke="#2F3A38" stroke-width="1" opacity="0.08"/>
</svg>
```

- [ ] **Step 5: Create `paper-corner.svg`**

Create `design/unfolding-origami-campaign/svg/paper-corner.svg`:

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M120 0H0L120 120V0Z" fill="#E6D1C3" opacity="0.45"/>
  <path d="M0 0L120 120" stroke="#B98F76" stroke-width="1" opacity="0.25"/>
</svg>
```

- [ ] **Step 6: Validate CSS and motif files**

Run:

```bash
test -f styles-campaign.css
test -f design/unfolding-origami-campaign/svg/origami-crane-line.svg
test -f design/unfolding-origami-campaign/svg/fold-lines.svg
test -f design/unfolding-origami-campaign/svg/paper-corner.svg
rg -n "campaign-section|campaign-paper-card|campaign-button|origami-corner" styles-campaign.css
```

Expected: all files exist and required classes are found.

- [ ] **Step 7: Commit campaign CSS and motifs**

Run:

```bash
git diff -- styles-campaign.css design/unfolding-origami-campaign/svg
git add styles-campaign.css design/unfolding-origami-campaign/svg
git commit -m "Add Unfolding Origami campaign visual system"
```

Expected: commit includes the CSS file and three SVG files only.

---

### Task 3: Create Campaign Documentation Files

**Files:**
- Create: `design/unfolding-origami-campaign/README.md`
- Create: `design/unfolding-origami-campaign/campaign-design-system.md`
- Create: `design/unfolding-origami-campaign/campaign-copy.md`
- Create: `design/unfolding-origami-campaign/social-template-specs.md`
- Create: `design/unfolding-origami-campaign/website-component-specs.md`
- Create: `design/unfolding-origami-campaign/print-template-specs.md`
- Create: `design/unfolding-origami-campaign/export-checklist.md`

- [ ] **Step 1: Create the campaign root directory**

Run:

```bash
mkdir -p design/unfolding-origami-campaign/templates design/unfolding-origami-campaign/exports
```

Expected: template and export directories exist.

- [ ] **Step 2: Create `README.md`**

Create `design/unfolding-origami-campaign/README.md`:

```markdown
# Unfolding Origami Campaign Design System

This folder contains reusable design elements for Loren Galese's preorder and launch campaign for *Unfolding Origami: A Memoir*.

## Campaign Message

A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.

## Visual Direction

Minimal, literary, warm, trauma-informed, grounded, restrained, and quietly powerful.

## Core Assets

- Instagram preorder post
- Instagram quote post
- Instagram community post
- Instagram preorder story
- Instagram quote story
- Sell sheet
- Table tent
- Website campaign component
- SVG motifs

## Primary CTA

Preorder Now

## Public URL

https://wovenself.com/author

## Stripe Link

https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00

## Export Sizes

| Asset | Size |
|---|---|
| Instagram post | 1080 x 1080 |
| Instagram story | 1080 x 1920 |
| Sell sheet | 8.5 x 11 in |
| Table tent | 11 x 8.5 in |

## Design Rules

- Keep layouts minimal.
- Use one primary message per asset.
- Keep trauma language restrained.
- Prioritize community and recognition.
- Use paper, fold, and origami motifs subtly.
- Preserve readability.
- Do not overcrowd designs.
- Use `Unfolding Origami: A Memoir` consistently.
```

- [ ] **Step 3: Create `campaign-design-system.md`**

Create `design/unfolding-origami-campaign/campaign-design-system.md` using the palette and rules from the approved spec:

```markdown
# Campaign Design System

## Campaign

*Unfolding Origami: A Memoir* by Loren Galese.

## Visual System

Quiet Paper System.

The visual system should feel minimal, literary, emotional but restrained, trauma-informed, warm, authorial, clean, elegant, and quietly powerful.

## Motifs

Use:

- Paper texture
- Soft crease lines
- Folded-corner details
- Soft paper cards
- Restrained origami line art
- Generous whitespace
- Warm cream and white surfaces
- Sage and ink typography
- Clay accents

Avoid:

- Red and black danger palettes
- Sensational trauma-marketing visuals
- Stock therapy cliches
- Overcrowded layouts
- Heavy effects
- Excessive gradients
- Rage-bait visual language
- Too many fonts

## Palette

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

## Typography

- Playfair Display for headings, pull quotes, and book-title emphasis.
- Inter for body copy, labels, metadata, and CTAs.

## Primary Campaign Positioning

A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.

## CTA

Preorder Now

## Public URL

https://wovenself.com/author
```

- [ ] **Step 4: Create `campaign-copy.md`**

Create `design/unfolding-origami-campaign/campaign-copy.md`:

```markdown
# Campaign Copy

## Book Title

*Unfolding Origami: A Memoir*

## Author

Loren Galese

## Primary Positioning

A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.

## Primary Hook

Some wounds don't bleed - they fold you inward.

## Secondary Hook

After trauma, healing is not always becoming someone new. Sometimes it is folding back to yourself and learning to trust your own shape again.

## Community Line

For the ones who survived quietly.

## Reader-Facing Copy

For readers who have survived quietly, questioned themselves deeply, or are learning to trust their own instincts again, this memoir offers a personal story of trauma, survival, and return.

## Short Book Description

*Unfolding Origami: A Memoir* is Loren Galese's personal story of surviving trauma, naming coercive control, and re-defining her shape after being folded inward by pain.

## Medium Book Description

*Unfolding Origami: A Memoir* is a trauma therapist's personal story of surviving trauma, naming coercive control, and learning to trust her own shape again. Through the metaphor of folding and unfolding, Loren Galese explores what it means to be folded inward by pain, survive quietly, and begin the long work of returning to yourself.

## Preorder Copy

Preorders are open now.

Preorders are $24.99 and include a signed copy plus a surprise from Loren.

Release date: July 20.

## CTA

Preorder Now

## Public URL

https://wovenself.com/author

## Stripe URL

https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00

## Safety Rule

Do not promise healing, cure, clinical treatment, or guaranteed outcomes.
```

- [ ] **Step 5: Create specs and checklist**

Create `social-template-specs.md`, `website-component-specs.md`, `print-template-specs.md`, and `export-checklist.md` with the exact requirements from the attached implementation task. Keep each file focused on its own asset type.

The `export-checklist.md` must include:

```markdown
# Export Checklist

## Required Checks

- [ ] Instagram post templates are 1080 x 1080.
- [ ] Instagram story templates are 1080 x 1920.
- [ ] Sell sheet is letter size.
- [ ] Table tent is landscape letter size.
- [ ] All visible URLs use `wovenself.com/author`.
- [ ] All CTAs say `Preorder Now` or `Preorder signed copies`.
- [ ] No stale list-building CTA copy appears.
- [ ] No stale old-title copy appears in live-facing assets.
- [ ] Copy includes `trauma therapist`.
- [ ] Copy includes `folding back to yourself`.
- [ ] Copy includes `re-defining your shape`.
- [ ] Reader-community language is included where appropriate.
- [ ] Designs are restrained and non-sensationalized.
- [ ] Text remains editable in source HTML.
- [ ] QR code placeholder is clearly labeled unless a real QR code is generated.
- [ ] Exports are placed in `design/unfolding-origami-campaign/exports/`.

## Expected Exports

```txt
design/unfolding-origami-campaign/exports/instagram-post-preorder.png
design/unfolding-origami-campaign/exports/instagram-post-quote.png
design/unfolding-origami-campaign/exports/instagram-post-community.png
design/unfolding-origami-campaign/exports/instagram-story-preorder.png
design/unfolding-origami-campaign/exports/instagram-story-quote.png
design/unfolding-origami-campaign/exports/sell-sheet.pdf
design/unfolding-origami-campaign/exports/table-tent.pdf
```
```

- [ ] **Step 6: Validate documentation**

Run:

```bash
find design/unfolding-origami-campaign -maxdepth 2 -type f | sort
rg -n "Folding\\s+Origami|Join the Launch\\s+List|PLACEHOLDER_MARKER" design/unfolding-origami-campaign || true
```

Expected: required docs and SVG files are present; no stale title or placeholder markers appear in the new campaign folder.

---

### Task 4: Create Browser-Renderable Campaign Templates

**Files:**
- Create: `design/unfolding-origami-campaign/templates/instagram-post-preorder.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-post-quote.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-post-community.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-story-preorder.html`
- Create: `design/unfolding-origami-campaign/templates/instagram-story-quote.html`
- Create: `design/unfolding-origami-campaign/templates/sell-sheet.html`
- Create: `design/unfolding-origami-campaign/templates/table-tent.html`

- [ ] **Step 1: Create template shared CSS pattern**

Each template should be a standalone HTML document. Use this base structure and customize content/canvas size per template:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unfolding Origami Campaign Template</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
  <style>
    :root {
      --cream: #FBF7F0;
      --white: #FFFDF9;
      --sage: #4A5C5A;
      --muted-sage: #7D8C88;
      --clay: #B98F76;
      --soft-clay: #E6D1C3;
      --ink: #2F3A38;
      --mist: #EDE8E1;
      --border: #D8CEC2;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #ddd;
      font-family: Inter, sans-serif;
      color: var(--ink);
    }
    [contenteditable="true"] {
      outline: 1px solid transparent;
      outline-offset: 4px;
    }
    [contenteditable="true"]:focus {
      outline-color: rgba(185, 143, 118, 0.7);
    }
    .canvas {
      background:
        linear-gradient(135deg, rgba(74, 92, 90, 0.05) 0 1px, transparent 1px 100%),
        linear-gradient(45deg, rgba(185, 143, 118, 0.05) 0 1px, transparent 1px 100%),
        var(--cream);
      background-size: 150px 150px, 220px 220px, auto;
      overflow: hidden;
      position: relative;
    }
    .label {
      color: var(--clay);
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .title,
    .quote {
      font-family: "Playfair Display", serif;
      color: var(--sage);
    }
    .paper-card {
      background: rgba(255, 253, 249, 0.86);
      border: 1px solid var(--border);
      border-radius: 28px;
      box-shadow: 0 18px 45px rgba(47, 58, 56, 0.08);
    }
    .footer {
      border-top: 1px solid rgba(74, 92, 90, 0.2);
    }
  </style>
</head>
<body>
  <main class="canvas">
    <!-- Template-specific editable content goes here. -->
  </main>
</body>
</html>
```

- [ ] **Step 2: Create Instagram feed templates**

For `instagram-post-preorder.html`, use `.canvas { width: 1080px; height: 1080px; padding: 86px; }` and include the required copy:

```txt
PREORDERS OPEN
Unfolding Origami: A Memoir
A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.
Signed copy
Surprise from Loren
$24.99
July 20
wovenself.com/author
```

For `instagram-post-quote.html`, use `.canvas { width: 1080px; height: 1080px; padding: 96px; }` and include:

```txt
Some wounds don't bleed - they fold you inward.
Unfolding Origami: A Memoir
Loren Galese
Preorder Now
```

For `instagram-post-community.html`, use `.canvas { width: 1080px; height: 1080px; padding: 96px; }` and include:

```txt
For the ones who survived quietly.
Healing is not becoming untouched.
Sometimes it is folding back to yourself and re-defining your shape.
Unfolding Origami: A Memoir
wovenself.com/author
```

- [ ] **Step 3: Create Instagram story templates**

For story templates, use `.canvas { width: 1080px; height: 1920px; padding: 96px; }`.

`instagram-story-preorder.html` must include:

```txt
PREORDERS ARE OPEN
Unfolding Origami: A Memoir
A trauma therapist's memoir about folding back to yourself after trauma.
Signed copies include a surprise from Loren.
wovenself.com/author
```

`instagram-story-quote.html` must include:

```txt
Some wounds don't bleed -
they fold you inward.
Unfolding Origami: A Memoir
Loren Galese
Preorder signed copies:
wovenself.com/author
```

- [ ] **Step 4: Create print templates**

Create `sell-sheet.html` as a print-friendly letter page with:

```css
@page { size: 8.5in 11in; margin: 0; }
.sheet { width: 8.5in; height: 11in; padding: 0.55in; }
```

Include:

```txt
Unfolding Origami: A Memoir
Loren Galese
Some wounds don't bleed - they fold you inward.
A trauma therapist's memoir about trauma, coercive control, survival, and folding back to yourself.
Preorders:
$24.99
Signed copy plus a surprise from Loren
Release date: July 20
wovenself.com/author
Contact:
loren@wovenself.com
wovenself.com
Substack: @quietalchemywloren
```

Create `table-tent.html` as a landscape letter page with:

```css
@page { size: 11in 8.5in; margin: 0; }
.sheet { width: 11in; height: 8.5in; padding: 0.35in; }
```

Include:

```txt
Unfolding Origami: A Memoir
Loren Galese
Some wounds don't bleed - they fold you inward.
A trauma therapist's memoir about trauma, coercive control, survival, and folding back to yourself.
Preorders are open now.
Signed copies include a surprise from Loren.
Release date: July 20.
Scan to preorder:
wovenself.com/author
loren@wovenself.com
Substack: @quietalchemywloren
wovenself.com
```

Use visible placeholders labeled `Book cover placeholder` and `QR code placeholder`.

- [ ] **Step 5: Validate template source**

Run:

```bash
rg -n "Folding\\s+Origami|Join the Launch\\s+List|launch\\s+list|unsupported|bestseller|award" design/unfolding-origami-campaign/templates || true
rg -n "Unfolding Origami: A Memoir|Loren Galese|wovenself\\.com/author" design/unfolding-origami-campaign/templates
```

Expected: no stale old-title or list-building CTA copy; required title/author/URL appear across templates.

- [ ] **Step 6: Commit campaign docs and templates**

Run:

```bash
git diff -- design/unfolding-origami-campaign
git add design/unfolding-origami-campaign
git commit -m "Create Unfolding Origami campaign templates"
```

Expected: commit includes the campaign docs, SVGs if not already committed, exports directory if represented by tracked files, and HTML templates. Do not include `.DS_Store`.

---

### Task 5: Normalize Marketing Copy

**Files:**
- Modify: `marketing/book-launch/README.md`
- Modify: `marketing/book-launch/launch-copy.md`
- Modify: `marketing/book-launch/social-captions.md`
- Modify: `marketing/book-launch/talking-points.md`
- Modify: `marketing/book-launch/email-campaign.md`
- Modify: `marketing/book-launch/metadata.md`
- Modify: `marketing/book-launch/press-kit.md`
- Modify: `marketing/book-launch/outreach-templates.md`
- Modify: `marketing/book-launch/faq.md`
- Modify: `marketing/book-launch/graphics-copy/*.md`

- [ ] **Step 1: Inspect untracked marketing files**

Run:

```bash
find marketing/book-launch -maxdepth 3 -type f -print | sort
git status --short marketing/book-launch
```

Expected: marketing files are visible and untracked or modified as user-owned campaign assets.

- [ ] **Step 2: Replace stale book title references**

Run:

```bash
perl -0pi -e 's/Folding\\s+Origami/Unfolding Origami/g' marketing/book-launch/**/*.md marketing/book-launch/*.md
```

Expected: active marketing copy uses `Unfolding Origami`.

- [ ] **Step 3: Normalize primary positioning**

In core files such as `README.md`, `launch-copy.md`, `social-captions.md`, `talking-points.md`, `metadata.md`, and `press-kit.md`, add or replace description copy with this approved language:

```markdown
*Unfolding Origami: A Memoir* is a trauma therapist's personal story of surviving trauma, naming coercive control, and re-defining her shape after being folded inward by pain.
```

Use this community language where appropriate:

```markdown
For readers who have survived quietly, questioned themselves deeply, or are learning to trust their own instincts again, this memoir offers a personal story of trauma, survival, and return.
```

Use this preorder language:

```markdown
Preorders are open now.

Preorders are $24.99 and include a signed copy plus a surprise from Loren.

Release date: July 20.

[Preorder Now](https://wovenself.com/author)
```

- [ ] **Step 4: Update social captions and graphics copy**

Ensure social and graphics files include at least these phrases across the set:

```txt
trauma therapist's memoir
folding back to yourself
re-defining your shape
For the ones who survived quietly.
Preorder Now
signed copy plus a surprise from Loren
https://wovenself.com/author
```

Do not add sensational claims or guarantees.

- [ ] **Step 5: Validate marketing copy**

Run:

```bash
rg -n "Folding\\s+Origami|Join the Launch\\s+List|launch\\s+list|coming soon|memoir is currently in development|more updates to come" marketing/book-launch || true
rg -n "trauma therapist|folding back to yourself|re-defining your shape|survived quietly|signed copy plus a surprise from Loren|https://wovenself\\.com/author" marketing/book-launch
```

Expected: no stale active old-title or list-building CTA copy remains. Required campaign phrases appear in marketing files.

- [ ] **Step 6: Commit marketing normalization**

Run:

```bash
git diff -- marketing/book-launch
git add marketing/book-launch
git reset -- marketing/book-launch/.DS_Store 2>/dev/null || true
git commit -m "Normalize book launch copy for Unfolding Origami"
```

Expected: commit includes intentional marketing Markdown updates and excludes `.DS_Store`.

---

### Task 6: Validate Static Site And Campaign Assets

**Files:**
- Verify: `author.html`
- Verify: `styles-campaign.css`
- Verify: `design/unfolding-origami-campaign/templates/*.html`
- Verify: `marketing/book-launch/**/*.md`

- [ ] **Step 1: Run stale-copy search**

Run:

```bash
rg -n "Folding\\s+Origami|Join the Launch\\s+List|launch\\s+list|coming soon|memoir is currently in development|more updates to come" \
  --glob '!/.git/**' \
  --glob '!node_modules/**' \
  --glob '!docs/superpowers/specs/**' \
  --glob '!docs/superpowers/plans/**' \
  --glob '!design/unfolding-origami-launch-card/**' \
  --glob '!output/**'
```

Expected: no stale matches in live-facing files, `marketing/book-launch/`, or `design/unfolding-origami-campaign/`. Existing historical design folders may be separately documented if intentionally left untouched.

- [ ] **Step 2: Start local static server**

Run:

```bash
python3 -m http.server 8080
```

Expected: server starts and serves the repo root.

- [ ] **Step 3: Inspect author page in browser**

Open:

```txt
http://localhost:8080/author.html
```

Confirm:

```txt
Page uses Unfolding Origami: A Memoir.
CTA says Preorder Now.
CTA links to https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00.
Stripe link uses target="_blank" rel="noopener noreferrer".
Page includes $24.99.
Page includes July 20.
Page includes signed copy plus a surprise from Loren.
Page includes trauma therapist positioning.
Page includes folding back to yourself.
Page includes re-defining your shape.
Page includes reader-community language.
Existing layout remains intact.
Therapy booking flow still points to Headway.
```

- [ ] **Step 4: Inspect templates in browser**

Open representative file URLs through the local server:

```txt
http://localhost:8080/design/unfolding-origami-campaign/templates/instagram-post-preorder.html
http://localhost:8080/design/unfolding-origami-campaign/templates/instagram-post-quote.html
http://localhost:8080/design/unfolding-origami-campaign/templates/instagram-post-community.html
http://localhost:8080/design/unfolding-origami-campaign/templates/instagram-story-preorder.html
http://localhost:8080/design/unfolding-origami-campaign/templates/instagram-story-quote.html
http://localhost:8080/design/unfolding-origami-campaign/templates/sell-sheet.html
http://localhost:8080/design/unfolding-origami-campaign/templates/table-tent.html
```

Confirm correct title, author, URL, dimensions, readable text, generous margins, restrained visual language, no unsupported claims, and no stale list-building CTA copy.

- [ ] **Step 5: Check git status and final diff**

Run:

```bash
git status --short
git log --oneline -6
```

Expected: implementation commits are present. Remaining dirty files, if any, are documented in the final report and are not accidentally staged.

---

## Self-Review

Spec coverage:

- Author page messaging and metadata: Task 1.
- Campaign CSS and motifs: Task 2.
- Campaign design folder and docs: Task 3.
- Browser-renderable templates: Task 4.
- Marketing copy normalization: Task 5.
- Validation and reporting: Task 6.
- Safety constraints and non-goals: covered in file structure, task boundaries, and validation steps.

Placeholder scan:

- No incomplete-marker phrases remain outside intentional task checkboxes and validation examples.

Type and path consistency:

- All paths use repository-relative static-site paths.
- The correct public book title is `Unfolding Origami: A Memoir`.
- The Stripe Payment Link remains `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`.
