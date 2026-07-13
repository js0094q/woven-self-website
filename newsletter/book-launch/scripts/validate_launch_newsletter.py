#!/usr/bin/env python3
"""Validate active launch-newsletter copy, links, review safety, and deadline."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


PACKAGE_DIR = Path(__file__).resolve().parent.parent

AMAZON_URL = (
    "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/"
    "dp/B0H7YZ5N28"
)
EXCERPT_URL = "https://wovenself.com/excerpt-unfolding-origami.html"
SIGNED_URL = "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00"
SARAH_URL = "https://alittlebitculty.com/"
REVIEW_ATTRIBUTION = "- Amazon Review"
UNAUTHORIZED_REVIEW_CTA = "Read the Book on Amazon"
REVIEW_EXCERPT = (
    "“What stood out most to me was how the book captures the subtle ways "
    "manipulation and trauma can reshape a person’s identity. Rather than "
    "focusing only on what happened, it explores what it takes to rebuild "
    "trust in yourself afterward.”"
)
HERO_SUBHEADING = (
    "After years of writing, revising, remembering, and unfolding, Unfolding "
    "Origami is now available."
)
INTERIOR_COPY = (
    "Unfolding Origami follows the long aftermath of coercion and trauma: what "
    "happens when fear, loyalty, identity, and survival become tangled "
    "together—and what it takes to begin separating them again.\n\n"
    "This memoir does not present healing as a clean transformation. It follows "
    "the confusion, coping, relapse, sobriety, grief, insight, and gradual return "
    "to self-trust that came afterward."
)
SARAH_ENDORSEMENT = (
    "“Some wounds don’t bleed—they fold you inward. Galese traces that quiet "
    "unraveling and the courageous work of unfolding back into yourself. This "
    "memoir is both a survival guide and a testament to transforming pain into "
    "something fiercely alive and meaningful.”"
)
CHOOSE_COPY = (
    "Order the memoir through Amazon, or reserve a signed paperback directly "
    "from Loren through July 20, 2026."
)
SUPPORT_COPY = (
    "When you have finished reading, an honest review on Amazon would mean a "
    "great deal to me. Reviews help independent books reach readers who may "
    "otherwise never find them.\n\n"
    "You can also support the launch by sharing the book with someone who may "
    "connect with its themes. Every review, recommendation, and conversation "
    "helps this story travel farther."
)
CLOSING_COPY = (
    "Thank you for helping Unfolding Origami move from something I carried "
    "privately into a story that can now be held by other people.\n\n"
    "With gratitude,\n\n"
    "Loren Galese"
)
DEADLINE = "July 20, 2026"
DEADLINE_SENTENCE = "Signed-copy orders are available through July 20, 2026."
DEADLINE_DATE = date(2026, 7, 20)

ACTIVE_COPY_FILES = (
    "launch-newsletter-copy.md",
    "launch-newsletter.txt",
    "launch-newsletter-preview.html",
    "flodesk-build-guide.md",
    "link-map.md",
)
TASK4_ACTIVE_FILES = (
    "launch-newsletter-copy.md",
    "launch-newsletter.txt",
    "link-map.md",
)
TASK5_ACTIVE_FILES = ("launch-newsletter-preview.html",)
TASK6_ACTIVE_FILES = ("flodesk-build-guide.md",)
CONTENT_FILES = (
    "launch-newsletter-copy.md",
    "launch-newsletter.txt",
    "launch-newsletter-preview.html",
)

STALE_PATTERNS = (
    ("B0H27BM8K1", re.compile(r"B0H27BM8K1", re.IGNORECASE)),
    (
        "Read More About the Memoir",
        re.compile(r"Read More About the Memoir", re.IGNORECASE),
    ),
    ("Order a Signed Copy", re.compile(r"Order a Signed Copy", re.IGNORECASE)),
    ("while available", re.compile(r"while available", re.IGNORECASE)),
    # The approved letter contains the exact inflected phrase "preordered a
    # copy". Whole-word matching rejects the stale standalone campaign term
    # without altering or falsely rejecting supplied copy.
    ("preorder", re.compile(r"\bpreorder\b", re.IGNORECASE)),
    ("pre-order", re.compile(r"\bpre-order\b", re.IGNORECASE)),
    ("coming soon", re.compile(r"coming soon", re.IGNORECASE)),
    ("coming July", re.compile(r"coming July", re.IGNORECASE)),
)

ORDERED_CONTENT = (
    "LOREN GALESE, LPC, ACS · AUTHOR",
    "UNFOLDING ORIGAMI: A MEMOIR",
    "The book is officially here.",
    HERO_SUBHEADING,
    "Buy the Book on Amazon",
    "Read an Excerpt",
    "Hi everyone,",
    "Inside Unfolding Origami",
    "Buy the Memoir Now",
    "Sarah Edmondson",
    "READER REVIEW",
    "What readers are saying",
    REVIEW_EXCERPT,
    REVIEW_ATTRIBUTION,
    "Choose Your Copy",
    "Buy on Amazon",
    "Order Your Signed Copy",
    DEADLINE_SENTENCE,
    "One more way to support the book",
    "With gratitude,",
    "Loren Galese",
)

OPENING_LETTER = (
    "Hi everyone,\n\n"
    "I can finally say it: Unfolding Origami is officially here.\n\n"
    "Even more unbelievable, within the first 48 hours of release it became an "
    "Amazon Bestseller, reaching:\n\n"
    "• #26 in Trauma Psychology eBooks\n\n"
    "• #125 in Trauma Psychology Books\n\n"
    "• #151 in Survival Biographies\n\n"
    "The shock still hasn't worn off. I've cried, laughed, sung, and felt scared "
    "all at once.\n\n"
    "This book lived inside me for years, most of the time hidden. Writing it "
    "meant returning to experiences no one should endure, trying to understand "
    "what happened, and finding language for the parts of myself I had folded "
    "away.\n\n"
    "I wanted to take a moment to acknowledge the women who gave me the strength "
    "and support to write this and put it before an editor. Without their gentle "
    "encouragement, this book would not be here today.\n\n"
    "This story erupted from me, demanding to be told, even when I tried to "
    "ignore it.\n\n"
    "Unfolding Origami follows coercive control, sexual assault, sorority "
    "hazing, addiction, dissociation, sobriety, and the long process of learning "
    "to trust yourself after others have distorted your reality.\n\n"
    "It is not a story with a clean before and after. Healing has never looked "
    "that simple in my life. It has been frightening, uneven, painful, and "
    "deeply human.\n\n"
    "Seeing the finished book now is surreal. Something I carried privately for "
    "so long can finally be held by other people.\n\n"
    "To everyone who read an early page, preordered a copy, followed along, "
    "encouraged me, or reminded me why this story mattered—to let my story become "
    "someone else's survival guide—thank you.\n\n"
    "I hope this book reaches someone who needs language for what happened to "
    "them. I hope it helps someone feel less alone. Most of all, I hope it "
    "reminds readers that healing does not have to follow a straight line to be "
    "real.\n\n"
    "Thank you for being here for this moment.\n\n"
    "With gratitude and a full heart,\n\n"
    "Loren"
)

LINK_MAP_ROWS = (
    ("Buy the Book on Amazon", AMAZON_URL),
    ("Read an Excerpt", EXCERPT_URL),
    ("Buy the Memoir Now", AMAZON_URL),
    ("Sarah Edmondson", SARAH_URL),
    ("Buy on Amazon", AMAZON_URL),
    ("Order Your Signed Copy", SIGNED_URL),
)

README_REQUIRED = (
    "f3a271ecb5744e938b5cec10da463f36fb8204ad6f861a809aab8ad3d48d920f",
    "9782e48049538b72eafb98dc1090f2237ae68743ca044e84130120f0b59f0e8e",
    "final-cover-authoritative-pdf.png",
    "1600 × 2560",
    "Accepted quadrilaterals and polygons",
    "Open-book preservation",
    "low-frequency environmental illumination",
    "unfolding-origami-launch-hero-corrected.jpg",
    "pink-butterfly-small.png",
    "pink-butterfly-medium.png",
    "pink-butterfly-pair.png",
    AMAZON_URL,
    EXCERPT_URL,
    SIGNED_URL,
    SARAH_URL,
    DEADLINE_SENTENCE,
    REVIEW_EXCERPT,
    REVIEW_ATTRIBUTION,
    "LOREN GALESE, LPC, ACS · AUTHOR",
    "The authoritative manual Flodesk assembly instructions live in `flodesk-upload-package/` and begin with `00-START-HERE.md`.",
    "The Task 5 HTML preview and numbered Flodesk upload package are current with the post-launch Amazon Bestseller copy.",
    "Desktop and mobile Flodesk test sends are required before any send.",
    "No Flodesk campaign was assembled or sent.",
    "No commit, push, deployment, publication, Flodesk assembly, scheduling, or sending occurred.",
)

URL_RE = re.compile(r"https?://[^\s<>\]\[\)\}\"'`]+")
AMAZON_RE = re.compile(
    r"https?://(?:www\.)?amazon\.com[^\s<>\]\[\)\}\"'`]*", re.I
)
ASSOCIATES_RE = re.compile(r"(?:[?&](?:tag|ascsubtag|linkCode)=|amazon-adsystem)", re.I)
PLACEHOLDER_RE = re.compile(
    r"(?:https?://(?:www\.)?example\.com|href=[\"']#[\"']|\b(?:TODO|TBD)\b|\bREPLACE(?:[_ -]?ME)\b)",
    re.I,
)
FORBIDDEN_REVIEW_RE = re.compile(
    r"(?:verified purchase|reviewed by|reviewer\s*:|customer name\s*:|"
    r"Amazon (?:authored|endorsed|recommends|says|writes|calls))",
    re.I,
)

HERO_IMAGE = "assets/email/unfolding-origami-launch-hero-corrected.jpg"
HERO_ALT = (
    "Unfolding Origami by Loren Galese displayed upright beside a stack of "
    "paperback copies."
)
INTERIOR_IMAGE = "assets/email/unfolding-origami-interior-spread.jpg"
INTERIOR_ALT = (
    "Open pages of Unfolding Origami showing the chapter title “The Devil Lives "
    "Here.”"
)
BUTTERFLY_SOURCES = (
    "assets/decorative/pink-butterfly-small.png",
    "assets/decorative/pink-butterfly-medium.png",
    "assets/decorative/pink-butterfly-small.png",
    "assets/decorative/pink-butterfly-medium.png",
    "assets/decorative/pink-butterfly-small.png",
)
AUTHOR_LINKS = (
    ("Loren Galese Author Instagram", "https://www.instagram.com/lorengaleseauthor/"),
    ("Unfolding Origami book page", "https://wovenself.com/author.html"),
    ("Quiet Alchemy with Loren on Substack", "https://substack.com/@quietalchemywloren"),
    ("The Woven Self website", "https://wovenself.com/"),
)
COMPLIANCE_INSTRUCTION = (
    "Flodesk's native compliance footer must provide the unsubscribe link and "
    "required physical mailing address."
)

FLODESK_GUIDE_HEADINGS = (
    "## 1. Author identifier",
    "## 2. Corrected hero",
    "## 3. Butterfly placement 1 — hero to eyebrow",
    "## 4. Hero eyebrow",
    "## 5. Hero heading",
    "## 6. Hero subheading",
    "## 7. Hero primary CTA",
    "## 8. Hero secondary CTA",
    "## 9. Butterfly placement 2 — hero CTAs to opening letter",
    "## 10. Opening letter",
    "## 11. Butterfly placement 3 — opening letter to interior",
    "## 12. Interior image",
    "## 13. Inside Unfolding Origami",
    "## 14. Interior CTA",
    "## 15. Butterfly placement 4 — interior CTA to Sarah endorsement",
    "## 16. Sarah Edmondson endorsement",
    "## 17. Reader review",
    "## 18. Butterfly placement 5 — reader review to Choose Your Copy",
    "## 19. Choose Your Copy",
    "## 20. Signed-copy deadline",
    "## 21. Final support section",
    "## 22. Closing",
    "## 23. Author links",
    "## 24. Native Flodesk compliance footer",
)
FLODESK_BLOCK_FIELDS = (
    "**Flodesk block type:**",
    "**Exact copy:**",
    "**Asset:**",
    "**Destination:**",
    "**Alignment:**",
    "**Width:**",
    "**Colors:**",
    "**Typography:**",
    "**Spacing:**",
    "**Mobile behavior:**",
)
FLODESK_BUTTERFLY_SPECS = (
    (
        "## 3. Butterfly placement 1 — hero to eyebrow",
        "assets/decorative/pink-butterfly-small.png",
        "24–28 pixels",
        "between the corrected hero and the hero eyebrow",
    ),
    (
        "## 9. Butterfly placement 2 — hero CTAs to opening letter",
        "assets/decorative/pink-butterfly-medium.png",
        "36–44 pixels",
        "between the hero CTAs and the opening letter",
    ),
    (
        "## 11. Butterfly placement 3 — opening letter to interior",
        "assets/decorative/pink-butterfly-small.png",
        "20–28 pixels",
        "between the opening letter and the interior image",
    ),
    (
        "## 15. Butterfly placement 4 — interior CTA to Sarah endorsement",
        "assets/decorative/pink-butterfly-medium.png",
        "28–36 pixels",
        "between the interior CTA and the Sarah Edmondson endorsement",
    ),
    (
        "## 18. Butterfly placement 5 — reader review to Choose Your Copy",
        "assets/decorative/pink-butterfly-small.png",
        "20–28 pixels",
        "between the reader review and Choose Your Copy",
    ),
)
FLODESK_GUIDE_REQUIRED = (
    HERO_IMAGE,
    HERO_ALT,
    INTERIOR_IMAGE,
    INTERIOR_ALT,
    "4–8 pixels above and 4–8 pixels below",
    "alt=\"\"",
    "Do not use a freeform overlay",
    "No butterfly is hidden on mobile in the reference build.",
    "Flodesk may hide only placement 2",
    "Equal 50% desktop columns",
    "equal height and equal padding",
    "Stack vertically at full width with Amazon first and at least 12 pixels between buttons.",
    "DEADLINE_REVIEW_REQUIRED",
    "Desktop and mobile Flodesk test sends are required before any send.",
    "No Flodesk campaign was assembled or sent.",
    COMPLIANCE_INSTRUCTION,
)
FLODESK_FORBIDDEN_ASSETS = (
    "assets/email/unfolding-origami-launch-hero.jpg",
)
FLODESK_INDEX_REQUIRED = (
    "flodesk-upload-package/",
    "flodesk-upload-package/00-START-HERE.md",
    "flodesk-upload-package/01-ASSEMBLY-CHECKLIST.md",
    "flodesk-upload-package/02-FLODESK-BLOCK-MAP.md",
    "flodesk-upload-package/03-LINKS-AND-BUTTONS.md",
    "flodesk-upload-package/04-COPY-PASTE-TEXT.md",
    "flodesk-upload-package/05-IMAGE-INVENTORY.md",
    "flodesk-upload-package/06-FINAL-QA-CHECKLIST.md",
    "flodesk-upload-package/package-manifest.json",
    "flodesk-upload-package/assets/",
    "flodesk-upload-package/reference/",
    "## Historical Notes",
    "Desktop and mobile Flodesk test sends are required before any send.",
    "No remote destination checks are claimed by this local guide.",
    "No Flodesk campaign was assembled or sent",
)


class HTMLAuditParser(HTMLParser):
    """Collect source-level email structure without mutating the document."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[dict[str, Any]] = []
        self.elements: list[dict[str, Any]] = []
        self.text_nodes: list[dict[str, Any]] = []
        self.style_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key: value or "" for key, value in attrs}
        ancestors = tuple(
            {"tag": item["tag"], "attrs": dict(item["attrs"])} for item in self.stack
        )
        element = {
            "tag": tag,
            "attrs": attributes,
            "ancestors": ancestors,
            "text_parts": [],
            "order": len(self.elements),
        }
        self.elements.append(element)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}:
            self.stack.append(element)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if self.stack and self.stack[-1]["tag"] == "style":
            self.style_text.append(data)
        if any(item["tag"] in {"head", "style", "script"} for item in self.stack):
            return
        if not data.strip():
            return
        ancestors = tuple(
            {"tag": item["tag"], "attrs": dict(item["attrs"])} for item in self.stack
        )
        node = {"text": data, "ancestors": ancestors, "order": len(self.text_nodes)}
        self.text_nodes.append(node)
        for item in self.stack:
            item["text_parts"].append(data)


