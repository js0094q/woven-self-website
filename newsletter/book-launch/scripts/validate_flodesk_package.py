#!/usr/bin/env python3
"""Validate the literal numbered Flodesk upload-piece package."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zlib
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


DEFAULT_PACKAGE_DIR = Path(__file__).resolve().parent.parent / "flodesk-upload-package"

REQUIRED_FILES = (
    "00-START-HERE.md",
    "01-ASSEMBLY-CHECKLIST.md",
    "02-FLODESK-BLOCK-MAP.md",
    "03-LINKS-AND-BUTTONS.md",
    "04-COPY-PASTE-TEXT.md",
    "05-IMAGE-INVENTORY.md",
    "06-FINAL-QA-CHECKLIST.md",
    "07-UPLOAD-SEQUENCE.md",
    "CONTEXT.md",
    "package-manifest.json",
    "reference/approved-desktop-preview.png",
    "reference/approved-mobile-preview.png",
    "reference/upload-pieces-contact-sheet.png",
    "reference/reassembled-upload-pieces-proof.png",
    "reference/reassembled-upload-pieces-mobile-proof.png",
    "reference/reassembly-comparison.json",
    "native-elements/ctas/00-CTA-OVERVIEW.md",
    "native-elements/ctas/01-buy-the-book-on-amazon.md",
    "native-elements/ctas/02-read-an-excerpt.md",
    "native-elements/ctas/03-buy-the-memoir-now.md",
    "native-elements/ctas/04-buy-on-amazon.md",
    "native-elements/ctas/05-order-your-signed-copy.md",
    "native-elements/ctas/cta-manifest.json",
    "native-elements/ctas/references/01-buy-the-book-on-amazon-reference.png",
    "native-elements/ctas/references/02-read-an-excerpt-reference.png",
    "native-elements/ctas/references/03-buy-the-memoir-now-reference.png",
    "native-elements/ctas/references/04-buy-on-amazon-reference.png",
    "native-elements/ctas/references/05-order-your-signed-copy-reference.png",
    "native-elements/ctas/references/all-ctas-contact-sheet.png",
)
REQUIRED_DIRECTORIES = (
    "upload-pieces",
    "reference",
    "native-elements/ctas",
    "native-elements/ctas/references",
)

ACKNOWLEDGMENT = (
    "I wanted to take a moment to acknowledge the women who gave me the strength "
    "and support to write this and put it before an editor. Without their gentle "
    "encouragement, this book would not be here today."
)
RANKINGS = (
    "#26 in Trauma Psychology eBooks",
    "#125 in Trauma Psychology Books",
    "#151 in Survival Biographies",
)
SUPERSEDED_WORDING = (
    "There were many moments when I didn't know if I could finish it, send it to publishers or literary agents",
    "Attached is the very first conversation I had with an editor about writing this book.",
    "Both women remain incredibly close to my heart",
)
SUPERSEDED_SEVEN_IMAGE_CLAIMS = (
    "All seven package assets opened successfully",
    "No additional image pieces were exported",
    "Seven copied upload assets",
    "Seven approved image uploads",
    "seven upload assets",
)
APPROVED_URLS = (
    "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28",
    "https://wovenself.com/excerpt-unfolding-origami.html",
    "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00",
    "https://alittlebitculty.com/",
    "https://www.instagram.com/lorengaleseauthor/",
    "https://wovenself.com/author.html",
    "https://substack.com/@quietalchemywloren",
    "https://wovenself.com/",
)
EXPECTED_BUTTONS = {
    "Buy the Book on Amazon": APPROVED_URLS[0],
    "Read an Excerpt": APPROVED_URLS[1],
    "Buy the Memoir Now": APPROVED_URLS[0],
    "Buy on Amazon": APPROVED_URLS[0],
    "Order Your Signed Copy": APPROVED_URLS[2],
}
CTA_SOURCE = "newsletter/book-launch/launch-newsletter-preview.html"
EXPECTED_CTAS = (
    {
        "id": "cta-01",
        "label": "Buy the Book on Amazon",
        "destination": APPROVED_URLS[0],
        "sequence_position": 5,
        "file": "native-elements/ctas/01-buy-the-book-on-amazon.md",
        "reference": "native-elements/ctas/references/01-buy-the-book-on-amazon-reference.png",
    },
    {
        "id": "cta-02",
        "label": "Read an Excerpt",
        "destination": APPROVED_URLS[1],
        "sequence_position": 6,
        "file": "native-elements/ctas/02-read-an-excerpt.md",
        "reference": "native-elements/ctas/references/02-read-an-excerpt-reference.png",
    },
    {
        "id": "cta-03",
        "label": "Buy the Memoir Now",
        "destination": APPROVED_URLS[0],
        "sequence_position": 16,
        "file": "native-elements/ctas/03-buy-the-memoir-now.md",
        "reference": "native-elements/ctas/references/03-buy-the-memoir-now-reference.png",
    },
    {
        "id": "cta-04",
        "label": "Buy on Amazon",
        "destination": APPROVED_URLS[0],
        "sequence_position": 22,
        "file": "native-elements/ctas/04-buy-on-amazon.md",
        "reference": "native-elements/ctas/references/04-buy-on-amazon-reference.png",
    },
    {
        "id": "cta-05",
        "label": "Order Your Signed Copy",
        "destination": APPROVED_URLS[2],
        "sequence_position": 23,
        "file": "native-elements/ctas/05-order-your-signed-copy.md",
        "reference": "native-elements/ctas/references/05-order-your-signed-copy-reference.png",
    },
)
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
EXPECTED_ASSEMBLY_SEQUENCE = (
    (1, "upload-piece", "01", "01-author-identifier.png"),
    (2, "upload-piece", "02", "02-hero-visual.png"),
    (3, "upload-piece", "03", "03-butterfly-separator-01.png"),
    (4, "upload-piece", "04", "04-hero-eyebrow-heading-and-supporting-copy.png"),
    (5, "native-element", "cta-01", None),
    (6, "native-element", "cta-02", None),
    (7, "upload-piece", "05", "05-butterfly-separator-02.png"),
    (8, "upload-piece", "06", "06-opening-letter-part-01.png"),
    (9, "upload-piece", "07", "07-amazon-bestseller-rankings.png"),
    (10, "upload-piece", "08", "08-opening-letter-part-02.png"),
    (11, "upload-piece", "09", "09-opening-letter-part-03.png"),
    (12, "upload-piece", "10", "10-opening-letter-part-04.png"),
    (13, "upload-piece", "11", "11-butterfly-separator-03.png"),
    (14, "upload-piece", "12", "12-interior-book-spread.png"),
    (15, "upload-piece", "13", "13-inside-unfolding-origami.png"),
    (16, "native-element", "cta-03", None),
    (17, "upload-piece", "14", "14-butterfly-separator-04.png"),
    (18, "upload-piece", "15", "15-sarah-edmondson-endorsement.png"),
    (19, "native-element", "native-sarah-attribution", None),
    (20, "upload-piece", "16", "16-reader-review.png"),
    (21, "upload-piece", "17", "17-butterfly-separator-05-and-choose-your-copy.png"),
    (22, "native-element", "cta-04", None),
    (23, "native-element", "cta-05", None),
    (24, "upload-piece", "18", "18-signed-copy-deadline.png"),
    (25, "upload-piece", "19", "19-support-the-book.png"),
    (26, "upload-piece", "20", "20-closing-letter.png"),
    (27, "native-element", "native-author-links", None),
    (28, "native-element", "native-compliance-footer", None),
)
EXPECTED_NATIVE_CONTRACT = (
    ("cta-01", "button", 5),
    ("cta-02", "button", 6),
    ("cta-03", "button", 16),
    ("native-sarah-attribution", "linked-text", 19),
    ("cta-04", "button", 22),
    ("cta-05", "button", 23),
    ("native-author-links", "linked-text", 27),
    ("native-compliance-footer", "compliance-footer", 28),
)
COPY_WARNING = (
    "# Copy-Paste Text\n\n"
    "> Copy only from this file. Do not copy from an older newsletter draft, "
    "screenshot, chat transcript, or memory note.\n\n"
)

AMBIGUOUS_NAME = re.compile(
    r"(?:^|[-_])(image\d*|final|new|new-final|asset-copy)(?:[-_.]|$)", re.IGNORECASE
)
ORDERED_NAME = re.compile(r"^(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.png$")
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
CANONICAL_COPY_LABELS = {
    "**Eyebrow**",
    "**Main heading**",
    "**Subheading**",
    "**Primary button**",
    "**Secondary button**",
}


def read_text(path: Path, failures: list[str]) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        failures.append(f"Required file is missing: {path.name}")
        return ""


def load_manifest(path: Path, failures: list[str]) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        failures.append("Required file is missing: package-manifest.json")
        return None
    except json.JSONDecodeError as error:
        failures.append(
            "package-manifest.json is not valid JSON: "
            f"line {error.lineno}, column {error.colno}: {error.msg}"
        )
        return None
    if not isinstance(value, dict):
        failures.append("package-manifest.json must contain one JSON object.")
        return None
    return value


def load_cta_manifest(path: Path, failures: list[str]) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        failures.append("CTA manifest is missing: native-elements/ctas/cta-manifest.json")
        return None
    except json.JSONDecodeError as error:
        failures.append(
            "cta-manifest.json is not valid JSON: "
            f"line {error.lineno}, column {error.colno}: {error.msg}"
        )
        return None
    if not isinstance(value, dict):
        failures.append("cta-manifest.json must contain one JSON object.")
        return None
    return value


class NewsletterSourceParser(HTMLParser):
    """Extract the approved CTA and linked-hero contract from the source HTML."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ctas: list[dict[str, str]] = []
        self.hero: dict[str, str] | None = None
        self._anchor_href: str | None = None
        self._cta: dict[str, Any] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key: value or "" for key, value in attrs}
        if tag == "a":
            self._anchor_href = attributes.get("href", "")
            classes = set(attributes.get("class", "").split())
            if "button-link" in classes:
                self._cta = {
                    "destination": self._anchor_href,
                    "text": [],
                }
        elif tag == "img" and "launch-hero-corrected" in attributes.get("src", ""):
            self.hero = {
                "destination": self._anchor_href or "",
                "source_asset": attributes.get("src", ""),
                "alt_text": attributes.get("alt", ""),
            }

    def handle_data(self, data: str) -> None:
        if self._cta is not None:
            self._cta["text"].append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag != "a":
            return
        if self._cta is not None:
            label = " ".join("".join(self._cta["text"]).split())
            self.ctas.append(
                {
                    "label": label,
                    "destination": str(self._cta["destination"]),
                }
            )
            self._cta = None
        self._anchor_href = None


