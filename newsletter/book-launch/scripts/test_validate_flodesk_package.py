import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import validate_flodesk_package as validator
import validate_launch_newsletter as newsletter_validator


PACKAGE_DIR = Path(__file__).resolve().parent.parent / "flodesk-upload-package"
LEGACY_GUIDE = PACKAGE_DIR.parent / "flodesk-build-guide.md"
README = PACKAGE_DIR.parent / "README.md"


class FlodeskPackageValidatorTests(unittest.TestCase):
    def copy_package(self) -> tuple[tempfile.TemporaryDirectory, Path]:
        temporary = tempfile.TemporaryDirectory()
        destination = Path(temporary.name) / "flodesk-upload-package"
        shutil.copytree(PACKAGE_DIR, destination)
        source_root = PACKAGE_DIR.parent
        for relative in (
            "launch-newsletter-preview.html",
            "launch-newsletter-copy.md",
            "launch-newsletter.txt",
            "link-map.md",
            "flodesk-build-guide.md",
            "previews/launch-newsletter-desktop.png",
            "previews/launch-newsletter-mobile.png",
            "scripts/export_flodesk_upload_pieces.mjs",
        ):
            target = Path(temporary.name) / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_root / relative, target)
        return temporary, destination

    def mutate_manifest(self, package: Path, callback) -> None:
        path = package / "package-manifest.json"
        manifest = json.loads(path.read_text(encoding="utf-8"))
        callback(manifest)
        path.write_text(json.dumps(manifest), encoding="utf-8")

    def test_approved_package_passes(self):
        self.assertEqual(validator.validate_package(PACKAGE_DIR), [])

    def test_package_contains_literal_upload_piece_contract(self):
        manifest = json.loads(
            (PACKAGE_DIR / "package-manifest.json").read_text(encoding="utf-8")
        )
        pieces = manifest.get("upload_pieces")
        self.assertTrue((PACKAGE_DIR / "upload-pieces").is_dir())
        self.assertTrue((PACKAGE_DIR / "07-UPLOAD-SEQUENCE.md").is_file())
        self.assertTrue((PACKAGE_DIR / "reference/upload-pieces-contact-sheet.png").is_file())
        self.assertTrue((PACKAGE_DIR / "reference/reassembled-upload-pieces-proof.png").is_file())
        self.assertIsInstance(pieces, list)
        self.assertGreaterEqual(len(pieces), 12)
        self.assertLessEqual(len(pieces), 20)
        self.assertEqual(len(pieces), len(list((PACKAGE_DIR / "upload-pieces").glob("*.png"))))

    def test_nonsequential_upload_piece_number_reports_clear_failure(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.mutate_manifest(package, lambda m: m["upload_pieces"][4].update(number="08"))
        failures = validator.validate_package(package)
        self.assertTrue(any("Upload-piece numbering must be sequential" in f for f in failures), failures)
        self.assertTrue(any("Duplicate upload-piece number 08" in f for f in failures), failures)

    def test_missing_upload_piece_reports_filename(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        missing = package / "upload-pieces/01-author-identifier.png"
        missing.unlink()
        self.assertIn(
            "Referenced upload piece is missing: upload-pieces/01-author-identifier.png",
            validator.validate_package(package),
        )

    def test_corrupt_upload_piece_reports_human_readable_failure(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        path = package / "upload-pieces/03-butterfly-separator-01.png"
        path.write_bytes(b"not a png")
        failures = validator.validate_package(package)
        self.assertTrue(any("Upload piece is not a valid PNG" in f for f in failures), failures)

    def test_dimension_and_hash_mismatches_are_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            manifest["upload_pieces"][0]["width"] = 1
            manifest["upload_pieces"][0]["sha256"] = "0" * 64
        self.mutate_manifest(package, alter)
        failures = validator.validate_package(package)
        self.assertTrue(any("dimensions do not match manifest" in f for f in failures), failures)
        self.assertTrue(any("hash does not match manifest" in f for f in failures), failures)

    def test_file_size_and_transparency_mismatches_are_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            manifest["upload_pieces"][0]["file_size_bytes"] = 1
            manifest["upload_pieces"][0]["transparent"] = True
        self.mutate_manifest(package, alter)
        failures = validator.validate_package(package)
        self.assertTrue(any("file size does not match manifest" in f for f in failures), failures)
        self.assertTrue(any("transparency does not match manifest" in f for f in failures), failures)

    def test_clickable_hero_destination_is_exact(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.mutate_manifest(
            package,
            lambda m: m["upload_pieces"][1].update(destination="https://example.com/wrong"),
        )
        self.assertIn(
            "Clickable hero destination does not match the approved Amazon URL.",
            validator.validate_package(package),
        )

    def test_assembly_sequence_omission_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.mutate_manifest(
            package,
            lambda m: m["assembly_sequence"].__setitem__(slice(None), m["assembly_sequence"][:-1]),
        )
        failures = validator.validate_package(package)
        self.assertTrue(any("Assembly positions must be sequential" in f for f in failures), failures)
        self.assertTrue(any("Native element is missing from assembly sequence" in f for f in failures), failures)

    def test_native_sequence_position_must_match_assembly_position(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        self.mutate_manifest(package, lambda m: m["native_elements"][0].update(sequence_position=99))
        self.assertIn(
            "Native element cta-01 sequence_position does not match assembly position 5.",
            validator.validate_package(package),
        )

    def test_duplicate_upload_piece_in_sequence_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            entry = manifest["assembly_sequence"][2]
            entry["reference"] = "02"
            entry["filename"] = "02-hero-visual.png"
        self.mutate_manifest(package, alter)
        failures = validator.validate_package(package)
        self.assertTrue(any("Upload piece 02 appears more than once" in f for f in failures), failures)
        self.assertTrue(any("Upload piece 03 is missing" in f for f in failures), failures)

    def test_manifest_cannot_redefine_a_reduced_native_contract(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            manifest["native_elements"] = manifest["native_elements"][:-2]
            manifest["assembly_sequence"] = manifest["assembly_sequence"][:-2]
        self.mutate_manifest(package, alter)
        failures = validator.validate_package(package)
        self.assertTrue(any("exact 28-position contract" in f for f in failures), failures)
        self.assertTrue(any("exact eight-element contract" in f for f in failures), failures)

    def test_assembly_filename_must_match_referenced_piece(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            manifest["assembly_sequence"][0]["filename"] = "01-final.png"
        self.mutate_manifest(package, alter)
        self.assertIn(
            "Assembly entry 1 filename does not match upload piece 01: 01-final.png.",
            validator.validate_package(package),
        )

    def test_ranking_and_acknowledgment_metadata_are_required(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        def alter(manifest):
            manifest["upload_pieces"][6]["embedded_text"] = ["Amazon Bestseller"]
            manifest["upload_pieces"][7]["embedded_text"] = []
        self.mutate_manifest(package, alter)
        failures = validator.validate_package(package)
        self.assertTrue(any("Ranking piece must contain exactly" in f for f in failures), failures)
        self.assertIn("The revised acknowledgment paragraph is missing from upload-piece metadata.", failures)

    def test_superseded_editor_wording_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        copy_path = package / "04-COPY-PASTE-TEXT.md"
        copy_path.write_text(
            copy_path.read_text(encoding="utf-8")
            + "\nAttached is the very first conversation I had with an editor about writing this book.\n",
            encoding="utf-8",
        )
        self.assertIn("Superseded editor-conversation wording is present.", validator.validate_package(package))

    def test_superseded_seven_image_completion_claim_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        context = package / "CONTEXT.md"
        context.write_text(context.read_text(encoding="utf-8") + "\nAll seven package assets opened successfully.\n")
        self.assertIn("Superseded seven-image completion claim is present.", validator.validate_package(package))

    def test_changed_approved_copy_line_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        copy_path = package / "04-COPY-PASTE-TEXT.md"
        copy_path.write_text(
            copy_path.read_text(encoding="utf-8").replace("The book is officially here.", "The book is here."),
            encoding="utf-8",
        )
        self.assertIn(
            "Approved copy line is missing from the copy file: The book is officially here.",
            validator.validate_package(package),
        )

    def test_appended_unapproved_copy_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        copy_path = package / "04-COPY-PASTE-TEXT.md"
        copy_path.write_text(copy_path.read_text(encoding="utf-8") + "\nUNAPPROVED CAMPAIGN COPY\n")
        self.assertIn(
            "Copy-paste file does not exactly match the canonical approved copy template.",
            validator.validate_package(package),
        )

    def test_changed_authoritative_source_hash_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        source = package / "../launch-newsletter-preview.html"
        source.write_text(
            source.read_text(encoding="utf-8").replace(
                "The book is officially here.", "The approved heading was changed."
            ),
            encoding="utf-8",
        )
        self.assertIn(
            "Authoritative source hash does not match manifest: ../launch-newsletter-preview.html",
            validator.validate_package(package),
        )

    def test_invalid_manifest_json_reports_human_readable_failure(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        (package / "package-manifest.json").write_text("{invalid", encoding="utf-8")
        failures = validator.validate_package(package)
        self.assertTrue(any(f.startswith("package-manifest.json is not valid JSON:") for f in failures), failures)

    def test_changed_reference_preview_is_rejected(self):
        temporary, package = self.copy_package()
        self.addCleanup(temporary.cleanup)
        preview = package / "reference/approved-mobile-preview.png"
        preview.write_bytes(preview.read_bytes() + b"changed")
        self.assertIn(
            "Reference preview hash does not match manifest: reference/approved-mobile-preview.png",
            validator.validate_package(package),
        )

    def test_legacy_guide_is_a_concise_package_index(self):
        guide = LEGACY_GUIDE.read_text(encoding="utf-8")
        self.assertIn("flodesk-upload-package/", guide)
        self.assertIn("00-START-HERE.md", guide)
        self.assertIn("07-UPLOAD-SEQUENCE.md", guide)
        self.assertIn("## Historical Notes", guide)

    def test_active_newsletter_validator_accepts_package_index(self):
        self.assertEqual(
            newsletter_validator.validate(newsletter_validator.TASK6_ACTIVE_FILES, include_readme=False),
            [],
        )

    def test_readme_names_numbered_package_as_assembly_authority(self):
        readme = README.read_text(encoding="utf-8")
        self.assertIn(
            "The authoritative manual Flodesk assembly instructions live in `flodesk-upload-package/` and begin with `00-START-HERE.md`.",
            readme,
        )


if __name__ == "__main__":
    unittest.main()
