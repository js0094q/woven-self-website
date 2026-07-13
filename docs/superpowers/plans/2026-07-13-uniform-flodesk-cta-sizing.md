# Uniform Flodesk CTA Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five approved newsletter CTA buttons and their package references uniformly sized without changing labels, destinations, order, colors, copy, or native-button behavior.

**Architecture:** The authoritative HTML owns the 261 x 54 CSS-pixel button geometry. The exporter measures that source at 2x, extracts each 522 x 108 button, centers it on a 1280 x 140 section-colored canvas, and regenerates manifests and proofs. Python validation locks the desktop, mobile, canvas, sequence, and route contracts so the mismatch cannot recur.

**Tech Stack:** Static HTML/CSS, Node.js ES modules, Playwright, Sharp, Python 3 standard-library `unittest`, JSON, PNG artifacts.

## Global Constraints

- Every desktop CTA is exactly 261 x 54 CSS pixels and centered.
- Every mobile CTA is exactly 342 x 54 CSS pixels at the approved 390-pixel viewport with 24-pixel side margins.
- Every CTA reference PNG is exactly 1280 x 140 pixels.
- Every reference contains a centered 522 x 108 button at x=379 and y=16.
- CTA 01, 02, 04, and 05 reference canvases use `#F7EFE4`; CTA 03 uses `#F3E7D4`.
- The purchase group remains Amazon first with 12 pixels of mobile separation.
- Preserve all five labels, destinations, sequence positions, colors, typography, copy, and native Flodesk button implementation.
- Do not stage or modify the unrelated `author.html` or `styles.css` working-tree changes.
- Do not edit Flodesk, send email, schedule email, deploy, or push to `main`.

---

## File Structure

### Source and generation

- `newsletter/book-launch/launch-newsletter-preview.html`: authoritative desktop and mobile CTA geometry.
- `newsletter/book-launch/scripts/render_launch_newsletter.mjs`: browser audit and approved desktop/mobile preview generation.
- `newsletter/book-launch/scripts/export_flodesk_upload_pieces.mjs`: CTA metadata, uniform reference-canvas construction, proofs, and manifest generation.

### Validation

- `newsletter/book-launch/scripts/validate_flodesk_package.py`: exact uniform-sizing and canvas contract.
- `newsletter/book-launch/scripts/test_validate_flodesk_ctas.py`: focused positive and mutation tests.
- `newsletter/book-launch/scripts/test_validate_flodesk_package.py`: full package regression tests; no new abstraction is needed.

### Assembly documentation

- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/00-CTA-OVERVIEW.md`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/01-buy-the-book-on-amazon.md`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/02-read-an-excerpt.md`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/03-buy-the-memoir-now.md`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/04-buy-on-amazon.md`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/05-order-your-signed-copy.md`
- `newsletter/book-launch/flodesk-upload-package/01-ASSEMBLY-CHECKLIST.md`
- `newsletter/book-launch/flodesk-upload-package/02-FLODESK-BLOCK-MAP.md`
- `newsletter/book-launch/flodesk-upload-package/03-LINKS-AND-BUTTONS.md`
- `newsletter/book-launch/flodesk-upload-package/05-IMAGE-INVENTORY.md`
- `newsletter/book-launch/flodesk-upload-package/06-FINAL-QA-CHECKLIST.md`
- `newsletter/book-launch/flodesk-upload-package/07-UPLOAD-SEQUENCE.md`

### Generated deliverables

- `newsletter/book-launch/previews/launch-newsletter-desktop.png`
- `newsletter/book-launch/previews/launch-newsletter-mobile.png`
- `newsletter/book-launch/flodesk-upload-package/package-manifest.json`
- `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/cta-manifest.json`
- all six PNGs under `newsletter/book-launch/flodesk-upload-package/native-elements/ctas/references/`
- `newsletter/book-launch/flodesk-upload-package/reference/approved-desktop-preview.png`
- `newsletter/book-launch/flodesk-upload-package/reference/approved-mobile-preview.png`
- `newsletter/book-launch/flodesk-upload-package/reference/reassembled-upload-pieces-proof.png`
- `newsletter/book-launch/flodesk-upload-package/reference/reassembled-upload-pieces-mobile-proof.png`
- `newsletter/book-launch/flodesk-upload-package/reference/reassembly-comparison.json`