def extract_authoritative_contract(
    source_path: Path, failures: list[str]
) -> tuple[list[dict[str, str]], dict[str, str] | None]:
    try:
        source = source_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        failures.append("Authoritative newsletter HTML is missing.")
        return [], None
    parser = NewsletterSourceParser()
    try:
        parser.feed(source)
        parser.close()
    except Exception as error:  # pragma: no cover - defensive parser boundary
        failures.append(f"Authoritative newsletter HTML could not be parsed: {error}")
        return [], None
    return parser.ctas, parser.hero


def inspect_png(path: Path) -> tuple[int, int, bool]:
    data = path.read_bytes()
    if len(data) < 33 or data[:8] != PNG_SIGNATURE:
        raise ValueError("missing PNG signature or IHDR")
    offset = 8
    width = height = 0
    transparent = False
    saw_ihdr = saw_iend = False
    while offset + 12 <= len(data):
        length = int.from_bytes(data[offset : offset + 4], "big")
        chunk_type = data[offset + 4 : offset + 8]
        end = offset + 12 + length
        if end > len(data):
            raise ValueError("truncated PNG chunk")
        payload = data[offset + 8 : offset + 8 + length]
        recorded_crc = int.from_bytes(data[offset + 8 + length : end], "big")
        actual_crc = zlib.crc32(chunk_type + payload) & 0xFFFFFFFF
        if actual_crc != recorded_crc:
            raise ValueError(f"invalid CRC in {chunk_type.decode('ascii', errors='replace')} chunk")
        if chunk_type == b"IHDR":
            if length != 13:
                raise ValueError("invalid IHDR length")
            width = int.from_bytes(payload[0:4], "big")
            height = int.from_bytes(payload[4:8], "big")
            transparent = payload[9] in (4, 6)
            saw_ihdr = True
        if chunk_type == b"tRNS":
            transparent = True
        if chunk_type == b"IEND":
            saw_iend = True
            break
        offset = end
    if not saw_ihdr or not saw_iend or width < 1 or height < 1:
        raise ValueError("missing valid IHDR or IEND")
    return width, height, transparent