def class_tokens(element: dict[str, Any]) -> set[str]:
    return set(element["attrs"].get("class", "").split())


def element_text(element: dict[str, Any]) -> str:
    return " ".join("".join(element["text_parts"]).split())


def style_declarations(style: str) -> dict[str, str]:
    declarations: dict[str, str] = {}
    for part in style.split(";"):
        if ":" not in part:
            continue
        name, value = part.split(":", 1)
        declarations[name.strip().casefold()] = value.strip().casefold()
    return declarations


def has_ancestor_class(item: dict[str, Any], class_name: str) -> bool:
    return any(
        class_name in ancestor["attrs"].get("class", "").split()
        for ancestor in item["ancestors"]
    )


def validate_html(path: Path, text: str, failures: list[str]) -> None:
    parser = HTMLAuditParser()
    try:
        parser.feed(text)
    except Exception as error:
        add_failure(failures, "HTML_PARSE_ERROR", path, str(error))
        return

    def fail(code: str, detail: str) -> None:
        add_failure(failures, code, path, detail)

    elements = parser.elements
    links = [element for element in elements if element["tag"] == "a"]
    images = [element for element in elements if element["tag"] == "img"]
    visible_text = " ".join(
        " ".join(node["text"].split())
        for node in parser.text_nodes
        if not has_ancestor_class(node, "sr-only")
    )

    butterflies = [
        image for image in images if image["attrs"].get("data-butterfly") == "true"
    ]
    decorative_butterfly_images = [
        image
        for image in images
        if image["attrs"].get("src", "").casefold().startswith("assets/decorative/")
        or "butterfly" in image["attrs"].get("src", "").rsplit("/", 1)[-1].casefold()
    ]
    unmarked_decorative_images = [
        image
        for image in decorative_butterfly_images
        if image["attrs"].get("data-butterfly") != "true"
    ]
    if unmarked_decorative_images:
        fail(
            "HTML_UNMARKED_DECORATIVE_BUTTERFLY",
            ", ".join(image["attrs"].get("src", "<missing src>") for image in unmarked_decorative_images),
        )
    if len(butterflies) != 5:
        fail("HTML_BUTTERFLY_COUNT", f"expected 5, found {len(butterflies)}")
    if tuple(image["attrs"].get("src") for image in butterflies) != BUTTERFLY_SOURCES:
        fail("HTML_BUTTERFLY_SOURCE_SEQUENCE", repr(BUTTERFLY_SOURCES))
    for index, butterfly in enumerate(butterflies, start=1):
        if butterfly["attrs"].get("alt") != "":
            fail("HTML_BUTTERFLY_ALT", f"butterfly {index} must have alt=\"\"")
        presentation_ancestors = [
            ancestor
            for ancestor in butterfly["ancestors"]
            if ancestor["attrs"].get("role") == "presentation"
        ]
        if not presentation_ancestors:
            fail(
                "HTML_BUTTERFLY_PRESENTATION_CONTAINER",
                f"butterfly {index} lacks role=presentation ancestor",
            )
        spacing_container = next(
            (
                ancestor
                for ancestor in reversed(butterfly["ancestors"])
                if "butterfly-row" in ancestor["attrs"].get("class", "").split()
            ),
            None,
        )
        if not spacing_container or spacing_container["attrs"].get("role") != "presentation":
            fail(
                "HTML_BUTTERFLY_PRESENTATION_CONTAINER",
                f"butterfly {index} spacing container must use role=presentation",
            )
        declarations = style_declarations(
            spacing_container["attrs"].get("style", "") if spacing_container else ""
        )
        padding = declarations.get("padding", "")
        if not re.match(r"^[4-8]px(?:\s|$)", padding):
            fail(
                "HTML_BUTTERFLY_SPACING",
                f"butterfly {index} needs 4-8px vertical padding",
            )

    for source, alt, label in (
        (HERO_IMAGE, HERO_ALT, "hero"),
        (INTERIOR_IMAGE, INTERIOR_ALT, "interior"),
    ):
        matches = [image for image in images if image["attrs"].get("src") == source]
        if len(matches) != 1:
            fail("HTML_MEANINGFUL_IMAGE", f"expected one {label} image at {source}")
        elif matches[0]["attrs"].get("alt") != alt:
            fail("HTML_MEANINGFUL_ALT", f"{label} alt must equal {alt!r}")
        elif not all(
            token in matches[0]["attrs"].get("style", "").replace(" ", "").casefold()
            for token in ("width:100%", "height:auto")
        ):
            fail("HTML_RESPONSIVE_IMAGE", f"{label} image needs width:100% and height:auto")

    stars = [node for node in parser.text_nodes if "★★★★★" in node["text"]]
    if not stars or all(has_ancestor_class(node, "sr-only") for node in stars):
        fail("HTML_VISIBLE_RATING", "★★★★★ must be visible")
    accessible_rating = [
        node for node in parser.text_nodes if "5 out of 5 stars" in node["text"]
    ]
    if not accessible_rating or not all(
        has_ancestor_class(node, "sr-only") for node in accessible_rating
    ):
        fail("HTML_ACCESSIBLE_RATING", "rating text must use the sr-only class")

    panels = {
        name: [
            element
            for element in elements
            if name in class_tokens(element) and element["tag"] == "td"
        ]
        for name in ("sarah-panel", "reader-review-panel")
    }
    if len(panels["sarah-panel"]) != 1 or len(panels["reader-review-panel"]) != 1:
        fail("HTML_DISTINCT_REVIEW_PANELS", "Sarah and reader review need separate td panels")
    elif panels["sarah-panel"][0]["order"] >= panels["reader-review-panel"][0]["order"]:
        fail("HTML_REVIEW_PANEL_ORDER", "Sarah panel must precede reader-review panel")
    if any(has_ancestor_class(link, "reader-review-panel") for link in links):
        fail("HTML_READER_REVIEW_CTA", "reader-review panel must not contain links")

    section_markers: dict[str, dict[str, Any]] = {}
    for section in ("eyebrow", "opening-letter", "choose-copy"):
        matches = [
            element
            for element in elements
            if element["attrs"].get("data-section") == section
        ]
        if len(matches) != 1:
            fail(
                "HTML_SECTION_HOOK",
                f"expected one data-section={section!r}, found {len(matches)}",
            )
        else:
            section_markers[section] = matches[0]

    forbidden_tags = sorted(
        {element["tag"] for element in elements if element["tag"] in {"script", "form"}}
    )
    if forbidden_tags:
        fail("HTML_FORBIDDEN_TAG", ", ".join(forbidden_tags))
    if any(
        attribute.casefold().startswith("on")
        or (attribute.casefold() in {"href", "src"} and value.casefold().startswith("javascript:"))
        for element in elements
        for attribute, value in element["attrs"].items()
    ):
        fail("HTML_JAVASCRIPT", "event handler or javascript URL found")
    if any(
        element["tag"] == "link"
        and "stylesheet" in element["attrs"].get("rel", "").casefold()
        for element in elements
    ):
        fail("HTML_EXTERNAL_STYLESHEET", "stylesheet link found")

    css = "\n".join(parser.style_text)
    if re.search(r"tailwind|@import|@font-face", text, re.I):
        fail("HTML_EXTERNAL_STYLE_OR_FONT", "Tailwind/imported stylesheet/web font found")
    if re.search(r"background(?:-image)?\s*:[^;}]*url\s*\(", text, re.I):
        fail("HTML_BACKGROUND_IMAGE", "CSS background image found")
    if re.search(r"float\s*:\s*(?!none\b)[^;}]+", text, re.I):
        fail("HTML_FLOAT", "non-none float found")
    for selector, declarations in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        if re.search(r"position\s*:\s*absolute\b", declarations, re.I):
            selectors = {part.strip() for part in selector.split(",")}
            if selectors != {".sr-only"}:
                fail("HTML_ABSOLUTE_POSITION", selector.strip())
    for element in elements:
        declarations = style_declarations(element["attrs"].get("style", ""))
        if declarations.get("position") == "absolute" and "sr-only" not in class_tokens(element):
            fail("HTML_ABSOLUTE_POSITION", f"inline on <{element['tag']}>")

    shell_tables = [
        element
        for element in elements
        if element["tag"] == "table" and "email-shell" in class_tokens(element)
    ]
    if len(shell_tables) != 1:
        fail("HTML_EMAIL_SHELL", "expected one table.email-shell")
    else:
        shell = shell_tables[0]
        if shell["attrs"].get("width") != "640" or "max-width:640px" not in shell["attrs"].get("style", "").replace(" ", ""):
            fail("HTML_EMAIL_SHELL_WIDTH", "shell must be width=640 and max-width:640px")

    mobile_body = [element for element in elements if "mobile-body" in class_tokens(element)]
    if not mobile_body:
        fail("HTML_BODY_FONT_SIZE", "no mobile-body elements found")
    for element in mobile_body:
        value = style_declarations(element["attrs"].get("style", "")).get("font-size", "")
        match = re.fullmatch(r"([0-9.]+)px", value)
        if not match or float(match.group(1)) < 16:
            fail("HTML_BODY_FONT_SIZE", f"<{element['tag']}> has {value or 'no inline size'}")

    hero_actions = [
        (element_text(link), link["attrs"].get("href"))
        for link in links
        if "hero-action" in class_tokens(link)
    ]
    expected_hero_actions = [
        ("Buy the Book on Amazon", AMAZON_URL),
        ("Read an Excerpt", EXCERPT_URL),
    ]
    if hero_actions != expected_hero_actions:
        fail("HTML_HERO_CTA_ORDER", repr(expected_hero_actions))
    letter_position = visible_text.find("Hi everyone,")
    excerpt_position = visible_text.find("Read an Excerpt")
    if excerpt_position < 0 or letter_position < 0 or excerpt_position >= letter_position:
        fail("HTML_EXCERPT_BEFORE_LETTER", "excerpt CTA must precede opening letter")

    hero_images = [image for image in images if image["attrs"].get("src") == HERO_IMAGE]
    interior_images = [
        image for image in images if image["attrs"].get("src") == INTERIOR_IMAGE
    ]
    interior_ctas = [
        link
        for link in links
        if element_text(link) == "Buy the Memoir Now"
        and link["attrs"].get("href") == AMAZON_URL
    ]
    if (
        len(butterflies) == 5
        and len(hero_images) == 1
        and len(interior_images) == 1
        and len(interior_ctas) == 1
        and len(panels["sarah-panel"]) == 1
        and len(panels["reader-review-panel"]) == 1
        and set(section_markers) == {"eyebrow", "opening-letter", "choose-copy"}
        and len([link for link in links if "hero-action" in class_tokens(link)]) == 2
    ):
        anchor_windows = (
            (
                "hero-to-eyebrow",
                hero_images[0]["order"],
                butterflies[0]["order"],
                section_markers["eyebrow"]["order"],
            ),
            (
                "hero-ctas-to-letter",
                max(
                    link["order"]
                    for link in links
                    if "hero-action" in class_tokens(link)
                ),
                butterflies[1]["order"],
                section_markers["opening-letter"]["order"],
            ),
            (
                "letter-to-interior",
                section_markers["opening-letter"]["order"],
                butterflies[2]["order"],
                interior_images[0]["order"],
            ),
            (
                "interior-cta-to-sarah",
                interior_ctas[0]["order"],
                butterflies[3]["order"],
                panels["sarah-panel"][0]["order"],
            ),
            (
                "reader-review-to-choose-copy",
                panels["reader-review-panel"][0]["order"],
                butterflies[4]["order"],
                section_markers["choose-copy"]["order"],
            ),
        )
        for label, before, butterfly, after in anchor_windows:
            if not before < butterfly < after:
                fail(
                    "HTML_BUTTERFLY_ANCHOR",
                    f"{label} must satisfy {before} < {butterfly} < {after}",
                )

    for destination in (AMAZON_URL, EXCERPT_URL, SIGNED_URL, SARAH_URL):
        if not any(link["attrs"].get("href") == destination for link in links):
            fail("HTML_AUTHORITATIVE_DESTINATION", destination)
    for link in links:
        href = link["attrs"].get("href", "")
        if href.startswith("http"):
            rel = set(link["attrs"].get("rel", "").split())
            if link["attrs"].get("target") != "_blank" or not {"noopener", "noreferrer"}.issubset(rel):
                fail("HTML_EXTERNAL_LINK_SAFETY", href)
    for label, destination in AUTHOR_LINKS:
        if not any(
            element_text(link) == label and link["attrs"].get("href") == destination
            for link in links
        ):
            fail("HTML_AUTHOR_LINK", f"{label} -> {destination}")
    if COMPLIANCE_INSTRUCTION not in visible_text:
        fail("HTML_COMPLIANCE_INSTRUCTION", repr(COMPLIANCE_INSTRUCTION))

    for label, expected in (
        ("HTML_OPENING_LETTER", OPENING_LETTER),
        ("HTML_INTERIOR_COPY", INTERIOR_COPY),
        ("HTML_SUPPORT_COPY", SUPPORT_COPY),
        ("HTML_CLOSING_COPY", CLOSING_COPY),
    ):
        normalized_expected = " ".join(expected.split())
        if normalized_expected not in visible_text:
            fail(label, "approved copy is not present verbatim")
    validate_order(path, visible_text, failures)

    purchase_buttons = [
        element for element in links if "purchase-button" in class_tokens(element)
    ]
    if len(purchase_buttons) != 2:
        fail("HTML_PURCHASE_BUTTONS", f"expected 2, found {len(purchase_buttons)}")
    else:
        signatures = []
        for button in purchase_buttons:
            declarations = style_declarations(button["attrs"].get("style", ""))
            signatures.append(
                (
                    declarations.get("min-height"),
                    declarations.get("padding"),
                    declarations.get("line-height"),
                )
            )
        if signatures[0] != signatures[1]:
            fail("HTML_PURCHASE_BUTTON_EQUALITY", repr(signatures))
    purchase_columns = [
        element
        for element in elements
        if element["tag"] == "td" and "purchase-column" in class_tokens(element)
    ]
    if len(purchase_columns) != 2 or any(
        column["attrs"].get("width") != "50%" for column in purchase_columns
    ):
        fail("HTML_PURCHASE_DESKTOP_WIDTH", "both purchase columns must be width=50%")
    compact_css = re.sub(r"\s+", "", css)
    if not re.search(
        r"@mediaonlyscreenand\(max-width:640px\).*?\.purchase-column\{[^}]*display:block!important;[^}]*padding:0(?:px)?012px!important;[^}]*width:100%!important;",
        compact_css,
        re.S,
    ):
        fail("HTML_PURCHASE_MOBILE_STACK", "mobile columns need full width and 12px spacing")
    if not re.search(
        r"@mediaonlyscreenand\(max-width:640px\).*?\.mobile-button\{[^}]*display:block!important;[^}]*width:100%!important;",
        compact_css,
        re.S,
    ):
        fail("HTML_MOBILE_BUTTON_WIDTH", "mobile buttons must be full width")


