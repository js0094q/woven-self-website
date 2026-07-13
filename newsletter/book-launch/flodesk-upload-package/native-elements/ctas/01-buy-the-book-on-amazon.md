# CTA 01 — Buy the Book on Amazon

## Assembly position

05 in the complete 28-position upload/native-element sequence.

## Placement

- Previous element: `upload-pieces/04-hero-eyebrow-heading-and-supporting-copy.png`
- Next element: CTA 02 — `Read an Excerpt`
- Newsletter section: Hero CTA group
- Desktop position: Centered; fixed 249px target width inside the 640px email shell
- Mobile position: First hero CTA; 342px full width at the approved 390px viewport with 24px side margins

## Flodesk block

- Block type: Button
- Label: `Buy the Book on Amazon`
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
- Alignment: Center
- Width behavior: Fixed 249px target on desktop; full width inside 24px mobile side margins
- Desktop height target: 54px
- Mobile width: 342px at a 390px viewport
- Border radius: 4px
- Background color: `#0D182A`
- Text color: `#F3E7D4`
- Font: Arial, Helvetica, sans-serif
- Font size: 16px
- Font weight: 700
- Letter spacing: Normal, with 0px added tracking
- Horizontal padding: 26px
- Vertical padding: 16px
- Border: 2px solid `#0D182A`
- Line height: 18px
- Space above: 0px
- Space below: 12px before CTA 02

## Mobile behavior

- Full width: Yes
- Stacking order: 1 of 2 in the hero CTA group
- Gap from adjacent button: 12px below CTA 01
- Required order relative to other CTAs: Immediately before CTA 02; both remain above upload piece 05

## Build instructions

1. Add a Flodesk button block.
2. Enter the exact label `Buy the Book on Amazon`.
3. Paste the exact Amazon destination above.
4. Apply every color, border, radius, type, padding, width, height, alignment, and spacing value above.
5. Position the block after `upload-pieces/04-hero-eyebrow-heading-and-supporting-copy.png`.
6. Preview on desktop and confirm a centered 249px target width and 54px height.
7. Preview on mobile and confirm a 342px full-width block above CTA 02.
8. Save.
9. Reopen the link settings.
10. Confirm the saved destination contains `B0H7YZ5N28` and has no query string or tracking parameter.

## Validation

- [ ] Label matches approved HTML
- [ ] Destination matches approved link map
- [ ] Placement matches assembly sequence
- [ ] Desktop height matches approved preview
- [ ] Mobile behavior matches approved preview
- [ ] Link opens the intended destination