def validate_upload_pieces(
    package_dir: Path, manifest: dict[str, Any], documents: str, failures: list[str]
) -> list[str]:
    pieces = manifest.get("upload_pieces")
    if not isinstance(pieces, list):
        failures.append("Manifest field 'upload_pieces' must be an array.")
        return []

    declared_count = manifest.get("upload_piece_count")
    if not isinstance(declared_count, int) or declared_count != len(pieces):
        failures.append(
            "Manifest upload_piece_count must equal the finalized upload_pieces array length."
        )
    if len(pieces) < 12 or len(pieces) > 20:
        failures.append("Finalized upload-piece count must be between 12 and 20.")

    numbers = [str(piece.get("number", "")) for piece in pieces if isinstance(piece, dict)]
    expected = [f"{number:02d}" for number in range(1, len(pieces) + 1)]
    if numbers != expected:
        failures.append(
            "Upload-piece numbering must be sequential from 01 with no gaps; "
            f"found {', '.join(numbers) or 'none'}."
        )
    for number, count in Counter(numbers).items():
        if number and count > 1:
            failures.append(f"Duplicate upload-piece number {number} appears in the manifest.")

    manifest_files: set[str] = set()
    all_embedded: list[str] = []
    ranking_embedded: list[str] | None = None
    for piece in pieces:
        if not isinstance(piece, dict):
            failures.append("Each upload-piece manifest entry must be an object.")
            continue
        number = str(piece.get("number", ""))
        filename = str(piece.get("filename", ""))
        manifest_files.add(filename)
        path = package_dir / filename
        basename = path.name
        match = ORDERED_NAME.fullmatch(basename)
        if not match or match.group(1) != number or AMBIGUOUS_NAME.search(basename):
            failures.append(f"Ambiguous, unordered, or mismatched upload-piece filename: {filename}")
        if not path.is_file():
            failures.append(f"Referenced upload piece is missing: {filename}")
            continue
        if filename not in documents and basename not in documents:
            failures.append(f"Upload piece is not documented in the numbered guides: {filename}")
        try:
            width, height, transparent = inspect_png(path)
        except (OSError, ValueError) as error:
            failures.append(f"Upload piece is not a valid PNG: {filename}: {error}")
            continue
        if width != piece.get("width") or height != piece.get("height"):
            failures.append(
                f"Upload-piece dimensions do not match manifest: {filename} "
                f"(actual {width}x{height}, recorded {piece.get('width')}x{piece.get('height')})."
            )
        actual_size = path.stat().st_size
        if actual_size != piece.get("file_size_bytes"):
            failures.append(
                f"Upload-piece file size does not match manifest: {filename} "
                f"(actual {actual_size}, recorded {piece.get('file_size_bytes')})."
            )
        if transparent is not piece.get("transparent"):
            failures.append(
                f"Upload-piece transparency does not match manifest: {filename} "
                f"(actual {transparent}, recorded {piece.get('transparent')})."
            )
        expected_hash = str(piece.get("sha256", ""))
        actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        if not re.fullmatch(r"[0-9a-f]{64}", expected_hash) or actual_hash != expected_hash:
            failures.append(f"Upload-piece hash does not match manifest: {filename}")
        embedded = piece.get("embedded_text")
        if not isinstance(embedded, list):
            failures.append(f"Upload piece has no embedded_text array: {filename}")
        else:
            all_embedded.extend(str(item) for item in embedded)
            if piece.get("section_name") == "Amazon Bestseller rankings":
                ranking_embedded = [str(item) for item in embedded]
        for field in ("section_name", "format", "source", "alt_text", "position_in_assembly_sequence"):
            if field not in piece:
                failures.append(f"Upload piece is missing {field}: {filename}")

    actual_files = {
        f"upload-pieces/{path.name}" for path in (package_dir / "upload-pieces").glob("*.png")
    }
    for filename in sorted(actual_files - manifest_files):
        failures.append(f"Unmanifested upload piece exists: {filename}")
    for filename in sorted(manifest_files - actual_files):
        if (package_dir / filename).is_file():
            failures.append(f"Manifest upload piece is outside upload-pieces/: {filename}")

    required_ranking_text = [
        "Even more unbelievable, within the first 48 hours of release it became an Amazon Bestseller, reaching:",
        "• #26 in Trauma Psychology eBooks",
        "• #125 in Trauma Psychology Books",
        "• #151 in Survival Biographies",
    ]
    if ranking_embedded != required_ranking_text:
        failures.append(
            "Ranking piece must contain exactly Amazon Bestseller and the approved #26, #125, and #151 rankings in order."
        )
    if ACKNOWLEDGMENT not in all_embedded:
        failures.append("The revised acknowledgment paragraph is missing from upload-piece metadata.")
    hero = next((piece for piece in pieces if isinstance(piece, dict) and piece.get("number") == "02"), None)
    if not hero or hero.get("clickable") is not True or hero.get("destination") != APPROVED_URLS[0]:
        failures.append("Clickable hero destination does not match the approved Amazon URL.")
    return numbers