def add_failure(failures: list[str], code: str, path: Path, detail: str) -> None:
    failures.append(f"{code}: {path.name}: {detail}")


def read_text(path: Path, failures: list[str]) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        add_failure(failures, "FILE_MISSING", path, "required file does not exist")
        return ""


def stale_hits(text: str) -> list[str]:
    return [label for label, pattern in STALE_PATTERNS if pattern.search(text)]


def validate_common(path: Path, text: str, failures: list[str]) -> None:
    for stale in stale_hits(text):
        add_failure(failures, "STALE_ACTIVE_STRING", path, repr(stale))

    if ASSOCIATES_RE.search(text):
        add_failure(failures, "AMAZON_ASSOCIATES_PARAMETER", path, "affiliate marker found")
    if PLACEHOLDER_RE.search(text):
        add_failure(failures, "PLACEHOLDER_VALUE", path, "placeholder URL or token found")
    if FORBIDDEN_REVIEW_RE.search(text):
        add_failure(
            failures,
            "FORBIDDEN_REVIEW_CLAIM",
            path,
            "reviewer identity, Verified Purchase, or Amazon endorsement wording found",
        )
    if UNAUTHORIZED_REVIEW_CTA in text:
        add_failure(
            failures,
            "UNAUTHORIZED_REVIEW_CTA",
            path,
            repr(UNAUTHORIZED_REVIEW_CTA),
        )

    for url in AMAZON_RE.findall(text):
        if url.rstrip(".,;:") != AMAZON_URL:
            add_failure(failures, "AMAZON_URL_MISMATCH", path, url)


