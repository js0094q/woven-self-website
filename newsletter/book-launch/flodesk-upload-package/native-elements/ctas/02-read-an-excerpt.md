# CTA 02 — Read an Excerpt

## Assembly position

06 in the complete 28-position upload/native-element sequence.

## Placement

- Previous element: CTA 01 — `Buy the Book on Amazon`
- Next element: `upload-pieces/05-butterfly-separator-02.png`
- Newsletter section: Hero CTA group
- Desktop position: Centered; fixed 261px target width inside the 640px email shell
- Mobile position: Second hero CTA; 342px full width at the approved 390px viewport with 24px side margins

## Flodesk block

- Block type: Button
- Label: `Read an Excerpt`
- Destination: `https://wovenself.com/excerpt-unfolding-origami.html`
- Alignment: Center
- Width behavior: Fixed 261px target on desktop; full width inside 24px mobile side margins
- Desktop width target: 261px
- Desktop height target: 54px
- Mobile width: 342px at a 390px viewport
- Border radius: 4px
- Background color: `#F7EFE4`
- Text color: `#0D182A`
- Font: Arial, Helvetica, sans-serif
- Font size: 16px
- Font weight: 700
- Letter spacing: Normal, with 0px added tracking
- Horizontal padding: 26px
- Vertical padding: 16px
- Border: 2px solid `#0D182A`
- Line height: 18px
- Space above: 0px in this block; CTA 01 supplies the 12px inter-button gap
- Space below: 10px before upload piece 05

## Mobile behavior

- Full width: Yes
- Stacking order: 2 of 2 in the hero CTA group
- Gap from adjacent button: 12px above CTA 02; 10px below before upload piece 05
- Required order relative to other CTAs: Immediately after CTA 01 and before upload piece 05

## Build instructions

1. Add a Flodesk button block.
2. Enter the exact label `Read an Excerpt`.
3. Paste the exact excerpt destination above.
4. Apply every color, border, radius, type, padding, width, height, alignment, and spacing value above.
5. Position the block after CTA 01 and before `upload-pieces/05-butterfly-separator-02.png`.
6. Preview on desktop and confirm a centered 261px target width and 54px height.
7. Preview on mobile and confirm a 342px full-width block 12px below CTA 01.
8. Save.
9. Reopen the link settings.
10. Confirm the saved destination is exactly `https://wovenself.com/excerpt-unfolding-origami.html`.

## Validation

- [ ] Label matches approved HTML
- [ ] Destination matches approved link map
- [ ] Placement matches assembly sequence
- [ ] Desktop height matches approved preview
- [ ] Mobile behavior matches approved preview
- [ ] Link opens the intended destination