---

### Task 1: Lock And Implement The Uniform Geometry Pipeline

**Files:**
- Modify: `newsletter/book-launch/scripts/test_validate_flodesk_ctas.py:14-87,295-350,536-558`
- Modify: `newsletter/book-launch/scripts/validate_flodesk_package.py:90-139,783-958`
- Modify: `newsletter/book-launch/launch-newsletter-preview.html:50-55,168-178,235-237,287-293`
- Modify: `newsletter/book-launch/scripts/render_launch_newsletter.mjs:200-253,259-297`
- Modify: `newsletter/book-launch/scripts/export_flodesk_upload_pieces.mjs:1-307,598-647,751-832,950-1282`
- Regenerate: files listed under `Generated deliverables`

**Interfaces:**
- Consumes: five `.email-shell a.button-link` elements in authoritative top-to-bottom order.
- Produces: `CTA_DEFINITIONS` entries with `desktop.width_target_px === 261`, `mobile.width_target_px_at_390 === 342`, `reference_dimensions === "1280x140"`, a 522 x 108 `reference_source_region`, and an exact `reference_canvas` contract.
- Produces: `validate_package(package_dir) -> list[str]` failures for any geometry mismatch.

- [ ] **Step 1: Write focused tests that expose the current mismatch**

Add standard-library PNG fixture support and exact sizing constants near `CTA_DATA`:

```python
import struct
import zlib

CTA_DESKTOP_SIZE = (261, 54)
CTA_MOBILE_SIZE = (342, 54)
CTA_REFERENCE_SIZE = (1280, 140)
CTA_REFERENCE_BUTTON_REGION = {
    "left": 379,
    "top": 16,
    "width": 522,
    "height": 108,
}

def write_solid_png(path: Path, width: int, height: int) -> None:
    def chunk(kind: bytes, payload: bytes) -> bytes:
        checksum = zlib.crc32(kind + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", checksum)

    rows = b"".join(b"\x00" + bytes((247, 239, 228)) * width for _ in range(height))
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows, 9))
        + chunk(b"IEND", b"")
    )
```

Replace every `desktop_width` value in `CTA_DATA` with `"261px fixed target"`. Add these positive checks:

```python
def test_all_cta_manifest_geometry_is_uniform(self):
    manifest = self.read_json(
        PACKAGE_DIR / "native-elements/ctas/cta-manifest.json"
    )
    for cta in manifest["ctas"]:
        with self.subTest(cta=cta["id"]):
            self.assertEqual(
                (cta["desktop"]["width_target_px"], cta["desktop"]["height_target_px"]),
                CTA_DESKTOP_SIZE,
            )
            self.assertEqual(
                (
                    cta["mobile"]["width_target_px_at_390"],
                    cta["mobile"]["source_measured_height_px_at_390"],
                ),
                CTA_MOBILE_SIZE,
            )

def test_cta_reference_images_use_uniform_production_canvas(self):
    manifest = self.read_json(
        PACKAGE_DIR / "native-elements/ctas/cta-manifest.json"
    )
    for cta in manifest["ctas"]:
        with self.subTest(cta=cta["id"]):
            reference = PACKAGE_DIR / cta["reference_image"]
            width, height, _transparent = validator.inspect_png(reference)
            self.assertEqual((width, height), CTA_REFERENCE_SIZE)
            self.assertEqual(cta["reference_dimensions"], "1280x140")
            self.assertEqual(
                cta["reference_canvas"]["button_region"],
                CTA_REFERENCE_BUTTON_REGION,
            )
            self.assertEqual(
                (
                    cta["reference_source_region"]["width"],
                    cta["reference_source_region"]["height"],
                ),
                (522, 108),
            )
```

Add mutation tests for width, mobile width, and an extended reference image:

