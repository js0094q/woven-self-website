# CTA 05 — Order Your Signed Copy

## Assembly position

23 in the complete 28-position upload/native-element sequence.

## Placement

- Previous element: CTA 04 — `Buy on Amazon`
- Next element: `upload-pieces/18-signed-copy-deadline.png`
- Newsletter section: Choose Your Copy purchase group
- Desktop position: Centered 261px target in the approved purchase row
- Mobile position: Second purchase CTA; 342px full width at the approved 390px viewport with 24px side margins

## Flodesk block

- Block type: Button
- Label: `Order Your Signed Copy`
- Destination: `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`
- Alignment: Center
- Width behavior: Fixed 261px target on desktop; full width inside 24px mobile side margins
- Desktop width target: 261px
- Desktop height target: 54px
- Desktop group placement: Two 261px buttons side by side in the 536px purchase row with a 14px gap
- Mobile width: 342px at a 390px viewport
- Border radius: 4px
- Background color: `#F7EFE4`
- Text color: `#0D182A`
- Font: Arial, Helvetica, sans-serif
- Font size: 16px
- Font weight: 700
- Letter spacing: Normal, with 0px added tracking
- Horizontal padding: 18px
- Vertical padding: 16px
- Border: 2px solid `#0D182A`
- Line height: 18px
- Space above: 0px on desktop; 12px after CTA 04 on mobile
- Space below: 0px before upload piece 18

## Mobile behavior

- Full width: Yes
- Stacking order: 2 of 2 in the Choose Your Copy purchase group
- Gap from adjacent button: 12px above CTA 05
- Required order relative to other CTAs: Signed-copy Stripe second, immediately after CTA 04 and before upload piece 18

## Build instructions

1. Add a Flodesk button block.
2. Enter the exact label `Order Your Signed Copy`.
3. Paste the exact Stripe destination above.
4. Apply every color, border, radius, type, padding, width, height, alignment, and spacing value above.
5. Position it after CTA 04 and before `upload-pieces/18-signed-copy-deadline.png`.
6. Preview on desktop and confirm the second 261px button in the 536px purchase row, with a 14px group gap and 54px height.
7. Preview on mobile and confirm a 342px full-width button 12px below CTA 04.
8. Save.
9. Reopen the link settings.
10. Confirm the saved destination is exactly `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00`.

## Validation

- [ ] Label matches approved HTML
- [ ] Destination matches approved link map
- [ ] Placement matches assembly sequence
- [ ] Desktop height matches approved preview
- [ ] Mobile behavior matches approved preview
- [ ] Link opens the intended destination
