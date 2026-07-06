# KDP Paperback Cover QA Report - Updated Synopsis

## Verdict

FAIL - Requires correction before KDP upload

## Files Reviewed

| File | Purpose |
|---|---|
| `design/book-cover-unfolding-origami/indesign-handoff/reference/Unfolding Origami - Updated Synopsis.indd` | Updated InDesign source |
| `/Users/josephstewart/Downloads/3e5e3958-a82f-4092-9143-181b6e81ff75.pdf` | Current/reference exported PDF |
| `exports/kdp-paperback-cover-updated-synopsis-qa.pdf` | Fresh QA export from InDesign before repair |
| `exports/qa/cover-visual-diff.png` | Visual diff proof |

## Executive Summary

- The updated approved synopsis was present in the InDesign export and the old reference synopsis was not present.
- The front-cover `A Memoir` subtitle was centered under the title line in the InDesign export.
- The back-cover synopsis background blended with the cover artwork, with no visible square patch.
- The cover exported as one full-wrap PDF at `866.16 x 630 pt`, matching the KDP wrap size.
- The initial QA export failed because the barcode/ISBN box exported as a blank white rectangle.

## Checklist Results

## Full Cover Mechanics

| Check | Status | Notes |
|---|---:|---|
| Single full-wrap PDF | PASS | One-page full wrap exported from InDesign. |
| Dimensions match prior KDP template | PASS | `866.16 x 630 pt`, matching the supplied reference PDF and existing verified cover exports. |
| Bleed preserved | PASS | Full page size includes the KDP bleed dimensions for the wrap. |
| Background reaches bleed | PASS | Background extends to all edges. |
| No unintended white/crop edges | PASS | No edge crop artifacts observed. |

## Front Cover QA

| Element | Status | Notes |
|---|---:|---|
| Title alignment | PASS | Title remains centered in the front panel. |
| "A Memoir" centered | PASS | Subtitle visually centered under `ORIGAMI`. |
| "A Memoir" not duplicated | PASS | No front-cover duplicate observed. |
| Sarah quote readable and unchanged | PASS | Quote is readable and remains above the title. |
| Author name aligned safely | PASS | Author name remains inside the front panel and clear of trim. |
| Artwork unchanged | PASS | Butterfly/origami art remains in the approved composition. |
| No overlap/clipping | PASS | No front-cover clipping or collisions observed. |

## Spine QA

| Element | Status | Notes |
|---|---:|---|
| Spine centered | PASS | Spine remains centered between panels. |
| Spine title aligned | PASS | Vertical title remains readable. |
| Spine subtitle aligned | PASS | Spine subtitle remains in place. |
| Spine author aligned | PASS | Spine author line remains readable. |
| TSPA spine logo aligned | PASS | TSPA mark remains near the bottom. |
| No spillover into front/back panels | PASS | No spine content crosses panel boundaries. |

## Back Cover Synopsis QA

| Check | Status | Notes |
|---|---:|---|
| Synopsis matches approved copy | PASS | Approved July 2026 synopsis phrases are present; older reference synopsis is absent. |
| No missing/extra text | PASS | No missing approved text detected in PDF text extraction. |
| No overset text | PASS | InDesign scripted text overflow check passed. |
| Text readable | PASS | Synopsis is readable at 300 DPI proof scale. |
| Text frame aligned | PASS | Synopsis remains centered in the existing back-cover composition. |
| Background blends seamlessly | PASS | No square patch visible behind text. |
| No square patch/mismatched background | PASS | Background blends with surrounding back cover. |
| No collision with barcode/connect/credits | PASS | Synopsis does not collide with lower cover elements. |

## Back Cover Praise QA

| Element | Status | Notes |
|---|---:|---|
| Lucy quote unchanged | PASS | Quote text remains in place. |
| Lucy attribution unchanged | PASS | Attribution remains readable. |
| Quote block aligned | PASS | Quote block remains centered near top. |
| Divider line aligned | PASS | Divider remains centered above synopsis. |
| No collision with synopsis | PASS | Adequate spacing remains. |

## Barcode, ISBN, Price, Logo QA

| Element | Status | Notes |
|---|---:|---|
| Barcode inside safe area | FAIL | Barcode box exported blank in the initial QA PDF. |
| Barcode readable/not distorted | FAIL | Missing in the initial QA PDF. |
| ISBN readable | FAIL | Missing in the initial QA PDF. |
| CAD/USD price readable | PASS | Price remains readable and aligned. |
| TSPA logo aligned | PASS | Back-cover and spine TSPA marks remain aligned. |
| Connect block aligned | PASS | Connect block remains readable. |
| Credits readable | PASS | Credits remain readable and aligned. |

## Visual Difference Notes

### Expected Differences

- Back-cover synopsis changed from the supplied reference PDF's older `In this compelling narrative...` synopsis to the current approved `During the first few months...` synopsis.
- Front-cover `A Memoir` is centered under the title line.
- Minor antialiasing/compression differences appear because the QA export was generated from InDesign 21.4 with `Press Quality`.

### Unexpected Differences

- Initial QA export omitted the barcode/ISBN artwork and left a blank white barcode box.

## Required Fixes

1. Back cover: restore the barcode/ISBN artwork into the existing barcode box without moving price, logo, connect block, credits, or surrounding artwork.

## Final Recommendation

- Ready to proceed to final KDP export: NO
- Ready to proceed to paperback-to-ebook conversion: NO

See `exports/kdp-paperback-cover-updated-synopsis-final-qa-report.md` for the repaired final pass.