```python
def test_cta_desktop_width_must_be_261_pixels(self):
    temporary, package = self.copy_package()
    self.addCleanup(temporary.cleanup)
    self.mutate_cta_manifest(
        package,
        lambda value: value["ctas"][0]["desktop"].update(width_target_px=260),
    )
    self.assert_has_failure(
        package,
        "CTA `Buy the Book on Amazon` desktop width must be 261px.",
    )

def test_cta_mobile_width_must_be_342_pixels(self):
    temporary, package = self.copy_package()
    self.addCleanup(temporary.cleanup)
    self.mutate_cta_manifest(
        package,
        lambda value: value["ctas"][2]["mobile"].update(width_target_px_at_390=341),
    )
    self.assert_has_failure(
        package,
        "CTA `Buy the Memoir Now` mobile width must be 342px at 390px.",
    )

def test_cta_reference_height_extension_is_rejected(self):
    temporary, package = self.copy_package()
    self.addCleanup(temporary.cleanup)
    reference = package / "native-elements/ctas/references/04-buy-on-amazon-reference.png"
    write_solid_png(reference, 1280, 141)
    self.assert_has_failure(
        package,
        "CTA reference must be exactly 1280x140: "
        "native-elements/ctas/references/04-buy-on-amazon-reference.png",
    )
```

Remove the obsolete assertion that the complete reference dimensions must equal `reference_source_region`; the new canvas intentionally surrounds the exact button crop.

- [ ] **Step 2: Run the focused tests and confirm the current package fails for the intended reason**

Run:

```bash
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_ctas.py -v
```

Expected: FAIL because the current manifest contains 249, 181, 214, and null desktop widths and the existing references are 1280x132, 1280x128, 1280x176, 566x140, and 566x140.

- [ ] **Step 3: Enforce the geometry contract in the package validator**

Add constants next to `EXPECTED_CTAS`:

```python
CTA_DESKTOP_WIDTH_PX = 261
CTA_HEIGHT_PX = 54
CTA_MOBILE_WIDTH_PX = 342
CTA_REFERENCE_SIZE = (1280, 140)
CTA_REFERENCE_BUTTON_REGION = {
    "left": 379,
    "top": 16,
    "width": 522,
    "height": 108,
}
CTA_REFERENCE_BACKGROUNDS = {
    "cta-01": "#F7EFE4",
    "cta-02": "#F7EFE4",
    "cta-03": "#F3E7D4",
    "cta-04": "#F7EFE4",
    "cta-05": "#F7EFE4",
}
```

Inside the single-match CTA-manifest branch in `validate_ctas`, validate the two geometry objects:

```python
def validate_cta_geometry(
    item: dict[str, Any], label: str, failures: list[str]
) -> None:
    desktop = item.get("desktop") if isinstance(item.get("desktop"), dict) else {}
    mobile = item.get("mobile") if isinstance(item.get("mobile"), dict) else {}
    if (
        desktop.get("width_target_px") != CTA_DESKTOP_WIDTH_PX
        or desktop.get("source_measured_width_px") != CTA_DESKTOP_WIDTH_PX
    ):
        failures.append(f"CTA `{label}` desktop width must be 261px.")
    if (
        desktop.get("height_target_px") != CTA_HEIGHT_PX
        or desktop.get("source_measured_height_px") != CTA_HEIGHT_PX
    ):
        failures.append(f"CTA `{label}` desktop height must be 54px.")
    if (
        mobile.get("width_target_px_at_390") != CTA_MOBILE_WIDTH_PX
        or mobile.get("source_measured_width_px_at_390") != CTA_MOBILE_WIDTH_PX
    ):
        failures.append(f"CTA `{label}` mobile width must be 342px at 390px.")
    if mobile.get("source_measured_height_px_at_390") != CTA_HEIGHT_PX:
        failures.append(f"CTA `{label}` mobile height must be 54px at 390px.")

validate_cta_geometry(item, label, failures)
```

Call `validate_cta_geometry(main_item, label, failures)` in the matching main-manifest branch so neither manifest can drift. Add `- Desktop width target: 261px` to the required CTA-file fragments. Replace the old source-region-equals-file-size assertion with:

```python
if (width, height) != CTA_REFERENCE_SIZE:
    failures.append(f"CTA reference must be exactly 1280x140: {reference}")

canvas = item.get("reference_canvas")
expected_canvas = {
    "width": 1280,
    "height": 140,
    "background_color": CTA_REFERENCE_BACKGROUNDS[identifier],
    "button_region": CTA_REFERENCE_BUTTON_REGION,
}
if canvas != expected_canvas:
    failures.append(f"CTA `{label}` reference canvas contract is invalid.")

source_region = item.get("reference_source_region")
if not isinstance(source_region, dict) or (
    source_region.get("width"), source_region.get("height")
) != (522, 108):
    failures.append(f"CTA `{label}` reference source button must be 522x108.")
```

