# START HERE — Unfolding Origami Launch Newsletter

## Purpose

This folder contains everything needed to rebuild the approved newsletter in Flodesk without opening the HTML source. The build uses 20 numbered image uploads and eight native elements. Start with `07-UPLOAD-SEQUENCE.md` and perform all 28 steps exactly.

## Non-Negotiable Rules

1. Build steps in numerical order.
2. Do not rewrite any text.
3. Do not substitute images.
4. Do not change links.
5. Do not add gaps between consecutive image blocks.
6. Save after every completed step.
7. Compare the result against both approved previews before a test email.
8. Do not use the contact sheet as an upload asset.
9. Do not upload files from the legacy `assets/` folders; upload only from `upload-pieces/`.
10. Build every CTA from `native-elements/ctas/`; its PNGs are reference-only and are never clickable upload pieces.

## Exact Workflow

1. Open Flodesk.
2. Create a blank email, or duplicate the blank book-newsletter template if it contains no extra promotional blocks.
3. Set content width to 640px or the nearest available control; set outer background to `#07101F`.
4. Complete Step 01 — upload piece 01. Save.
5. Complete Step 02 — upload piece 02. Save.
6. Complete Step 03 — upload piece 03. Save.
7. Complete Step 04 — upload piece 04. Save.
8. Complete Step 05 — native Amazon button. Save.
9. Complete Step 06 — native excerpt button. Save.
10. Complete Step 07 — upload piece 05. Save.
11. Complete Step 08 — upload piece 06. Save.
12. Complete Step 09 — upload piece 07. Save.
13. Complete Step 10 — upload piece 08. Save.
14. Complete Step 11 — upload piece 09. Save.
15. Complete Step 12 — upload piece 10. Save.
16. Complete Step 13 — upload piece 11. Save.
17. Complete Step 14 — upload piece 12. Save.
18. Complete Step 15 — upload piece 13. Save.
19. Complete Step 16 — native memoir button. Save.
20. Complete Step 17 — upload piece 14. Save.
21. Complete Step 18 — upload piece 15. Save.
22. Complete Step 19 — native Sarah Edmondson attribution. Save.
23. Complete Step 20 — upload piece 16. Save.
24. Complete Step 21 — upload piece 17. Save.
25. Complete Step 22 — native Amazon purchase button. Save.
26. Complete Step 23 — native signed-copy button. Save.
27. Complete Step 24 — upload piece 18. Save.
28. Complete Step 25 — upload piece 19. Save.
29. Complete Step 26 — upload piece 20. Save.
30. Complete Step 27 — native author links and copyright. Save.
31. Complete Step 28 — native Flodesk compliance footer. Save.
32. Enter and re-open every clickable destination documented as Link 01 through Link 13 in `03-LINKS-AND-BUTTONS.md`.
33. Compare the complete desktop build with `reference/approved-desktop-preview.png`.
34. Compare the complete mobile build with `reference/approved-mobile-preview.png`; specifically review text size in rasterized copy pieces.
35. Send an internal test email only to the designated internal test recipient.
36. Complete every item in `06-FINAL-QA-CHECKLIST.md`.
37. Stop before scheduling or sending the campaign.

## File Guide

- `00-START-HERE.md`: rules, workflow, and stop point.
- `01-ASSEMBLY-CHECKLIST.md`: checkbox version of all 28 steps.
- `02-FLODESK-BLOCK-MAP.md`: block type, source, layout, alignment, styling, and spacing for every upload/native boundary.
- `03-LINKS-AND-BUTTONS.md`: all fixed URLs and native compliance-link instructions.
- `04-COPY-PASTE-TEXT.md`: only approved source for native text and copy verification.
- `05-IMAGE-INVENTORY.md`: dimensions, file sizes, alt text, hashes, and placement for all 20 PNGs.
- `06-FINAL-QA-CHECKLIST.md`: required pre-send checks.
- `07-UPLOAD-SEQUENCE.md`: literal one-page assembly sequence.
- `native-elements/ctas/`: five complete native-button build files, CTA overview, CTA manifest, and reference-only proofs.
- `upload-pieces/`: the only newsletter image files to upload.
- `reference/upload-pieces-contact-sheet.png`: order verification only; never upload it.
- `reference/reassembled-upload-pieces-proof.png`: desktop stacked proof with native source intervals.
- `reference/reassembled-upload-pieces-mobile-proof.png`: mobile scaling review proof.
- `native-elements/ctas/references/all-ctas-contact-sheet.png`: all five native CTA appearances in approved order; reference only.
- `package-manifest.json`: machine-readable inventory and assembly order.

## Mobile Review Gate

The pieces are exact 2× exports of the approved 640px desktop content area. Flodesk must scale them responsively. Because text inside images scales with the image, the actual Flodesk mobile test must be reviewed against `reference/approved-mobile-preview.png` before sending. If text is materially too small, stop for approval; do not silently rebuild or rewrite the newsletter.

## Completion Rule

Do not schedule or send the newsletter unless every applicable item in `06-FINAL-QA-CHECKLIST.md` is checked and the mobile review gate is approved.
