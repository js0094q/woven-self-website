# The Woven Self design system

This document describes the shared visual system for the existing static site. It is a refinement of the current identity, not a rebrand. Keep the warm, calm palette, editorial serif headings, clear sans-serif copy, rounded cards, generous space, and restrained imagery.

The measurements below describe the implemented shared system.

## Foundations

### Color

Preserve the colors already established in `styles.css`:

| Role | Existing value | Use |
| --- | --- | --- |
| Deep green / sage | `#2e4341` | Primary actions, links, and main headings |
| Soft green | `#3f5451` | Supporting green surfaces or interaction states |
| Warm cream | `#faf7f2` | Main page background |
| Soft cream | `#f4efe7` | Alternate sections and warm card or book surfaces |
| Body ink | `#2f3a38` | Main copy |
| Muted ink | `#5f6e6b` | Secondary copy and quiet navigation |
| Soft pink | `#eba7b5` | Small CTA arrow accent |

Expose the palette through shared semantic custom properties. Components should use those properties rather than repeat literal colors. Keep the author/book pages' existing navy and blush art direction where already used; it is a page-specific expression of the brand.

### Type

- **Display and editorial headings:** Playfair Display.
- **Body, navigation, labels, forms, and controls:** Inter.
- **H1:** `clamp(2.25rem, 4.5vw, 3.75rem)`.
- **H2:** `clamp(1.75rem, 3vw, 2.5rem)`.
- **H3:** `clamp(1.35rem, 2vw, 1.65rem)`.
- **Body:** `1rem` with `1.65` line height; long copy uses a maximum measure of `70ch`.
- **Small labels and eyebrows:** Inter at `0.875rem`, with restrained weight and tracking.
- **Small informational heading:** use `.heading-small` when a sans-serif label-like heading is more appropriate than the serif heading scale.

Use semantic heading levels for document structure. Do not apply a display font and size to every heading solely by element selector. A page title, section heading, card heading, and small informational heading need distinct hierarchy. Avoid local type-size overrides when a shared role or a content-width adjustment can solve the issue.

### Shared layout rhythm

Use a shared section spacing of `clamp(3rem, 5vw, 5rem)`, or 48–80px. Cards use a 24px grid gap and `clamp(24px, 3vw, 36px)` internal padding. Keep the roomy editorial feel while avoiding oversized gaps around subpage titles and the header. Prefer shared section and card classes over repeated Tailwind spacing and radius utilities. Keep long body copy comfortably readable and prevent headings and controls from touching card edges.

## Buttons and calls to action

Use two reusable CTA treatments. Links that navigate remain anchors; form submission and in-page actions remain buttons. The visible control surface, including the arrow accent, is part of the same clickable element.

### Primary

- Deep green background with white Inter label.
- Soft pink circular arrow accent on the right.
- Minimum height of 52px, pill radius of `999px`, horizontal padding of 10px 20px, Inter label at 15px and weight 600, and a 12px icon gap across the site.
- Use a 28px circular arrow container, with the diagonal arrow SVG centered inside it.
- Use a real child structure: `.btn-label` for text and `.btn-arrow` for the icon container. Render the arrow as inline SVG with `aria-hidden="true"` and `focusable="false"`; do not draw it with a pseudo-element.
- Keep the label and arrow vertically centered. Use a fixed gap and `flex-shrink: 0` for the icon so long labels wrap or the control grows without overlap.
- Provide a visible hover state, a high-contrast `:focus-visible` outline, and a touch-friendly target on mobile.

Example structure:

```html
<a class="btn-primary" href="/therapy.html">
  <span class="btn-label">Explore therapy</span>
  <span class="btn-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" focusable="false"><path d="M7 17 17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
</a>
```

### Secondary

Use one restrained secondary treatment: transparent background, deep-green text, and a simple arrow. On existing dark author surfaces, use cream text for contrast. A subtle underline may appear on hover and focus. Keep its typography, icon alignment, focus visibility, and target sizing consistent with the primary CTA. Remove unrelated underlined-link styles when the link is functioning as a designed CTA.

Do not add a second arrow through `::after` when the markup already contains an icon. The arrow must never cover the label or touch the control border.

## Cards

Use a shared card base for reusable cards, with variants only when content or contrast calls for them. Standard anatomy is:

1. Optional eyebrow or category label.
2. Main serif heading.
3. Optional subtitle.
4. Short body copy.
5. Optional CTA.

Use a 24px radius and `clamp(24px, 3vw, 36px)` internal padding. Keep card background, border, and shadow consistent. Use a shared vertical rhythm between eyebrow, title, subtitle, body, and CTA. Align cards in a grid without forcing equal content density. Where a group of cards has different copy lengths and aligned actions improve scanning, use a column layout with the CTA pushed to the bottom; do not force every card to the same minimum height without a reason. Images used as card content should retain intrinsic proportions unless a deliberate crop is defined.

Prefer component classes for card padding and radius. Remove duplicate Tailwind padding, radius, and paragraph-spacing utilities when they conflict with shared card anatomy.

## Header and navigation

### Desktop

- Use a compact first row for the logo and “Loren Galese, LPC, ACS”.
- Place the primary navigation in a second row with consistent gaps and alignment.
- Size the logo at 300 × 78px and the name at a responsive 18–24px.
- Keep the header calm and easy to scan without letting the repeated name compete with the page title.
- Keep the logo and name sizing stable across subpages.

### Mobile

- Keep the logo and menu control together in the top row.
- Place the name in a modest, readable row below.
- Limit the logo to 280 × 68px and set the name to 18px.
- Preserve a clear focus indicator and adequate touch target for the menu control.
- Prevent the logo, name, and menu from wrapping into competing rows or causing horizontal overflow.

Implement the two layouts through one shared header rule set and a small number of responsive breakpoints. Navigation links and menu controls have a minimum 44px touch target. Do not repeat competing dimensions in multiple CSS files.

### Mobile menu states

- The menu trigger exposes its state with `aria-expanded` and references the drawer with `aria-controls`.
- When the drawer opens, move focus into it, expose the drawer to assistive technology, and make the background inert. Keep focus within the drawer while it is open.
- Escape, the close button, the backdrop, or choosing a navigation link closes the drawer. Return focus to the menu trigger after Escape, close-button, or backdrop dismissal.
- When the viewport crosses into the desktop layout, close the drawer and return focus to the first desktop navigation link.
- Keep the closed drawer hidden and inert. Respect reduced-motion settings for transitions.

## Page and responsive behavior

Use the same heading hierarchy, section rhythm, paragraph measure, card anatomy, and CTA classes on the homepage and subpages. Keep the author/book palette accents scoped to those surfaces while reusing the shared type and control primitives.

At desktop, laptop, tablet, and narrow mobile widths, check for horizontal scrolling, clipped text, wrapped labels colliding with icons, uneven card gaps, stretched images, crowded footers, and headings that become excessively tall. Prefer a shared component or width correction over page-specific font-size hacks.

## Accessibility

- Keep text and control contrast readable against each surface.
- Preserve semantic links for navigation and buttons for actions.
- Provide visible keyboard focus for every interactive element.
- Do not use color alone to signal interaction or state.
- Keep body text readable on mobile and long-form text within a comfortable measure.
- Keep heading order meaningful; visual size should not dictate semantic level.
- Mark decorative CTA SVGs and images as hidden from assistive technology.
- Ensure the entire visible CTA area responds to pointer and keyboard activation.