Keep existing hash, route, order, sequence, and native-button validation intact.

- [ ] **Step 4: Make the authoritative HTML geometry explicit**

Change the shared rule to:

```css
.button-link {
  box-sizing: border-box;
  display: inline-block;
  height: 54px;
  min-height: 54px;
  text-decoration: none;
  width: 261px;
}
```

Normalize each of the five CTA inline style attributes so `height:54px; min-height:54px; width:261px;` appears exactly once. Retain the existing mobile rule:

```css
.hero-action,
.mobile-button {
  display: block !important;
  width: 100% !important;
}
```

Do not change the anchor text, `href`, padding, colors, borders, radius, type, section padding, or table order.

- [ ] **Step 5: Extend the preview audit to all five CTAs**

In `auditPage`, measure every `.button-link` and return:

```javascript
const ctaButtons = [...document.querySelectorAll("a.button-link")];
const ctaRects = ctaButtons.map((button) => button.getBoundingClientRect());

// Add to the returned audit object.
ctaButtonWidths: ctaRects.map((rect) => rect.width),
ctaButtonHeights: ctaRects.map((rect) => rect.height),
```

In `validateAudit`, add:

```javascript
requireCheck(audit.ctaButtonWidths.length === 5, "expected five CTA buttons");
requireCheck(
  audit.ctaButtonHeights.every((height) => Math.abs(height - 54) <= 0.5),
  `CTA heights=${audit.ctaButtonHeights.join(",")}`,
);
if (audit.viewport === "desktop") {
  requireCheck(
    audit.ctaButtonWidths.every((width) => Math.abs(width - 261) <= 0.5),
    `desktop CTA widths=${audit.ctaButtonWidths.join(",")}`,
  );
}
if (audit.viewport === "mobile") {
  requireCheck(
    audit.ctaButtonWidths.every((width) => Math.abs(width - 342) <= 0.5),
    `mobile CTA widths=${audit.ctaButtonWidths.join(",")}`,
  );
}
```

Keep the purchase-group Amazon-first, stacked, full-width, and 12-pixel separation checks.

- [ ] **Step 6: Replace mixed CTA crops with one uniform exporter path**

Add `copyFileSync` to the `node:fs` imports and define:

```javascript
const CTA_DESKTOP_WIDTH = 261;
const CTA_HEIGHT = 54;
const CTA_REFERENCE_CANVAS = {
  width: 1280,
  height: 140,
  button: { left: 379, top: 16, width: 522, height: 108 },
};
```

Set every `CTA_DEFINITIONS[*].desktop.width_target_px` to `CTA_DESKTOP_WIDTH`, every height target to `CTA_HEIGHT`, and add `reference_background_color` using the five approved colors. For CTA 04 and CTA 05, use the explicit desktop description `fixed 261px target; side by side in 536px row with 14px gap` while retaining their 18-pixel horizontal padding and purchase-group metadata.

Replace the conditional crop logic in `createCtaReferences` with:

```javascript
const region = {
  left: Math.round(measured.rect.left * 2),
  top: Math.round(measured.rect.top * 2),
  width: CTA_REFERENCE_CANVAS.button.width,
  height: CTA_REFERENCE_CANVAS.button.height,
};
const buttonBuffer = await sharp(master)
  .extract(region)
  .toColourspace("srgb")
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
const buffer = await sharp({
  create: {
    width: CTA_REFERENCE_CANVAS.width,
    height: CTA_REFERENCE_CANVAS.height,
    channels: 3,
    background: definition.reference_background_color,
  },
})
  .composite([{
    input: buttonBuffer,
    left: CTA_REFERENCE_CANVAS.button.left,
    top: CTA_REFERENCE_CANVAS.button.top,
  }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
```

Change the helper signature to `async function createCtaReferences(sharp, master, desktopCtas)` and call it as `await createCtaReferences(sharp, master, desktopCtas)`. Remove the now-unused `masterMetadata` and `ranges` parameters.

Exclude the exporter-only color field when creating public entries:

```javascript
const {
  source_index: sourceIndex,
  proof_range: proofRange,
  reference_background_color: referenceBackgroundColor,
  ...publicDefinition
} = definition;
```