def validate_order(path: Path, text: str, failures: list[str]) -> None:
    cursor = 0
    for token in ORDERED_CONTENT:
        position = text.find(token, cursor)
        if position < 0:
            add_failure(failures, "ORDER_OR_COPY_MISMATCH", path, repr(token))
            return
        cursor = position + len(token)


def validate_content(path: Path, text: str, failures: list[str]) -> None:
    for label, value in (
        ("AMAZON_URL_REQUIRED", AMAZON_URL),
        ("EXCERPT_URL_REQUIRED", EXCERPT_URL),
        ("SIGNED_URL_REQUIRED", SIGNED_URL),
        ("SARAH_URL_REQUIRED", SARAH_URL),
        ("REVIEW_EXCERPT_REQUIRED", REVIEW_EXCERPT),
        ("REVIEW_ATTRIBUTION_REQUIRED", REVIEW_ATTRIBUTION),
        ("DEADLINE_REQUIRED", DEADLINE_SENTENCE),
        ("HERO_SUBHEADING_REQUIRED", HERO_SUBHEADING),
        ("SARAH_ENDORSEMENT_REQUIRED", SARAH_ENDORSEMENT),
        ("VISIBLE_RATING_REQUIRED", "★★★★★"),
        ("ACCESSIBLE_RATING_REQUIRED", "5 out of 5 stars"),
        ("CHOOSE_COPY_REQUIRED", CHOOSE_COPY),
    ):
        if value not in text:
            add_failure(failures, label, path, repr(value))

    if path.suffix in {".md", ".txt"}:
        validate_order(path, text, failures)

    normalized = text.replace("*", "")
    if path.name in {"launch-newsletter-copy.md", "launch-newsletter.txt"}:
        for label, value in (
            ("OPENING_LETTER_MISMATCH", OPENING_LETTER),
            ("INTERIOR_COPY_MISMATCH", INTERIOR_COPY),
            ("SUPPORT_COPY_MISMATCH", SUPPORT_COPY),
            ("CLOSING_COPY_MISMATCH", CLOSING_COPY),
        ):
            if value not in normalized:
                add_failure(
                    failures,
                    label,
                    path,
                    "approved copy is not present verbatim",
                )

    if path.name == "launch-newsletter.txt":
        if re.search(r"butterfl(?:y|ies)|🦋", text, re.I):
            add_failure(
                failures,
                "PLAIN_TEXT_BUTTERFLY_MARKER",
                path,
                "plain text must not contain decorative butterfly markers",
            )


