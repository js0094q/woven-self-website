import json
import shutil
import struct
import sys
import tempfile
import unittest
import zlib
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parent))

import validate_flodesk_package as validator


PACKAGE_DIR = Path(__file__).resolve().parent.parent / "flodesk-upload-package"
AMAZON_URL = (
    "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28"
)
EXCERPT_URL = "https://wovenself.com/excerpt-unfolding-origami.html"
STRIPE_URL = "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00"
SOURCE = "newsletter/book-launch/launch-newsletter-preview.html"
CTA_DESKTOP_SIZE = (261, 54)
CTA_MOBILE_SIZE = (342, 54)
CTA_REFERENCE_SIZE = (1280, 140)
CTA_REFERENCE_BUTTON_REGION = {
    "left": 379,
    "top": 16,
    "width": 522,
    "height": 108,
}
CTA_DATA = (
    {
        "id": "cta-01",
        "label": "Buy the Book on Amazon",
        "destination": AMAZON_URL,
        "position": 5,
        "filename": "01-buy-the-book-on-amazon.md",
        "reference": "01-buy-the-book-on-amazon-reference.png",
        "preceding": "upload-piece-04",
        "following": "cta-02",
        "desktop_width": "261px fixed target",
        "mobile_gap": 12,
        "stack_order": 1,
    },
    {
        "id": "cta-02",
        "label": "Read an Excerpt",
        "destination": EXCERPT_URL,
        "position": 6,
        "filename": "02-read-an-excerpt.md",
        "reference": "02-read-an-excerpt-reference.png",
        "preceding": "cta-01",
        "following": "upload-piece-05",
        "desktop_width": "261px fixed target",
        "mobile_gap": 10,
        "stack_order": 2,
    },
    {
        "id": "cta-03",
        "label": "Buy the Memoir Now",
        "destination": AMAZON_URL,
        "position": 16,
        "filename": "03-buy-the-memoir-now.md",
        "reference": "03-buy-the-memoir-now-reference.png",
        "preceding": "upload-piece-13",
        "following": "upload-piece-14",
        "desktop_width": "261px fixed target",
        "mobile_gap": 0,
        "stack_order": 1,
    },
    {
        "id": "cta-04",
        "label": "Buy on Amazon",
        "destination": AMAZON_URL,
        "position": 22,
        "filename": "04-buy-on-amazon.md",
        "reference": "04-buy-on-amazon-reference.png",
        "preceding": "upload-piece-17",
        "following": "cta-05",
        "desktop_width": "261px fixed target",
        "mobile_gap": 12,
        "stack_order": 1,
    },
    {
        "id": "cta-05",
        "label": "Order Your Signed Copy",
        "destination": STRIPE_URL,
        "position": 23,
        "filename": "05-order-your-signed-copy.md",
        "reference": "05-order-your-signed-copy-reference.png",
        "preceding": "cta-04",
        "following": "upload-piece-18",
        "desktop_width": "261px fixed target",
        "mobile_gap": 0,
        "stack_order": 2,
    },
)


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


def read_png_rgb_rows(path: Path) -> tuple[int, int, list[bytes]]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"not a PNG: {path}")

    offset = 8
    width = height = channels = 0
    compressed = bytearray()
    while offset + 12 <= len(data):
        length = int.from_bytes(data[offset : offset + 4], "big")
        kind = data[offset + 4 : offset + 8]
        payload = data[offset + 8 : offset + 8 + length]
        offset += 12 + length
        if kind == b"IHDR":
            width, height, bit_depth, color_type, compression, filtering, interlace = (
                struct.unpack(">IIBBBBB", payload)
            )
            if (
                bit_depth != 8
                or color_type not in (2, 6)
                or compression != 0
                or filtering != 0
                or interlace != 0
            ):
                raise ValueError(f"unsupported PNG encoding: {path}")
            channels = 3 if color_type == 2 else 4
        elif kind == b"IDAT":
            compressed.extend(payload)
        elif kind == b"IEND":
            break

    stride = width * channels
    filtered = zlib.decompress(compressed)
    rows: list[bytes] = []
    previous = bytearray(stride)
    cursor = 0
    for _row_index in range(height):
        filter_type = filtered[cursor]
        cursor += 1
        row = bytearray(filtered[cursor : cursor + stride])
        cursor += stride
        for index in range(stride):
            left = row[index - channels] if index >= channels else 0
            above = previous[index]
            upper_left = previous[index - channels] if index >= channels else 0
            if filter_type == 1:
                predictor = left
            elif filter_type == 2:
                predictor = above
            elif filter_type == 3:
                predictor = (left + above) // 2
            elif filter_type == 4:
                estimate = left + above - upper_left
                distances = (
                    abs(estimate - left),
                    abs(estimate - above),
                    abs(estimate - upper_left),
                )
                predictor = (left, above, upper_left)[distances.index(min(distances))]
            elif filter_type == 0:
                predictor = 0
            else:
                raise ValueError(f"unsupported PNG filter {filter_type}: {path}")
            row[index] = (row[index] + predictor) & 0xFF
        rows.append(
            bytes(
                component
                for pixel_start in range(0, stride, channels)
                for component in row[pixel_start : pixel_start + 3]
            )
        )
        previous = row
    return width, height, rows


