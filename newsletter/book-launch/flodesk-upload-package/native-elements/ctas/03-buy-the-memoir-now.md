# CTA 03 — Buy the Memoir Now

## Assembly position

16 in the complete 28-position upload/native-element sequence.

## Placement

- Previous element: `upload-pieces/13-inside-unfolding-origami.png`
- Next element: `upload-pieces/14-butterfly-separator-04.png`
- Newsletter section: Inside Unfolding Origami
- Desktop position: Centered; fixed 261px target width inside the 640px email shell
- Mobile position: Standalone full-width CTA; 342px at the approved 390px viewport with 24px side margins

## Flodesk block

- Block type: Button
- Label: `Buy the Memoir Now`
- Destination: `https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28`
- Alignment: Center
- Width behavior: Fixed 261px target on desktop; full width inside 24px mobile side margins
- Desktop width target: 261px
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
- Space above: 8px
- Space below: 26px before upload piece 14

## Mobile behavior

- Full width: Yes
- Stacking order: Standalone CTA in this section
- Gap from adjacent button: No adjacent button; keep 8px above and 26px below
- Required order relative to other CTAs: After CTA 02 in newsletter order and before CTA 04; between upload pieces 13 and 14

## Build instructions

1. Add a Flodesk button block.
2. Enter the exact label `Buy the Memoir Now`.
3. Paste the exact Amazon destination above.
4. Apply every color, border, radius, type, padding, width, height, alignment, and spacing value above.
5. Position the block after `upload-pieces/13-inside-unfolding-origami.png`.
6. Preview on desktop and confirm a centered 261px target width and 54px height, with 8px space above and 26px space below.
7. Preview on mobile and confirm a 342px full-width standalone block.
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