def validate_flodesk_guide(path: Path, text: str, failures: list[str]) -> None:
    for required in FLODESK_INDEX_REQUIRED:
        if required not in text:
            add_failure(
                failures,
                "FLODESK_INDEX_VALUE_REQUIRED",
                path,
                repr(required),
            )

    if re.search(r"^## [0-9]+\. ", text, re.MULTILINE):
        add_failure(
            failures,
            "FLODESK_LEGACY_BLOCKS_PRESENT",
            path,
            "the concise index must not duplicate the superseded 24-block guide",
        )

    package_dir = path.parent / "flodesk-upload-package"
    for relative in (
        "00-START-HERE.md",
        "01-ASSEMBLY-CHECKLIST.md",
        "02-FLODESK-BLOCK-MAP.md",
        "03-LINKS-AND-BUTTONS.md",
        "04-COPY-PASTE-TEXT.md",
        "05-IMAGE-INVENTORY.md",
        "06-FINAL-QA-CHECKLIST.md",
        "package-manifest.json",
        "reference/approved-desktop-preview.png",
        "reference/approved-mobile-preview.png",
    ):
        if not (package_dir / relative).is_file():
            add_failure(
                failures,
                "FLODESK_PACKAGE_FILE_REQUIRED",
                path,
                relative,
            )


