# Unfolding Origami Campaign System

This folder contains reusable design elements for Loren Galese's preorder and launch campaign for *Unfolding Origami: A Memoir*.

## Campaign Message

*Unfolding Origami: A Memoir* is a trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.

Primary hook:

> Some wounds don't bleed - they fold you inward.

Secondary message:

> Healing is not becoming untouched. Sometimes it is folding back to yourself and re-defining your shape.

Community line:

> For the ones who survived quietly.

## Visual Direction

Use the Quiet Paper System: minimal, literary, warm, restrained, trauma-informed, and authorial.

Core visual qualities:

- Warm paper surfaces.
- Soft crease and fold-line details.
- Folded-corner accents.
- Restrained origami line art.
- Generous whitespace.
- Sage, ink, cream, warm white, and clay accents.

Avoid sensational trauma visuals, red or black danger palettes, stock therapy cliches, crowded layouts, heavy effects, excessive gradients, unsupported awards, bestseller claims, cure promises, clinical treatment guarantees, and outdated preorder-status language.

## Core Assets

- `styles-campaign.css`: shared Quiet Paper System tokens and component classes.
- `svg/origami-crane-line.svg`: restrained origami line motif.
- `svg/fold-lines.svg`: subtle paper-crease motif.
- `svg/paper-corner.svg`: folded-corner motif.
- `templates/`: source location for future editable HTML social and print templates.
- `exports/`: output location for final rendered PNG and PDF exports.

## Public Details

| Field | Value |
| --- | --- |
| Book | *Unfolding Origami: A Memoir* |
| Author | Loren Galese |
| Price | `$24.99` |
| Release date | `July 20` |
| Preorder incentive | Signed copy plus a surprise from Loren |
| Primary CTA | `Preorder Now` |
| Public URL | `https://wovenself.com/author` |
| Visible URL | `wovenself.com/author` |
| Stripe link | `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00` |

External Stripe links must use `target="_blank" rel="noopener noreferrer"`.

## Export Sizes

| Asset | Size | Expected export |
| --- | --- | --- |
| Instagram preorder post | `1080 x 1080` | `exports/instagram-post-preorder.png` |
| Instagram quote post | `1080 x 1080` | `exports/instagram-post-quote.png` |
| Instagram community post | `1080 x 1080` | `exports/instagram-post-community.png` |
| Instagram preorder story | `1080 x 1920` | `exports/instagram-story-preorder.png` |
| Instagram quote story | `1080 x 1920` | `exports/instagram-story-quote.png` |
| Sell sheet | Letter, `8.5 x 11 in` | `exports/sell-sheet.pdf` |
| Table tent | Landscape letter, `11 x 8.5 in` | `exports/table-tent.pdf` |

## Design Rules

- Keep one primary message per asset.
- Use `Unfolding Origami: A Memoir` consistently.
- Use `wovenself.com/author` for visible campaign traffic.
- Use `Preorder Now` or `Preorder signed copies` for CTAs.
- Keep text editable in source files.
- Use `assets/preorder-qr.svg` for preorder QR placements.
- Keep reader-community copy restrained and non-sensationalized.
- Do not redesign the full website as part of this campaign system.