def validate_assembly_sequence(manifest: dict[str, Any], failures: list[str]) -> None:
    sequence = manifest.get("assembly_sequence")
    native = manifest.get("native_elements")
    pieces = manifest.get("upload_pieces")
    if not isinstance(sequence, list):
        failures.append("Manifest field 'assembly_sequence' must be an array.")
        return
    if not isinstance(native, list):
        failures.append("Manifest field 'native_elements' must be an array.")
        native = []
    if not isinstance(pieces, list):
        pieces = []

    actual_contract = tuple(
        (
            entry.get("position"),
            entry.get("kind"),
            str(entry.get("reference", "")),
            entry.get("filename") if entry.get("kind") == "upload-piece" else None,
        )
        for entry in sequence
        if isinstance(entry, dict)
    )
    if actual_contract != EXPECTED_ASSEMBLY_SEQUENCE:
        failures.append(
            "Assembly sequence does not match the exact 28-position contract."
        )

    actual_native_contract = tuple(
        (
            str(item.get("id", "")),
            str(item.get("type", "")),
            item.get("sequence_position"),
        )
        for item in native
        if isinstance(item, dict)
    )
    if actual_native_contract != EXPECTED_NATIVE_CONTRACT:
        failures.append(
            "Native elements do not match the exact eight-element contract."
        )

    positions = [entry.get("position") for entry in sequence if isinstance(entry, dict)]
    expected_positions = list(range(1, len(pieces) + len(native) + 1))
    if positions != expected_positions:
        failures.append(
            "Assembly positions must be sequential and include every upload piece and native element."
        )

    piece_refs = [
        str(entry.get("reference", ""))
        for entry in sequence
        if isinstance(entry, dict) and entry.get("kind") == "upload-piece"
    ]
    native_refs = [
        str(entry.get("reference", ""))
        for entry in sequence
        if isinstance(entry, dict) and entry.get("kind") == "native-element"
    ]
    expected_piece_refs = [str(piece.get("number", "")) for piece in pieces if isinstance(piece, dict)]
    expected_native_refs = [str(item.get("id", "")) for item in native if isinstance(item, dict)]
    for reference in expected_piece_refs:
        count = piece_refs.count(reference)
        if count == 0:
            failures.append(f"Upload piece {reference} is missing from assembly sequence.")
        elif count > 1:
            failures.append(f"Upload piece {reference} appears more than once in assembly sequence.")
    piece_by_number = {
        str(piece.get("number", "")): Path(str(piece.get("filename", ""))).name
        for piece in pieces
        if isinstance(piece, dict)
    }
    for entry in sequence:
        if not isinstance(entry, dict) or entry.get("kind") != "upload-piece":
            continue
        position = entry.get("position")
        reference = str(entry.get("reference", ""))
        filename = str(entry.get("filename", ""))
        if filename != piece_by_number.get(reference):
            failures.append(
                f"Assembly entry {position} filename does not match upload piece {reference}: {filename}."
            )
    for reference in expected_native_refs:
        count = native_refs.count(reference)
        if count == 0:
            failures.append(f"Native element is missing from assembly sequence: {reference}")
        elif count > 1:
            failures.append(f"Native element appears more than once in assembly sequence: {reference}")

    buttons = {
        str(item.get("label", "")): str(item.get("destination", ""))
        for item in native
        if isinstance(item, dict) and item.get("type") == "button"
    }
    if buttons != EXPECTED_BUTTONS:
        failures.append("Native button labels or destinations do not match the approved five-button contract.")
    for item in native:
        if not isinstance(item, dict):
            continue
        common_fields = (
            "sequence_position",
            "type",
            "label",
            "destination",
            "source",
            "source_selector",
            "preceding_element",
            "following_element",
        )
        type_fields = (
            ("desktop", "mobile", "cta_file", "reference_image")
            if item.get("type") == "button"
            else ("width_behavior", "height_target", "alignment", "mobile_behavior")
        )
        for field in common_fields + type_fields:
            if field not in item:
                failures.append(f"Native element {item.get('id', '<unknown>')} is missing {field}.")
        identifier = str(item.get("id", ""))
        matching = next(
            (
                entry for entry in sequence
                if isinstance(entry, dict)
                and entry.get("kind") == "native-element"
                and str(entry.get("reference", "")) == identifier
            ),
            None,
        )
        if matching and item.get("sequence_position") != matching.get("position"):
            failures.append(
                f"Native element {identifier} sequence_position does not match assembly position {matching.get('position')}."
            )


