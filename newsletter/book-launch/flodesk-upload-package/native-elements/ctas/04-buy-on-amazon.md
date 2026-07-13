# CTA 04 — Buy on Amazon

## Assembly position

22 in the complete 28-position upload/native-element sequence.

## Placement

- Previous element: `upload-pieces/17-butterfly-separator-05-and-choose-your-copy.png`
- Next element: CTA 05 — `Order Your Signed Copy`
- Newsletter section: Choose Your Copy purchase group
- Desktop position: First of two equal 50% columns in the 536px purchase row; 7px inner gutter contributes to a 14px total inter-button gap
- Mobile position: First purchase CTA; 342px full width at the approved 390px viewport with 24px side margins

## Flodesk block

- Block type: Button
- Label: `Buy on Amazon`
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
- Alignment: Center
- Width behavior: Equal 50% desktop purchase column with a 7px inner gutter; full width on mobile
- Desktop height target: 54px
- Mobile width: 342px at a 390px viewport
- Border radius: 4px
- Background color: `#0D182A`
- Text color: `#F3E7D4`
- Font: Arial, Helvetica, sans-serif
- Font size: 16px
- Font weight: 700
- Letter spacing: Normal, with 0px added tracking
- Horizontal padding: 18px
- Vertical padding: 16px
- Border: 2px solid `#0D182A`
- Line height: 18px
- Space above: 0px after upload piece 17
- Space below: 0px on desktop; 12px before CTA 05 on mobile

## Mobile behavior

- Full width: Yes
- Stacking order: 1 of 2 in the Choose Your Copy purchase group
- Gap from adjacent button: 12px below CTA 04
- Required order relative to other CTAs: Amazon first, immediately before CTA 05

## Build instructions

1. Add a Flodesk button block.
2. Enter the exact label `Buy on Amazon`.
3. Paste the exact Amazon destination above.
4. Apply every color, border, radius, type, padding, width, height, alignment, and spacing value above.
5. Position it as the first button after `upload-pieces/17-butterfly-separator-05-and-choose-your-copy.png`.
6. Preview on desktop and confirm the first equal-width purchase column, 14px total group gutter, and 54px height.
7. Preview on mobile and confirm a 342px full-width button above CTA 05 with 12px separation.
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