def painted_bounds(path: Path, background: str) -> dict[str, int]:
    width, height, rows = read_png_rgb_rows(path)
    background_rgb = bytes.fromhex(background.removeprefix("#"))
    painted = [
        (x, y)
        for y, row in enumerate(rows)
        for x in range(width)
        if row[x * 3 : x * 3 + 3] != background_rgb
    ]
    if not painted:
        raise ValueError(f"PNG has no pixels distinct from its background: {path}")
    left = min(x for x, _y in painted)
    top = min(y for _x, y in painted)
    right = max(x for x, _y in painted)
    bottom = max(y for _x, y in painted)
    return {
        "left": left,
        "top": top,
        "width": right - left + 1,
        "height": bottom - top + 1,
    }


class FlodeskCtaValidatorTests(unittest.TestCase):
    def copy_package(self) -> tuple[tempfile.TemporaryDirectory, Path]:
        temporary = tempfile.TemporaryDirectory()
        destination = Path(temporary.name) / "flodesk-upload-package"
        shutil.copytree(PACKAGE_DIR, destination)
        source_root = PACKAGE_DIR.parent
        for relative in (
            "launch-newsletter-preview.html",
            "launch-newsletter-copy.md",
            "launch-newsletter.txt",
            "flodesk-build-guide.md",
            "link-map.md",
            "previews/launch-newsletter-desktop.png",
            "previews/launch-newsletter-mobile.png",
            "scripts/export_flodesk_upload_pieces.mjs",
        ):
            target = Path(temporary.name) / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_root / relative, target)
        return temporary, destination

    def write_json(self, path: Path, value) -> None:
        path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")

    def read_json(self, path: Path):
        return json.loads(path.read_text(encoding="utf-8"))

    def seed_cta_fixture(self, package: Path) -> None:
        # The repository fixture now contains the complete CTA kit. Keep this
        # compatibility hook so each mutation test starts from that green copy.
        return

        cta_dir = package / "native-elements/ctas"
        references = cta_dir / "references"
        references.mkdir(parents=True, exist_ok=True)

        overview_lines = [
            "# CTA Overview",
            "",
            "## Complete CTA table",
            "",
            "| CTA | Label | Destination | Sequence position |",
            "| --- | --- | --- | --- |",
        ]
        for cta in CTA_DATA:
            overview_lines.append(
                f"| {cta['id']} | {cta['label']} | {cta['destination']} | {cta['position']} |"
            )
        overview_lines.extend(
            (
                "",
                "## Purchase-button mobile requirements",
                "",
                "Amazon first; full-width vertical stack; 12px separation; 54px desktop height.",
                "",
                "## Hero image link",
                "",
                f"Asset: `upload-pieces/02-hero-visual.png`; destination: `{AMAZON_URL}`; sequence position: 2.",
            )
        )
        (cta_dir / "00-CTA-OVERVIEW.md").write_text(
            "\n".join(overview_lines) + "\n", encoding="utf-8"
        )

        manifest_ctas = []
        source_reference = package / "reference/reassembled-upload-pieces-proof.png"
        for index, cta in enumerate(CTA_DATA, start=1):
            markdown = f"""# CTA {index:02d} — {cta['label']}

## Assembly position
{cta['position']}

## Placement
- Previous element: {cta['preceding']}
- Next element: {cta['following']}

## Flodesk block
- Block type: Button
- Label: {cta['label']}
- Destination: {cta['destination']}
- Alignment: center
- Width behavior: {cta['desktop_width']}
- Desktop height target: 54px
- Mobile width: full width inside 24px side margins
- Border radius: 4px
- Background color: #0D182A
- Text color: #F3E7D4
- Font: Arial, Helvetica, sans-serif
- Font size: 16px
- Font weight: 700
- Letter spacing: normal (0px added tracking)
- Horizontal padding: 26px
- Vertical padding: 16px
- Space above: 0px
- Space below: {cta['mobile_gap']}px

## Mobile behavior
- Full width: Yes
- Stacking order: {cta['stack_order']}
- Gap from adjacent button: {cta['mobile_gap']}px

## Build instructions
1. Add a Flodesk button block.
2. Enter the exact label.
3. Paste the exact destination.
4. Apply every documented setting.
5. Preview desktop and mobile.
6. Save, reopen, and confirm the destination.

## Validation
- [ ] Label matches approved HTML
- [ ] Destination matches approved link map
"""
            (cta_dir / cta["filename"]).write_text(markdown, encoding="utf-8")
            shutil.copy2(source_reference, references / cta["reference"])
            manifest_ctas.append(
                {
                    "id": cta["id"],
                    "sequence_position": cta["position"],
                    "type": "button",
                    "label": cta["label"],
                    "destination": cta["destination"],
                    "source": SOURCE,
                    "source_selector": f".email-shell a.button-link, exact text {cta['label']}",
                    "preceding_element": cta["preceding"],
                    "following_element": cta["following"],
                    "desktop": {
                        "height_target_px": 54,
                        "alignment": "center",
                        "width_behavior": cta["desktop_width"],
                    },
                    "mobile": {
                        "full_width": True,
                        "stack_order": cta["stack_order"],
                        "gap_after_px": cta["mobile_gap"],
                    },
                    "cta_file": f"native-elements/ctas/{cta['filename']}",
                    "reference_image": f"native-elements/ctas/references/{cta['reference']}",
                    "validation_status": "approved-source-match",
                }
            )
        shutil.copy2(source_reference, references / "all-ctas-contact-sheet.png")
        cta_manifest = {
            "schema_version": 1,
            "source": SOURCE,
            "validation_status": "approved-source-match",
            "ctas": manifest_ctas,
        }
        self.write_json(cta_dir / "cta-manifest.json", cta_manifest)

        manifest_path = package / "package-manifest.json"
        manifest = self.read_json(manifest_path)
        by_label = {item["label"]: item for item in manifest_ctas}
        renamed = {
            "native-01": "cta-01",
            "native-02": "cta-02",
            "native-03": "cta-03",
            "native-04": "native-sarah-attribution",
            "native-05": "cta-04",
            "native-06": "cta-05",
            "native-07": "native-author-links",
            "native-08": "native-compliance-footer",
        }
        native_elements = []
        for item in manifest["native_elements"]:
            if item.get("type") == "button":
                native_elements.append(dict(by_label[item["label"]]))
            else:
                item["id"] = renamed[item["id"]]
                item["sequence_position"] = item.pop("sequence_number")
                native_elements.append(item)
        manifest["native_elements"] = native_elements
        for entry in manifest["assembly_sequence"]:
            if entry["kind"] == "native-element":
                entry["reference"] = renamed[entry["reference"]]
        self.write_json(manifest_path, manifest)

        sequence = package / "07-UPLOAD-SEQUENCE.md"
        sequence.write_text(
            sequence.read_text(encoding="utf-8")
            + "\n"
            + "\n".join(
                f"## Step {cta['position']:02d} — Native CTA: {cta['label']}\nOpen: `native-elements/ctas/{cta['filename']}`"
                for cta in CTA_DATA
            )
            + "\n",
            encoding="utf-8",
        )

    def mutate_cta_manifest(self, package: Path, callback) -> None:
        path = package / "native-elements/ctas/cta-manifest.json"
        value = self.read_json(path)
        callback(value)
        self.write_json(path, value)

    def mutate_package_manifest(self, package: Path, callback) -> None:
        path = package / "package-manifest.json"
        value = self.read_json(path)
        callback(value)
        self.write_json(path, value)

    def assert_has_failure(self, package: Path, expected: str) -> None:
        failures = validator.validate_package(package)
        self.assertIn(expected, failures, failures)

    def test_complete_cta_deliverables_physically_exist(self):
        cta_dir = PACKAGE_DIR / "native-elements/ctas"
        required = [
            "00-CTA-OVERVIEW.md",
            *(cta["filename"] for cta in CTA_DATA),
            "cta-manifest.json",
            *(f"references/{cta['reference']}" for cta in CTA_DATA),
            "references/all-ctas-contact-sheet.png",
        ]
        missing = [relative for relative in required if not (cta_dir / relative).is_file()]
        self.assertEqual(missing, [], f"missing CTA deliverables: {missing}")

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

    def test_cta_references_preserve_complete_painted_button_bounds(self):
        manifest = self.read_json(
            PACKAGE_DIR / "native-elements/ctas/cta-manifest.json"
        )
        for cta in manifest["ctas"]:
            with self.subTest(cta=cta["id"]):
                reference = PACKAGE_DIR / cta["reference_image"]
                self.assertEqual(
                    painted_bounds(
                        reference,
                        cta["reference_canvas"]["background_color"],
                    ),
                    CTA_REFERENCE_BUTTON_REGION,
                )

    def test_package_docs_do_not_require_visible_reference_footers(self):
        obsolete_instruction = (
            "REFERENCE" + " ONLY — BUILD AS A NATIVE FLODESK BUTTON"
        )
        offenders = [
            path.relative_to(PACKAGE_DIR).as_posix()
            for path in PACKAGE_DIR.rglob("*.md")
            if obsolete_instruction in path.read_text(encoding="utf-8")
        ]
        self.assertEqual(
            offenders,
            [],
            f"obsolete visible reference-footer instruction remains in: {offenders}",
        )

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

    def test_missing_cta_file_reports_exact_path(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        relative = "native-elements/ctas/02-read-an-excerpt.md"
        (package / relative).unlink()
        self.assert_has_failure(package, f"CTA file is missing: {relative}")

    def test_missing_cta_manifest_reports_clear_failure(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        (package / "native-elements/ctas/cta-manifest.json").unlink()
        self.assert_has_failure(
            package,
            "CTA manifest is missing: native-elements/ctas/cta-manifest.json",
        )

    def test_invalid_cta_manifest_json_reports_clear_failure(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        (package / "native-elements/ctas/cta-manifest.json").write_text("{invalid", encoding="utf-8")
        failures = validator.validate_package(package)
        self.assertTrue(any(f.startswith("cta-manifest.json is not valid JSON:") for f in failures), failures)

    def test_missing_cta_destination_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package, lambda value: value["ctas"][1].update(destination="")
        )
        self.assert_has_failure(
            package,
            "CTA `Read an Excerpt` has no destination in cta-manifest.json.",
        )

    def test_cta_destination_must_match_authoritative_html(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package,
            lambda value: value["ctas"][2].update(destination="https://example.com/wrong"),
        )
        self.assert_has_failure(
            package,
            "CTA `Buy the Memoir Now` destination differs from the authoritative newsletter HTML.",
        )

    def test_missing_cta_in_main_manifest_names_the_label(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_package_manifest(
            package,
            lambda value: value["native_elements"].__setitem__(
                slice(None),
                [item for item in value["native_elements"] if item.get("id") != "cta-02"],
            ),
        )
        self.assert_has_failure(
            package,
            "CTA `Read an Excerpt` is missing from package-manifest.json.",
        )

    def test_missing_cta_in_cta_manifest_names_the_label(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package,
            lambda value: value["ctas"].__setitem__(
                slice(None), [item for item in value["ctas"] if item["id"] != "cta-05"]
            ),
        )
        self.assert_has_failure(
            package,
            "CTA `Order Your Signed Copy` is missing from cta-manifest.json.",
        )

    def test_duplicate_cta_manifest_entry_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package, lambda value: value["ctas"].append(dict(value["ctas"][0]))
        )
        self.assert_has_failure(
            package,
            "CTA `Buy the Book on Amazon` appears more than once in cta-manifest.json.",
        )

    def test_missing_cta_sequence_step_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        sequence = package / "07-UPLOAD-SEQUENCE.md"
        heading = "## Step 06 — Native CTA: Read an Excerpt"
        sequence.write_text(
            sequence.read_text(encoding="utf-8").replace(heading, "## Removed CTA step"),
            encoding="utf-8",
        )
        self.assert_has_failure(
            package,
            "CTA `Read an Excerpt` is missing from the assembly sequence guide.",
        )

    def test_duplicate_cta_sequence_step_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        sequence = package / "07-UPLOAD-SEQUENCE.md"
        sequence.write_text(
            sequence.read_text(encoding="utf-8")
            + "\n## Step 29 — Native CTA: Buy on Amazon\n",
            encoding="utf-8",
        )
        self.assert_has_failure(
            package,
            "CTA `Buy on Amazon` appears more than once in the assembly sequence guide.",
        )

    def test_missing_cta_reference_image_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        relative = (
            "native-elements/ctas/references/"
            "05-order-your-signed-copy-reference.png"
        )
        (package / relative).unlink()
        self.assert_has_failure(package, f"CTA reference image is missing: {relative}")

    def test_hero_image_link_must_be_documented_in_cta_overview(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        overview = package / "native-elements/ctas/00-CTA-OVERVIEW.md"
        overview.write_text(
            overview.read_text(encoding="utf-8").replace(
                "upload-pieces/02-hero-visual.png", "undocumented-hero.png"
            ),
            encoding="utf-8",
        )
        self.assert_has_failure(
            package,
            "Hero image link is undocumented in 00-CTA-OVERVIEW.md.",
        )

    def test_amazon_and_stripe_routes_cannot_be_collapsed(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package, lambda value: value["ctas"][4].update(destination=AMAZON_URL)
        )
        self.mutate_package_manifest(
            package,
            lambda value: next(
                item for item in value["native_elements"] if item.get("id") == "cta-05"
            ).update(destination=AMAZON_URL),
        )
        self.assert_has_failure(
            package,
            "Amazon and Stripe CTA routes must remain separate.",
        )

    def test_purchase_cta_order_requires_amazon_first(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)

        def swap(value):
            value["ctas"][3]["sequence_position"] = 23
            value["ctas"][4]["sequence_position"] = 22

        self.mutate_cta_manifest(package, swap)
        self.assert_has_failure(
            package,
            "Purchase CTA order is incorrect: Amazon must precede signed-copy Stripe.",
        )

    def test_purchase_mobile_gap_must_be_twelve_pixels(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package, lambda value: value["ctas"][3]["mobile"].update(gap_after_px=0)
        )
        self.assert_has_failure(
            package,
            "Purchase CTA mobile spacing must be documented as 12px.",
        )

    def test_purchase_desktop_height_must_be_fifty_four_pixels(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)
        self.mutate_cta_manifest(
            package, lambda value: value["ctas"][3]["desktop"].update(height_target_px=52)
        )
        self.assert_has_failure(
            package,
            "Approved desktop purchase-button height must be documented as 54px.",
        )

    def test_rasterized_cta_without_live_button_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.seed_cta_fixture(package)

        def alter_main(value):
            value["upload_pieces"][4]["embedded_text"].append("Read an Excerpt")
            value["native_elements"] = [
                item for item in value["native_elements"] if item.get("id") != "cta-02"
            ]

        self.mutate_package_manifest(package, alter_main)
        self.mutate_cta_manifest(
            package,
            lambda value: value["ctas"].__setitem__(
                slice(None), [item for item in value["ctas"] if item["id"] != "cta-02"]
            ),
        )
        self.assert_has_failure(
            package,
            "Native CTA `Read an Excerpt` was rasterized into an upload piece without a corresponding live button.",
        )


if __name__ == "__main__":
    unittest.main()