def validate_link_map(path: Path, text: str, failures: list[str]) -> None:
    for label, destination in LINK_MAP_ROWS:
        row_re = re.compile(
            rf"^\|[^\n]*{re.escape(label)}[^\n]*{re.escape(destination)}[^\n]*\|$",
            re.MULTILINE,
        )
        if not row_re.search(text):
            add_failure(
                failures,
                "LINK_MAP_ROW_REQUIRED",
                path,
                f"{label} -> {destination}",
            )
    if "hidden-by-link" not in text:
        add_failure(
            failures,
            "EXCERPT_VISIBILITY_NOTE_REQUIRED",
            path,
            "link map must state that the excerpt remains hidden-by-link",
        )


def readme_active_text(text: str) -> str:
    """Return README text excluding explicit legacy-value sections."""
    active_lines: list[str] = []
    excluded_level: int | None = None
    for line in text.splitlines(keepends=True):
        heading = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if heading:
            level = len(heading.group(1))
            title = heading.group(2).strip().casefold()
            if title in {"migration log", "removed legacy values"}:
                excluded_level = level
                continue
            if excluded_level is not None and level <= excluded_level:
                excluded_level = None
        if excluded_level is None:
            active_lines.append(line)
    return "".join(active_lines)


def validate_readme(path: Path, text: str, failures: list[str]) -> None:
    active_text = readme_active_text(text)
    validate_common(path, active_text, failures)
    for value in README_REQUIRED:
        if value not in active_text:
            add_failure(failures, "README_PROVENANCE_REQUIRED", path, repr(value))