Store this exact manifest object for every CTA:

```javascript
reference_canvas: {
  width: CTA_REFERENCE_CANVAS.width,
  height: CTA_REFERENCE_CANVAS.height,
  background_color: referenceBackgroundColor,
  button_region: CTA_REFERENCE_CANVAS.button,
},
```

Copy the freshly rendered desktop and mobile previews before manifest hashing:

```javascript
copyFileSync(
  approvedDesktopPreview,
  path.join(referenceDirectory, "approved-desktop-preview.png"),
);
copyFileSync(
  approvedMobilePreview,
  path.join(referenceDirectory, "approved-mobile-preview.png"),
);
```

Remove `reference_background_color` from the public CTA entry after using it to build `reference_canvas`.

- [ ] **Step 7: Render the authoritative previews and regenerate the package**

Run:

```bash
node newsletter/book-launch/scripts/render_launch_newsletter.mjs
node newsletter/book-launch/scripts/export_flodesk_upload_pieces.mjs
```

Expected: one audit line beginning `RENDER desktop`, one beginning `RENDER mobile`, followed by `RENDER PASS`, `EXPORT PASS pieces=20 master=1280x10072`, and a `PROOF PASS pixelEqual=true` line naming the proof path.

The five CTA reference images must all be 1280 x 140, and their manifest source button regions must all be 522 x 108.

- [ ] **Step 8: Run the focused CTA tests until green**

Run:

```bash
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_ctas.py -v
```

Expected: all tests PASS, including the three new mutation failures.

- [ ] **Step 9: Review and commit the core sizing pipeline**

Run:

```bash
git diff --check
git status --short --untracked-files=all
git diff -- newsletter/book-launch/launch-newsletter-preview.html newsletter/book-launch/scripts/render_launch_newsletter.mjs newsletter/book-launch/scripts/export_flodesk_upload_pieces.mjs newsletter/book-launch/scripts/validate_flodesk_package.py newsletter/book-launch/scripts/test_validate_flodesk_ctas.py
```

Verify `author.html` and `styles.css` remain unstaged. Stage only the source, tests, validator, generated previews, generated manifests, CTA references, and generated proof files changed by this task, then commit:

```bash
git commit -m "Make Flodesk CTA sizing uniform"
```

---

### Task 2: Synchronize Every Assembly Instruction With The Production Size

**Files:**
- Modify: all documentation paths listed under `Assembly documentation`
- Modify: `newsletter/book-launch/scripts/test_validate_flodesk_ctas.py`

**Interfaces:**
- Consumes: the exact 261 x 54 desktop and 342 x 54 mobile geometry from Task 1.
- Produces: one consistent native Flodesk assembly contract with no obsolete 249, 181, 214, null-width, half-row-only, or exact-source-crop claims.

- [ ] **Step 1: Add documentation regression assertions**

Add:

```python
def test_package_docs_use_uniform_cta_sizing(self):
    required_docs = (
        "01-ASSEMBLY-CHECKLIST.md",
        "02-FLODESK-BLOCK-MAP.md",
        "03-LINKS-AND-BUTTONS.md",
        "07-UPLOAD-SEQUENCE.md",
        "native-elements/ctas/00-CTA-OVERVIEW.md",
        *(f"native-elements/ctas/{cta['filename']}" for cta in CTA_DATA),
    )
    obsolete = ("249px", "181px", "214px")
    for relative in required_docs:
        with self.subTest(path=relative):
            text = (PACKAGE_DIR / relative).read_text(encoding="utf-8")
            offenders = [value for value in obsolete if value in text]
            self.assertEqual(offenders, [], f"obsolete widths in {relative}: {offenders}")
            if relative.endswith(".md") and "CTA" in text:
                self.assertIn("261px", text)

def test_reference_docs_name_the_uniform_canvas(self):
    for relative in (
        "native-elements/ctas/00-CTA-OVERVIEW.md",
        "05-IMAGE-INVENTORY.md",
        "06-FINAL-QA-CHECKLIST.md",
    ):
        text = (PACKAGE_DIR / relative).read_text(encoding="utf-8")
        self.assertIn("1280 × 140", text, relative)
        self.assertNotIn("unannotated exact source crop", text, relative)
```