def validate_references(package_dir: Path, manifest: dict[str, Any], failures: list[str]) -> None:
    previews = manifest.get("reference_previews")
    if not isinstance(previews, list):
        failures.append("Manifest field 'reference_previews' must be an array.")
        return
    approved_sources = {
        "reference/approved-desktop-preview.png": "../previews/launch-newsletter-desktop.png",
        "reference/approved-mobile-preview.png": "../previews/launch-newsletter-mobile.png",
    }
    seen: set[str] = set()
    for preview in previews:
        if not isinstance(preview, dict):
            failures.append("Each reference-preview entry must be an object.")
            continue
        filename = str(preview.get("filename", ""))
        seen.add(filename)
        path = package_dir / filename
        if not path.is_file():
            failures.append(f"Referenced preview is missing: {filename}")
            continue
        try:
            width, height, _transparent = inspect_png(path)
        except (OSError, ValueError) as error:
            failures.append(f"Reference preview is not a valid PNG: {filename}: {error}")
            continue
        dimensions = str(preview.get("dimensions", ""))
        if dimensions != f"{width}x{height}":
            failures.append(f"Reference preview dimensions do not match manifest: {filename}")
        actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual_hash != str(preview.get("sha256", "")):
            failures.append(f"Reference preview hash does not match manifest: {filename}")
        approved = approved_sources.get(filename)
        if approved and (package_dir / approved).is_file():
            approved_hash = hashlib.sha256((package_dir / approved).read_bytes()).hexdigest()
            if actual_hash != approved_hash:
                failures.append(f"Reference preview does not match approved source: {filename}")
    for required in (
        "reference/approved-desktop-preview.png",
        "reference/approved-mobile-preview.png",
        "reference/upload-pieces-contact-sheet.png",
        "reference/reassembled-upload-pieces-proof.png",
        "reference/reassembled-upload-pieces-mobile-proof.png",
        "native-elements/ctas/references/01-buy-the-book-on-amazon-reference.png",
        "native-elements/ctas/references/02-read-an-excerpt-reference.png",
        "native-elements/ctas/references/03-buy-the-memoir-now-reference.png",
        "native-elements/ctas/references/04-buy-on-amazon-reference.png",
        "native-elements/ctas/references/05-order-your-signed-copy-reference.png",
        "native-elements/ctas/references/all-ctas-contact-sheet.png",
    ):
        if required not in seen:
            failures.append(f"Reference preview is missing from manifest: {required}")

    report_path = package_dir / "reference/reassembly-comparison.json"
    try:
        report = json.loads(report_path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as error:
        failures.append(f"Reassembly comparison report is invalid: {error}")
    else:
        desktop_report = report.get("reassembled_desktop_proof", {})
        if not isinstance(desktop_report, dict) or desktop_report.get("pixel_equal_to_direct_retina_master") is not True:
            failures.append("Reassembled desktop sequence does not pixel-match the direct master render.")


def approved_copy_lines(canonical_copy: str) -> list[str]:
    lines: list[str] = []
    for raw_line in canonical_copy.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or line in CANONICAL_COPY_LABELS:
            continue
        if line.startswith("**Subject:**") or line.startswith("**Preview text:**"):
            line = line.split(":", 1)[1].strip()
        line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
        line = re.sub(r"^(?:>\s*|-\s+)", "", line)
        line = line.replace("**", "").replace("*", "").strip()
        if line:
            lines.append(line)
    return lines


def validate_copy(copy_text: str, canonical_copy: str, package_markdown: str, failures: list[str]) -> None:
    expected_copy_text = COPY_WARNING + canonical_copy.strip() + "\n"
    if copy_text != expected_copy_text:
        failures.append(
            "Copy-paste file does not exactly match the canonical approved copy template."
        )
    if ACKNOWLEDGMENT not in copy_text:
        failures.append("The revised acknowledgment paragraph is missing from the copy file.")
    for ranking in RANKINGS:
        if ranking not in copy_text:
            failures.append(f"Approved ranking is missing from the copy file: {ranking}")
    if any(wording in package_markdown for wording in SUPERSEDED_WORDING):
        failures.append("Superseded editor-conversation wording is present.")
    if any(claim in package_markdown for claim in SUPERSEDED_SEVEN_IMAGE_CLAIMS):
        failures.append("Superseded seven-image completion claim is present.")
    normalized = copy_text.replace("**", "").replace("*", "")
    for line in approved_copy_lines(canonical_copy):
        if line not in normalized:
            failures.append(f"Approved copy line is missing from the copy file: {line}")


def validate_links(links_guide: str, manifest: dict[str, Any], failures: list[str]) -> None:
    for url in APPROVED_URLS:
        if url not in links_guide:
            failures.append(f"Approved destination is missing from links guide: {url}")
    for label in EXPECTED_BUTTONS:
        if label not in links_guide:
            failures.append(f"Native button is missing from links guide: {label}")
    for piece in manifest.get("upload_pieces", []):
        if isinstance(piece, dict) and piece.get("clickable"):
            destination = str(piece.get("destination", ""))
            if not destination or destination not in links_guide:
                failures.append(
                    f"Clickable upload piece destination is missing from links guide: {piece.get('filename')}"
                )


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


def validate_ctas(
    package_dir: Path,
    manifest: dict[str, Any],
    cta_manifest: dict[str, Any] | None,
    overview: str,
    sequence_guide: str,
    source_ctas: list[dict[str, str]],
    source_hero: dict[str, str] | None,
    failures: list[str],
) -> None:
    expected_pairs = [
        (str(cta["label"]), str(cta["destination"])) for cta in EXPECTED_CTAS
    ]
    source_pairs = [
        (str(cta.get("label", "")), str(cta.get("destination", "")))
        for cta in source_ctas
    ]
    if source_pairs != expected_pairs:
        failures.append(
            "Authoritative newsletter HTML does not contain the exact approved five-CTA contract."
        )

    overview_hero_contract = (
        "upload-pieces/02-hero-visual.png",
        APPROVED_URLS[0],
        "Assembly position: 02",
        "Unfolding Origami by Loren Galese displayed upright beside a stack of paperback copies.",
    )
    source_hero_valid = bool(
        source_hero
        and source_hero.get("destination") == APPROVED_URLS[0]
        and source_hero.get("source_asset")
        == "assets/email/unfolding-origami-launch-hero-corrected.jpg"
        and source_hero.get("alt_text") == overview_hero_contract[3]
    )
    if not source_hero_valid or any(value not in overview for value in overview_hero_contract):
        failures.append("Hero image link is undocumented in 00-CTA-OVERVIEW.md.")

    main_native = manifest.get("native_elements")
    if not isinstance(main_native, list):
        main_native = []
    main_by_id: dict[str, list[dict[str, Any]]] = {}
    for item in main_native:
        if isinstance(item, dict):
            main_by_id.setdefault(str(item.get("id", "")), []).append(item)

    cta_items: list[dict[str, Any]] = []
    if cta_manifest is not None:
        raw_ctas = cta_manifest.get("ctas")
        if not isinstance(raw_ctas, list):
            failures.append("cta-manifest.json field 'ctas' must be an array.")
        else:
            cta_items = [item for item in raw_ctas if isinstance(item, dict)]
        if cta_manifest.get("source") != CTA_SOURCE:
            failures.append("cta-manifest.json source does not name the authoritative newsletter HTML.")
        expected_order = [str(cta["id"]) for cta in EXPECTED_CTAS]
        if cta_manifest.get("approved_order") != expected_order:
            failures.append("CTA manifest approved_order does not match the approved CTA order.")

    cta_by_id: dict[str, list[dict[str, Any]]] = {}
    for item in cta_items:
        cta_by_id.setdefault(str(item.get("id", "")), []).append(item)

    sequence = manifest.get("assembly_sequence")
    assembly_entries = sequence if isinstance(sequence, list) else []
    preview_entries = manifest.get("reference_previews")
    preview_by_filename = {
        str(item.get("filename", "")): item
        for item in (preview_entries if isinstance(preview_entries, list) else [])
        if isinstance(item, dict)
    }
    upload_pieces = manifest.get("upload_pieces")
    raster_text = [
        str(text)
        for piece in (upload_pieces if isinstance(upload_pieces, list) else [])
        if isinstance(piece, dict)
        for text in (piece.get("embedded_text") if isinstance(piece.get("embedded_text"), list) else [])
    ]

    for expected in EXPECTED_CTAS:
        identifier = str(expected["id"])
        label = str(expected["label"])
        destination = str(expected["destination"])
        position = int(expected["sequence_position"])
        cta_file = str(expected["file"])
        reference = str(expected["reference"])

        cta_path = package_dir / cta_file
        if not cta_path.is_file():
            failures.append(f"CTA file is missing: {cta_file}")
            cta_text = ""
        else:
            cta_text = cta_path.read_text(encoding="utf-8")
            required_fragments = (
                f"# CTA {identifier[-2:]} — {label}",
                "## Assembly position",
                "## Placement",
                "## Flodesk block",
                "- Block type: Button",
                f"- Label: `{label}`",
                f"- Destination: `{destination}`",
                "- Desktop height target: 54px",
                "## Mobile behavior",
                "## Build instructions",
                "## Validation",
            )
            for fragment in required_fragments:
                if fragment not in cta_text:
                    failures.append(f"CTA file {cta_file} is missing required content: {fragment}")

        main_matches = main_by_id.get(identifier, [])
        if not main_matches:
            failures.append(f"CTA `{label}` is missing from package-manifest.json.")
        elif len(main_matches) > 1:
            failures.append(f"CTA `{label}` appears more than once in package-manifest.json.")
        else:
            main_item = main_matches[0]
            if main_item.get("label") != label or main_item.get("destination") != destination:
                failures.append(
                    f"CTA `{label}` label or destination differs in package-manifest.json."
                )
            if main_item.get("sequence_position") != position:
                failures.append(
                    f"CTA `{label}` has the wrong sequence position in package-manifest.json."
                )
            validate_cta_geometry(main_item, label, failures)

        cta_matches = cta_by_id.get(identifier, [])
        if not cta_matches:
            failures.append(f"CTA `{label}` is missing from cta-manifest.json.")
        elif len(cta_matches) > 1:
            failures.append(f"CTA `{label}` appears more than once in cta-manifest.json.")
        else:
            item = cta_matches[0]
            item_destination = str(item.get("destination", ""))
            if not item_destination:
                failures.append(f"CTA `{label}` has no destination in cta-manifest.json.")
            if item_destination != destination:
                failures.append(
                    f"CTA `{label}` destination differs from the authoritative newsletter HTML."
                )
            for field, expected_value in (
                ("label", label),
                ("sequence_position", position),
                ("type", "button"),
                ("source", CTA_SOURCE),
                ("cta_file", cta_file),
                ("reference_image", reference),
            ):
                if item.get(field) != expected_value:
                    failures.append(
                        f"CTA `{label}` has an invalid {field} value in cta-manifest.json."
                    )
            for field in ("source_selector", "preceding_element", "following_element"):
                if not item.get(field):
                    failures.append(f"CTA `{label}` is missing {field} in cta-manifest.json.")
            validate_cta_geometry(item, label, failures)

        heading_pattern = re.compile(
            rf"^## Step \d{{2}} — Native CTA: {re.escape(label)}$", re.MULTILINE
        )
        heading_count = len(heading_pattern.findall(sequence_guide))
        if heading_count == 0:
            failures.append(f"CTA `{label}` is missing from the assembly sequence guide.")
        elif heading_count > 1:
            failures.append(
                f"CTA `{label}` appears more than once in the assembly sequence guide."
            )

        assembly_count = sum(
            1
            for entry in assembly_entries
            if isinstance(entry, dict)
            and entry.get("kind") == "native-element"
            and entry.get("reference") == identifier
        )
        if assembly_count == 0:
            failures.append(f"CTA `{label}` is missing from package-manifest.json assembly_sequence.")
        elif assembly_count > 1:
            failures.append(
                f"CTA `{label}` appears more than once in package-manifest.json assembly_sequence."
            )

        reference_path = package_dir / reference
        if not reference_path.is_file():
            failures.append(f"CTA reference image is missing: {reference}")
        else:
            try:
                width, height, _transparent = inspect_png(reference_path)
            except (OSError, ValueError) as error:
                failures.append(f"CTA reference image is not a valid PNG: {reference}: {error}")
            else:
                if (width, height) != CTA_REFERENCE_SIZE:
                    failures.append(f"CTA reference must be exactly 1280x140: {reference}")
                if cta_matches:
                    item = cta_matches[0]
                    if item.get("reference_dimensions") != f"{width}x{height}":
                        failures.append(f"CTA reference dimensions do not match: {reference}")
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
                    actual_hash = hashlib.sha256(reference_path.read_bytes()).hexdigest()
                    if item.get("reference_sha256") != actual_hash:
                        failures.append(f"CTA reference hash does not match: {reference}")
                preview = preview_by_filename.get(reference)
                if not preview or preview.get("reference_only") is not True:
                    failures.append(f"CTA reference is missing from package manifest: {reference}")

        if label in raster_text and (not main_matches or not cta_matches):
            failures.append(
                f"Native CTA `{label}` was rasterized into an upload piece without a corresponding live button."
            )

    if cta_manifest is not None:
        label_counts = Counter(str(item.get("label", "")) for item in cta_items)
        for expected in EXPECTED_CTAS:
            label = str(expected["label"])
            if label_counts[label] > 1 and len(cta_by_id.get(str(expected["id"]), [])) <= 1:
                failures.append(f"CTA `{label}` appears more than once in cta-manifest.json.")

    amazon_item = (cta_by_id.get("cta-04") or [{}])[0]
    stripe_item = (cta_by_id.get("cta-05") or [{}])[0]
    if (
        amazon_item.get("destination") != APPROVED_URLS[0]
        or stripe_item.get("destination") != APPROVED_URLS[2]
        or amazon_item.get("destination") == stripe_item.get("destination")
    ):
        failures.append("Amazon and Stripe CTA routes must remain separate.")
    if not (
        isinstance(amazon_item.get("sequence_position"), int)
        and isinstance(stripe_item.get("sequence_position"), int)
        and amazon_item.get("sequence_position") < stripe_item.get("sequence_position")
    ):
        failures.append(
            "Purchase CTA order is incorrect: Amazon must precede signed-copy Stripe."
        )
    amazon_mobile = amazon_item.get("mobile") if isinstance(amazon_item.get("mobile"), dict) else {}
    stripe_mobile = stripe_item.get("mobile") if isinstance(stripe_item.get("mobile"), dict) else {}
    if amazon_mobile.get("gap_after_px") != 12 or stripe_mobile.get("gap_before_px") != 12:
        failures.append("Purchase CTA mobile spacing must be documented as 12px.")
    amazon_desktop = amazon_item.get("desktop") if isinstance(amazon_item.get("desktop"), dict) else {}
    stripe_desktop = stripe_item.get("desktop") if isinstance(stripe_item.get("desktop"), dict) else {}
    if amazon_desktop.get("height_target_px") != 54 or stripe_desktop.get("height_target_px") != 54:
        failures.append(
            "Approved desktop purchase-button height must be documented as 54px."
        )

    contact_sheet = package_dir / "native-elements/ctas/references/all-ctas-contact-sheet.png"
    if contact_sheet.is_file():
        try:
            inspect_png(contact_sheet)
        except (OSError, ValueError) as error:
            failures.append(f"CTA contact sheet is not a valid PNG: {error}")


def validate_source_files(package_dir: Path, manifest: dict[str, Any], failures: list[str]) -> None:
    sources = manifest.get("source_files")
    if not isinstance(sources, list):
        failures.append("Manifest field 'source_files' must be an array.")
        return
    for source in sources:
        if not isinstance(source, str) or not (package_dir / source).is_file():
            failures.append(f"Manifest source file is missing: {source}")
    source_hashes = manifest.get("source_hashes")
    if not isinstance(source_hashes, dict):
        failures.append("Manifest field 'source_hashes' must be an object.")
        return
    for source in sources:
        if not isinstance(source, str):
            continue
        path = package_dir / source
        expected_hash = str(source_hashes.get(source, ""))
        if not path.is_file():
            continue
        actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        if not expected_hash or actual_hash != expected_hash:
            failures.append(f"Authoritative source hash does not match manifest: {source}")


def validate_package(package_dir: Path | str = DEFAULT_PACKAGE_DIR) -> list[str]:
    package_dir = Path(package_dir)
    failures: list[str] = []
    for relative in REQUIRED_FILES:
        if not (package_dir / relative).is_file():
            failures.append(f"Required file is missing: {relative}")
    for relative in REQUIRED_DIRECTORIES:
        if not (package_dir / relative).is_dir():
            failures.append(f"Required directory is missing: {relative}")

    manifest = load_manifest(package_dir / "package-manifest.json", failures)
    if manifest is None:
        return failures

    checklist = read_text(package_dir / "01-ASSEMBLY-CHECKLIST.md", failures)
    block_map = read_text(package_dir / "02-FLODESK-BLOCK-MAP.md", failures)
    links_guide = read_text(package_dir / "03-LINKS-AND-BUTTONS.md", failures)
    copy_text = read_text(package_dir / "04-COPY-PASTE-TEXT.md", failures)
    inventory = read_text(package_dir / "05-IMAGE-INVENTORY.md", failures)
    sequence_guide = read_text(package_dir / "07-UPLOAD-SEQUENCE.md", failures)
    cta_overview = read_text(
        package_dir / "native-elements/ctas/00-CTA-OVERVIEW.md", failures
    )
    cta_manifest = load_cta_manifest(
        package_dir / "native-elements/ctas/cta-manifest.json", failures
    )
    source_ctas, source_hero = extract_authoritative_contract(
        package_dir / "../launch-newsletter-preview.html", failures
    )
    documents = "\n".join((checklist, block_map, inventory, sequence_guide))
    package_markdown = "\n".join(
        path.read_text(encoding="utf-8") for path in package_dir.glob("*.md")
    )
    canonical_path = package_dir / "../launch-newsletter-copy.md"
    canonical_copy = canonical_path.read_text(encoding="utf-8") if canonical_path.is_file() else ""

    validate_upload_pieces(package_dir, manifest, documents, failures)
    validate_assembly_sequence(manifest, failures)
    validate_references(package_dir, manifest, failures)
    validate_copy(copy_text, canonical_copy, package_markdown, failures)
    validate_links(links_guide, manifest, failures)
    validate_ctas(
        package_dir,
        manifest,
        cta_manifest,
        cta_overview,
        sequence_guide,
        source_ctas,
        source_hero,
        failures,
    )
    validate_source_files(package_dir, manifest, failures)
    return failures


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("package_dir", nargs="?", type=Path, default=DEFAULT_PACKAGE_DIR)
    return parser.parse_args()


def main() -> int:
    failures = validate_package(parse_args().package_dir)
    if failures:
        print(f"FAIL: Flodesk upload package validation found {len(failures)} issue(s)")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("PASS: Flodesk upload package validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
