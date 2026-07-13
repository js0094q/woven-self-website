# Flodesk Upload Package — Current Context

## Status

This package now uses the required literal hybrid upload model. The earlier package documented 24 sections but supplied only seven source-era image files, leaving most of the newsletter for manual recreation. That model is superseded.

The current package contains 20 actual sequential PNG uploads in `upload-pieces/` and eight native assembly elements. Manual Flodesk construction is limited to five clickable buttons, the linked Sarah Edmondson attribution, the linked author/footer text block, and Flodesk's legal compliance footer. Each CTA now has a complete native build file, a source-derived reference PNG, and a validated manifest entry under `native-elements/ctas/`.

## Approved source contract

- Approved copy, content order, images, URLs, CTA labels, colors, typography intent, spacing intent, hierarchy, butterflies, branding, and legal language were not changed.
- The revised acknowledgment paragraph remains exactly:

  > I wanted to take a moment to acknowledge the women who gave me the strength and support to write this and put it before an editor. Without their gentle encouragement, this book would not be here today.

- Approved rankings remain `#26 in Trauma Psychology eBooks`, `#125 in Trauma Psychology Books`, and `#151 in Survival Biographies`.
- Original approved desktop and mobile preview files remain in place and were copied byte-for-byte to `reference/`.

## Export model

- Source: direct controlled render of `../launch-newsletter-preview.html`.
- Master content width: 1280px, representing the approved 640px email shell at device scale factor 2.
- Upload pieces: 20 PNGs, numbered 01–20 without gaps.
- Assembly sequence: 28 positions, combining 20 image uploads with eight native elements.
- Desktop proof: `reference/reassembled-upload-pieces-proof.png`.
- Contact sheet: `reference/upload-pieces-contact-sheet.png`.
- Mobile review proof: `reference/reassembled-upload-pieces-mobile-proof.png`.
- CTA contact sheet: `native-elements/ctas/references/all-ctas-contact-sheet.png`.
- CTA contract: `native-elements/ctas/cta-manifest.json`.
- Comparison evidence: `reference/reassembly-comparison.json`.

The desktop proof is pixel-identical to the fresh direct master render when the approved native source intervals are inserted between exported pieces.

## Known review item

The PNGs preserve the approved desktop typography exactly. On mobile, text inside a desktop-width raster scales with the image instead of reflowing at the approved live 16px body size. The mobile proof exists to expose this limitation. A real Flodesk mobile test must be reviewed and approved before sending. If the text is materially too small, stop for a separately approved mobile-specific solution; do not alter the approved copy or design during assembly.

## Operational boundary

- Start with `00-START-HERE.md`, then follow `07-UPLOAD-SEQUENCE.md` exactly.
- Do not upload the contact sheet or proof images.
- Do not schedule or send until `06-FINAL-QA-CHECKLIST.md` is complete.
- The signed-copy deadline is July 20, 2026; stop for review if assembling after that date.
- Repository delivery is separate from Flodesk execution and does not authorize a campaign send.
- No Flodesk email was assembled, test-sent, scheduled, or sent while repairing this package.
- No source artwork was replaced and no campaign was deployed or published from Flodesk.