Implement the obsolete-width assertion without checking an empty string: collect offenders with a list comprehension and assert the list is empty.

- [ ] **Step 2: Run the documentation tests and confirm they fail on old dimensions**

Run:

```bash
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_ctas.py -v
```

Expected: FAIL naming the existing 249px, 181px, or 214px documentation.

- [ ] **Step 3: Update each CTA assembly file explicitly**

For CTA 01, CTA 02, and CTA 03, use these exact geometry lines while retaining each file's existing label, destination, colors, padding, and section spacing:

```markdown
- Desktop position: Centered; fixed 261px target width inside the 640px email shell
- Width behavior: Fixed 261px target on desktop; full width inside 24px mobile side margins
- Desktop width target: 261px
- Desktop height target: 54px
```

Their desktop preview steps must say `confirm a centered 261px target width and 54px height`, with CTA 03 continuing to name its 8px space above and 26px space below.

For CTA 04 and CTA 05, use:

```markdown
- Desktop position: Centered 261px target in the approved purchase row
- Width behavior: Fixed 261px target on desktop; full width inside 24px mobile side margins
- Desktop width target: 261px
- Desktop height target: 54px
- Desktop group placement: Two 261px buttons side by side in the 536px purchase row with a 14px gap
```

CTA 04's desktop preview step must identify it as the first 261px button; CTA 05's must identify it as the second. Keep every label, destination, padding, background, border, spacing, preceding element, and following element explicit instead of using vague shared-setting instructions.

- [ ] **Step 4: Synchronize the package-wide assembly guides**

Apply these exact contracts:

```markdown
Desktop CTA size: 261px wide × 54px high for all five buttons.
Mobile CTA size: 342px wide × 54px high at the approved 390px viewport.
Reference canvas: 1280 × 140 pixels with a centered 522 × 108 button.
```

Update:

- `00-CTA-OVERVIEW.md`: state that all five buttons share the uniform desktop/mobile size and all references use the uniform canvas; keep the purchase-group Amazon-first/12px rule scoped to CTA 04 and CTA 05.
- `01-ASSEMBLY-CHECKLIST.md`: replace the three old fixed widths and both half-row-only checks with a 261px width check; retain the purchase-group 14px desktop gap.
- `02-FLODESK-BLOCK-MAP.md`: give every CTA `261px desktop target; 54px high`; describe CTA 04 and CTA 05 as 261px buttons in the 536px row with a 14px gap.
- `03-LINKS-AND-BUTTONS.md`: use `261px target` in all five specification rows and all five entry procedures.
- `05-IMAGE-INVENTORY.md`: describe each reference as a footer-free 1280 x 140 production canvas containing a centered source-rendered button, not an exact full-row source crop.
- `06-FINAL-QA-CHECKLIST.md`: require all five references to be 1280 x 140 and all five desktop buttons to be 261 x 54.
- `07-UPLOAD-SEQUENCE.md`: require a centered 261 x 54 desktop button in Steps 05, 06, 16, 22, and 23; retain purchase placement and mobile order.

Do not change the 28-position sequence or any URL.

- [ ] **Step 5: Run focused tests and scan for stale sizing language**

Run:

```bash
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_ctas.py -v
rg -n "249px|181px|214px|566x140|1280x132|1280x128|1280x176|unannotated exact source crop" newsletter/book-launch/flodesk-upload-package
```

Expected: tests PASS and `rg` returns no matches.

- [ ] **Step 6: Commit the synchronized assembly documentation**

Run `git diff --check`, inspect the documentation diff, stage only the documentation and its focused test, verify `author.html` and `styles.css` are unstaged, and commit:

```bash
git commit -m "Synchronize Flodesk CTA assembly sizing"
```

---

### Task 3: Verify The Complete Package, Push The Current Branch, And Record The Result

**Files:**
- Verify: all Task 1 and Task 2 files
- Do not modify: `author.html`, `styles.css`

**Interfaces:**
- Consumes: regenerated package and synchronized documentation.
- Produces: evidence that all five CTA assets, both proofs, both manifests, validators, and sequence contracts are production-ready, plus an updated Basic Memory Cloud handoff note.

- [ ] **Step 1: Run the complete local validation suite**

Run:

```bash
python3 newsletter/book-launch/scripts/validate_launch_newsletter.py
python3 newsletter/book-launch/scripts/validate_flodesk_package.py
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_ctas.py -v
python3 -m unittest newsletter/book-launch/scripts/test_validate_flodesk_package.py -v
python3 -m json.tool newsletter/book-launch/flodesk-upload-package/package-manifest.json >/dev/null
python3 -m json.tool newsletter/book-launch/flodesk-upload-package/native-elements/ctas/cta-manifest.json >/dev/null
git diff --check
```

Expected: both validators PASS, both test files PASS, both JSON parses return zero, and `git diff --check` returns no output.

- [ ] **Step 2: Run exact label, destination, and sequence checks**

Run:

```bash
rg -n "Buy the Book on Amazon|Read an Excerpt|Buy the Memoir Now|Buy on Amazon|Order Your Signed Copy" newsletter/book-launch/launch-newsletter-preview.html newsletter/book-launch/flodesk-upload-package/07-UPLOAD-SEQUENCE.md newsletter/book-launch/flodesk-upload-package/package-manifest.json newsletter/book-launch/flodesk-upload-package/native-elements/ctas/cta-manifest.json
```

Use a short Python read-only check to assert:

```python
assert [cta["label"] for cta in cta_manifest["ctas"]] == [
    "Buy the Book on Amazon",
    "Read an Excerpt",
    "Buy the Memoir Now",
    "Buy on Amazon",
    "Order Your Signed Copy",
]
assert [cta["sequence_position"] for cta in cta_manifest["ctas"]] == [5, 6, 16, 22, 23]
assert len({cta["id"] for cta in cta_manifest["ctas"]}) == 5
assert all(cta["reference_dimensions"] == "1280x140" for cta in cta_manifest["ctas"])
```

- [ ] **Step 3: Inspect every CTA reference and proof visually**

Open all five CTA reference PNGs and `all-ctas-contact-sheet.png` with `view_image`. Confirm:

- each button occupies the same 522 x 108 footprint;
- each button is centered on the 1280 x 140 canvas;
- primary and secondary colors are unchanged;
- all labels are exact and unclipped;
- no footer, annotation, watermark, or instruction text is present.

Open both reassembled proofs with `view_image`. Confirm all five labels appear in order, desktop buttons are uniformly 261 x 54, mobile buttons are uniformly 342 x 54, and the purchase pair is Amazon first with 12 pixels between buttons.

- [ ] **Step 4: Test approved destinations where network access permits**

Send non-mutating HEAD or redirected GET checks to the exact Amazon, excerpt, and Stripe URLs. Record each as reachable, redirected-but-reachable, or unverified. Do not claim PASS for a destination that could not be checked.

- [ ] **Step 5: Inspect the final branch state and push**

Run:

```bash
git status --short --untracked-files=all
git log -3 --oneline
git diff --check
```

Confirm the only remaining uncommitted files are the pre-existing `author.html` and `styles.css` changes. Push the current branch without force:

```bash
git push origin integration/flodesk-and-campaign-reconciliation
```

Verify the remote branch resolves to the local `HEAD`. Do not merge or deploy unless separately authorized after this package correction.

- [ ] **Step 6: Append the verified result to Basic Memory Cloud**

Read the existing note before editing:

- Project ID: `992e1dae-9301-4c63-87cd-ca783812bf9b`
- Identifier: `js-workspace/main/projects/woven-self/newsletter/flodesk-upload-package-paused-implementation-context`

Use the Basic Memory Cloud `edit_note` operation `append`. Add a dated `Uniform CTA sizing correction` section containing these exact facts:

- every desktop CTA is 261 x 54 pixels;
- every mobile CTA is 342 x 54 pixels at the 390-pixel viewport;
- all five CTA reference canvases are 1280 x 140 pixels with centered 522 x 108 buttons;
- the Amazon-first 12-pixel purchase-group mobile spacing remains intact;
- labels, destinations, copy, order, and native Flodesk implementation were unchanged;
- both validators, focused CTA tests, package tests, JSON parsing, image inspection, proof review, and `git diff --check` passed;
- the branch is `integration/flodesk-and-campaign-reconciliation` and the final commit is the literal SHA returned by `git rev-parse HEAD`;
- no deployment or Flodesk send occurred.

Read the note again and confirm the appended section and SHA are present. Repository files remain the source of truth.