def signed_cta_is_active(texts: dict[str, str]) -> bool:
    return any("Order Your Signed Copy" in text and SIGNED_URL in text for text in texts.values())


def validate(files: tuple[str, ...], include_readme: bool) -> list[str]:
    failures: list[str] = []
    texts: dict[str, str] = {}

    for filename in files:
        path = PACKAGE_DIR / filename
        text = read_text(path, failures)
        texts[filename] = text
        validate_common(path, text, failures)
        if filename in CONTENT_FILES:
            validate_content(path, text, failures)
        if filename == "launch-newsletter-preview.html":
            validate_html(path, text, failures)
        if filename == "flodesk-build-guide.md":
            validate_flodesk_guide(path, text, failures)
        if filename == "link-map.md":
            validate_link_map(path, text, failures)

    if include_readme:
        path = PACKAGE_DIR / "README.md"
        text = read_text(path, failures)
        texts[path.name] = text
        validate_readme(path, text, failures)

    if date.today() > DEADLINE_DATE and signed_cta_is_active(texts):
        failures.append(
            "DEADLINE_REVIEW_REQUIRED: signed-copy CTA remains active after 2026-07-20"
        )

    return failures


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--task4-only",
        action="store_true",
        help="validate only Task 4-owned copy, link map, and README",
    )
    mode.add_argument(
        "--task5-only",
        action="store_true",
        help="validate only the Task 5-owned HTML preview",
    )
    mode.add_argument(
        "--task6-only",
        action="store_true",
        help="validate only the Task 6-owned Flodesk build guide",
    )
    mode.add_argument(
        "--check-readme-context",
        action="store_true",
        help="validate README current sections while allowing stale values only in explicit legacy sections",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.check_readme_context:
        failures = validate((), include_readme=True)
        scope = "README context"
    elif args.task4_only:
        failures = validate(TASK4_ACTIVE_FILES, include_readme=True)
        scope = "Task 4"
    elif args.task5_only:
        failures = validate(TASK5_ACTIVE_FILES, include_readme=False)
        scope = "Task 5"
    elif args.task6_only:
        failures = validate(TASK6_ACTIVE_FILES, include_readme=False)
        scope = "Task 6"
    else:
        failures = validate(ACTIVE_COPY_FILES, include_readme=True)
        scope = "full active package"

    if failures:
        print(f"FAIL: {scope} validation found {len(failures)} issue(s)")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PASS: {scope} validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
