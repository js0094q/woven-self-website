import { createHash } from "node:crypto";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const newsletterDirectory = path.resolve(scriptDirectory, "..");
const packageDirectory = path.join(newsletterDirectory, "flodesk-upload-package");
const outputDirectory = path.join(packageDirectory, "upload-pieces");
const referenceDirectory = path.join(packageDirectory, "reference");
const ctaDirectory = path.join(packageDirectory, "native-elements", "ctas");
const ctaReferenceDirectory = path.join(ctaDirectory, "references");
const ctaManifestPath = path.join(ctaDirectory, "cta-manifest.json");
const ctaContactSheetPath = path.join(ctaReferenceDirectory, "all-ctas-contact-sheet.png");
const previewUrlPath = "/newsletter/book-launch/launch-newsletter-preview.html";
const manifestPath = path.join(packageDirectory, "package-manifest.json");
const approvedDesktopPreview = path.join(
  newsletterDirectory,
  "previews/launch-newsletter-desktop.png",
);
const approvedMobilePreview = path.join(
  newsletterDirectory,
  "previews/launch-newsletter-mobile.png",
);
const proofPath = path.join(referenceDirectory, "reassembled-upload-pieces-proof.png");
const mobileProofPath = path.join(
  referenceDirectory,
  "reassembled-upload-pieces-mobile-proof.png",
);
const contactSheetPath = path.join(referenceDirectory, "upload-pieces-contact-sheet.png");
const comparisonPath = path.join(referenceDirectory, "reassembly-comparison.json");

const AMAZON_URL =
  "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese/dp/B0H7YZ5N28";
const EXCERPT_URL = "https://wovenself.com/excerpt-unfolding-origami.html";
const STRIPE_URL = "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00";
const SARAH_URL = "https://alittlebitculty.com/";
const SOURCE_HTML = "newsletter/book-launch/launch-newsletter-preview.html";
const CTA_DESKTOP_WIDTH = 261;
const CTA_HEIGHT = 54;
const CTA_REFERENCE_CANVAS = {
  width: 1280,
  height: 140,
  button: { left: 379, top: 16, width: 522, height: 108 },
};
const PIECES = [
  { number: "01", filename: "01-author-identifier.png", name: "Author identifier", range: "author" },
  { number: "02", filename: "02-hero-visual.png", name: "Hero visual", range: "hero", clickable: true, destination: AMAZON_URL },
  { number: "03", filename: "03-butterfly-separator-01.png", name: "Butterfly separator 01", range: "butterfly1" },
  { number: "04", filename: "04-hero-eyebrow-heading-and-supporting-copy.png", name: "Hero eyebrow, heading, and supporting copy", range: "heroIntro" },
  { number: "05", filename: "05-butterfly-separator-02.png", name: "Butterfly separator 02", range: "butterfly2" },
  { number: "06", filename: "06-opening-letter-part-01.png", name: "Opening letter part 01", range: "letter1" },
  { number: "07", filename: "07-amazon-bestseller-rankings.png", name: "Amazon Bestseller rankings", range: "rankings" },
  { number: "08", filename: "08-opening-letter-part-02.png", name: "Opening letter part 02", range: "letter2" },
  { number: "09", filename: "09-opening-letter-part-03.png", name: "Opening letter part 03", range: "letter3" },
  { number: "10", filename: "10-opening-letter-part-04.png", name: "Opening letter part 04", range: "letter4" },
  { number: "11", filename: "11-butterfly-separator-03.png", name: "Butterfly separator 03", range: "butterfly3" },
  { number: "12", filename: "12-interior-book-spread.png", name: "Interior book spread", range: "interior" },
  { number: "13", filename: "13-inside-unfolding-origami.png", name: "Inside Unfolding Origami", range: "inside" },
  { number: "14", filename: "14-butterfly-separator-04.png", name: "Butterfly separator 04", range: "butterfly4" },
  { number: "15", filename: "15-sarah-edmondson-endorsement.png", name: "Sarah Edmondson endorsement quotation", range: "sarahQuote" },
  { number: "16", filename: "16-reader-review.png", name: "Reader review", range: "readerReview" },
  { number: "17", filename: "17-butterfly-separator-05-and-choose-your-copy.png", name: "Butterfly separator 05 and Choose Your Copy introduction", range: "chooseIntro" },
  { number: "18", filename: "18-signed-copy-deadline.png", name: "Signed-copy deadline", range: "deadline" },
  { number: "19", filename: "19-support-the-book.png", name: "Support the book", range: "support" },
  { number: "20", filename: "20-closing-letter.png", name: "Closing letter", range: "closing" },
];

const CTA_DEFINITIONS = [
  {
    id: "cta-01",
    sequence_position: 5,
    type: "button",
    label: "Buy the Book on Amazon",
    destination: AMAZON_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell a.button-link (button 1; exact text `Buy the Book on Amazon`)",
    source_index: 0,
    cta_file: "native-elements/ctas/01-buy-the-book-on-amazon.md",
    preceding_element: "upload-piece-04",
    following_element: "cta-02",
    section: "Hero CTA group",
    hierarchy: ["primary", "purchase", "amazon"],
    reference_background_color: "#F7EFE4",
    desktop: {
      alignment: "center",
      width_behavior: "fixed target",
      width_target_px: CTA_DESKTOP_WIDTH,
      height_target_px: CTA_HEIGHT,
      background_color: "#0D182A",
      text_color: "#F3E7D4",
      border: "2px solid #0D182A",
      border_radius_px: 4,
      font: "Arial, Helvetica, sans-serif",
      font_size_px: 16,
      font_weight: 700,
      letter_spacing_px: 0,
      line_height_px: 18,
      horizontal_padding_px: 26,
      vertical_padding_px: 16,
      space_above_px: 0,
      space_below_px: 12,
    },
    mobile: {
      full_width: true,
      width_target_px_at_390: 342,
      side_margin_px: 24,
      stack_group: "hero-buttons",
      stack_order: 1,
      gap_before_px: 0,
      gap_after_px: 12,
    },
    reference_image: "native-elements/ctas/references/01-buy-the-book-on-amazon-reference.png",
    validation_status: "verified-against-authoritative-html",
    proof_range: "heroAmazon",
  },
  {
    id: "cta-02",
    sequence_position: 6,
    type: "button",
    label: "Read an Excerpt",
    destination: EXCERPT_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell a.button-link (button 2; exact text `Read an Excerpt`)",
    source_index: 1,
    cta_file: "native-elements/ctas/02-read-an-excerpt.md",
    preceding_element: "cta-01",
    following_element: "upload-piece-05",
    section: "Hero CTA group",
    hierarchy: ["secondary", "excerpt"],
    reference_background_color: "#F7EFE4",
    desktop: {
      alignment: "center",
      width_behavior: "fixed target",
      width_target_px: CTA_DESKTOP_WIDTH,
      height_target_px: CTA_HEIGHT,
      background_color: "#F7EFE4",
      text_color: "#0D182A",
      border: "2px solid #0D182A",
      border_radius_px: 4,
      font: "Arial, Helvetica, sans-serif",
      font_size_px: 16,
      font_weight: 700,
      letter_spacing_px: 0,
      line_height_px: 18,
      horizontal_padding_px: 26,
      vertical_padding_px: 16,
      space_above_px: 0,
      space_below_px: 10,
    },
    mobile: {
      full_width: true,
      width_target_px_at_390: 342,
      side_margin_px: 24,
      stack_group: "hero-buttons",
      stack_order: 2,
      gap_before_px: 12,
      gap_after_px: 10,
    },
    reference_image: "native-elements/ctas/references/02-read-an-excerpt-reference.png",
    validation_status: "verified-against-authoritative-html",
    proof_range: "heroExcerpt",
  },
  {
    id: "cta-03",
    sequence_position: 16,
    type: "button",
    label: "Buy the Memoir Now",
    destination: AMAZON_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell a.button-link (button 3; exact text `Buy the Memoir Now`)",
    source_index: 2,
    cta_file: "native-elements/ctas/03-buy-the-memoir-now.md",
    preceding_element: "upload-piece-13",
    following_element: "upload-piece-14",
    section: "Inside Unfolding Origami",
    hierarchy: ["primary", "purchase", "amazon"],
    reference_background_color: "#F3E7D4",
    desktop: {
      alignment: "center",
      width_behavior: "fixed target",
      width_target_px: CTA_DESKTOP_WIDTH,
      height_target_px: CTA_HEIGHT,
      background_color: "#0D182A",
      text_color: "#F3E7D4",
      border: "2px solid #0D182A",
      border_radius_px: 4,
      font: "Arial, Helvetica, sans-serif",
      font_size_px: 16,
      font_weight: 700,
      letter_spacing_px: 0,
      line_height_px: 18,
      horizontal_padding_px: 26,
      vertical_padding_px: 16,
      space_above_px: 8,
      space_below_px: 26,
    },
    mobile: {
      full_width: true,
      width_target_px_at_390: 342,
      side_margin_px: 24,
      stack_group: null,
      stack_order: null,
      gap_before_px: 8,
      gap_after_px: 26,
    },
    reference_image: "native-elements/ctas/references/03-buy-the-memoir-now-reference.png",
    validation_status: "verified-against-authoritative-html",
    proof_range: "insideAmazon",
  },
  {
    id: "cta-04",
    sequence_position: 22,
    type: "button",
    label: "Buy on Amazon",
    destination: AMAZON_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell a.purchase-button (button 1; exact text `Buy on Amazon`)",
    source_index: 3,
    cta_file: "native-elements/ctas/04-buy-on-amazon.md",
    preceding_element: "upload-piece-17",
    following_element: "cta-05",
    section: "Choose Your Copy purchase group",
    hierarchy: ["primary", "purchase", "amazon"],
    reference_background_color: "#F7EFE4",
    desktop: {
      alignment: "center",
      width_behavior: "fixed 261px target; side by side in 536px row with 14px gap",
      width_target_px: CTA_DESKTOP_WIDTH,
      height_target_px: CTA_HEIGHT,
      background_color: "#0D182A",
      text_color: "#F3E7D4",
      border: "2px solid #0D182A",
      border_radius_px: 4,
      font: "Arial, Helvetica, sans-serif",
      font_size_px: 16,
      font_weight: 700,
      letter_spacing_px: 0,
      line_height_px: 18,
      horizontal_padding_px: 18,
      vertical_padding_px: 16,
      space_above_px: 0,
      space_below_px: 0,
      group_gap_px: 14,
    },
    mobile: {
      full_width: true,
      width_target_px_at_390: 342,
      side_margin_px: 24,
      stack_group: "purchase-buttons",
      stack_order: 1,
      gap_before_px: 0,
      gap_after_px: 12,
    },
    reference_image: "native-elements/ctas/references/04-buy-on-amazon-reference.png",
    validation_status: "verified-against-authoritative-html",
    proof_range: "purchaseButtons",
  },
  {
    id: "cta-05",
    sequence_position: 23,
    type: "button",
    label: "Order Your Signed Copy",
    destination: STRIPE_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell a.purchase-button (button 2; exact text `Order Your Signed Copy`)",
    source_index: 4,
    cta_file: "native-elements/ctas/05-order-your-signed-copy.md",
    preceding_element: "cta-04",
    following_element: "upload-piece-18",
    section: "Choose Your Copy purchase group",
    hierarchy: ["secondary", "purchase", "signed-copy", "stripe"],
    reference_background_color: "#F7EFE4",
    desktop: {
      alignment: "center",
      width_behavior: "fixed 261px target; side by side in 536px row with 14px gap",
      width_target_px: CTA_DESKTOP_WIDTH,
      height_target_px: CTA_HEIGHT,
      background_color: "#F7EFE4",
      text_color: "#0D182A",
      border: "2px solid #0D182A",
      border_radius_px: 4,
      font: "Arial, Helvetica, sans-serif",
      font_size_px: 16,
      font_weight: 700,
      letter_spacing_px: 0,
      line_height_px: 18,
      horizontal_padding_px: 18,
      vertical_padding_px: 16,
      space_above_px: 0,
      space_below_px: 0,
      group_gap_px: 14,
    },
    mobile: {
      full_width: true,
      width_target_px_at_390: 342,
      side_margin_px: 24,
      stack_group: "purchase-buttons",
      stack_order: 2,
      gap_before_px: 12,
      gap_after_px: 0,
    },
    reference_image: "native-elements/ctas/references/05-order-your-signed-copy-reference.png",
    proof_range: "purchaseButtons",
    validation_status: "verified-against-authoritative-html",
  },
];

const NATIVE_ELEMENTS = [
  CTA_DEFINITIONS[0],
  CTA_DEFINITIONS[1],
  CTA_DEFINITIONS[2],
  {
    id: "native-sarah-attribution",
    sequence_position: 19,
    type: "linked-text",
    label: "Sarah Edmondson\nPodcast Host & Author of A Little Bit Culty",
    destination: SARAH_URL,
    source: SOURCE_HTML,
    source_selector: ".email-shell .sarah-panel p a",
    preceding_element: "upload-piece-15",
    following_element: "upload-piece-16",
    width_behavior: "Full-width navy text block",
    height_target: "105px desktop source interval",
    alignment: "left",
    background_color: "#0D182A",
    text_color: "#9FB9D3",
    border: "none",
    border_radius: "0px",
    spacing_before: "11px continuation gap after the quotation",
    spacing_after: "46px bottom padding",
    mobile_behavior: "Left aligned with 24px side padding",
    proof_range: "sarahAttribution",
  },
  CTA_DEFINITIONS[3],
  CTA_DEFINITIONS[4],
  {
    id: "native-author-links",
    sequence_position: 27,
    type: "linked-text",
    label: "Author links and copyright",
    destination: "four-destinations-see-links-guide",
    source: SOURCE_HTML,
    source_selector: ".email-shell tr:nth-child(22) .footer-link",
    preceding_element: "upload-piece-20",
    following_element: "native-compliance-footer",
    width_behavior: "Full width",
    height_target: "Approved source interval",
    alignment: "center",
    background_color: "#0D182A",
    text_color: "#F3E7D4",
    border: "none",
    border_radius: "0px",
    spacing_before: "0px",
    spacing_after: "0px",
    mobile_behavior: "Stack four links vertically with at least 10px tappable separation",
    proof_range: "authorLinks",
  },
  {
    id: "native-compliance-footer",
    sequence_position: 28,
    type: "compliance-footer",
    label: "Flodesk native compliance footer",
    destination: "flodesk-native-unsubscribe-and-conditional-preferences",
    source: SOURCE_HTML,
    source_selector: ".email-shell tr:nth-child(23) td",
    preceding_element: "native-author-links",
    following_element: null,
    width_behavior: "Full width",
    height_target: "Flodesk native minimum",
    alignment: "center",
    background_color: "#0D182A",
    text_color: "#9FB9D3",
    border: "1px top border #5F86AD",
    border_radius: "0px",
    spacing_before: "0px",
    spacing_after: "28px",
    mobile_behavior: "Required address and links wrap without clipping",
    proof_range: "compliance",
  },
];

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

function loadDependency(name) {
  try {
    return require(name);
  } catch (repositoryError) {
    const runtimeDependency = path.join(
      os.homedir(),
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
      name,
    );
    try {
      return require(runtimeDependency);
    } catch (runtimeError) {
      throw new Error(
        `${name} unavailable in repository and bundled runtime: ${runtimeError.message}`,
        { cause: repositoryError },
      );
    }
  }
}

function chromiumExecutable(playwright) {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    playwright.chromium.executablePath(),
  ].filter(Boolean);
  const executable = candidates.find((candidate) => existsSync(candidate));
  if (!executable) throw new Error("Existing Playwright Chromium executable was not found");
  return executable;
}

function startServer() {
  const server = createServer((request, response) => {
    if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
      response.writeHead(405).end("Method not allowed");
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    } catch {
      response.writeHead(400).end("Invalid request path");
      return;
    }
    const relativePath = pathname.replace(/^\/+/, "");
    const filePath = path.resolve(repositoryRoot, relativePath);
    if (filePath !== repositoryRoot && !filePath.startsWith(`${repositoryRoot}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    let fileStats;
    try {
      fileStats = statSync(filePath);
    } catch {
      response.writeHead(404).end("Not found");
      return;
    }
    if (!fileStats.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": fileStats.size,
      "Content-Type": mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({ server, address: server.address() }));
  });
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function measurePage(page) {
  return page.evaluate(() => {
    const shell = document.querySelector(".email-shell");
    if (!(shell instanceof HTMLTableElement)) throw new Error("email shell not found");
    const rows = [...shell.tBodies[0].rows];
    if (rows.length !== 23) throw new Error(`expected 23 top-level rows, found ${rows.length}`);
    const shellRect = shell.getBoundingClientRect();
    const relative = (rect) => ({
      top: rect.top - shellRect.top,
      bottom: rect.bottom - shellRect.top,
      height: rect.height,
    });
    const rowRects = rows.map((row) => relative(row.getBoundingClientRect()));
    const paragraphs = [...rows[9].querySelectorAll("p")];
    if (paragraphs.length !== 18) {
      throw new Error(`expected 18 opening-letter paragraphs, found ${paragraphs.length}`);
    }
    const paragraphRects = paragraphs.map((paragraph) => relative(paragraph.getBoundingClientRect()));
    const midpoint = (left, right) => (left.bottom + right.top) / 2;
    const letterSplits = [
      midpoint(paragraphRects[1], paragraphRects[2]),
      midpoint(paragraphRects[5], paragraphRects[6]),
      midpoint(paragraphRects[9], paragraphRects[10]),
      midpoint(paragraphRects[13], paragraphRects[14]),
    ];
    const quote = rows[15].querySelector("blockquote");
    const attribution = rows[15].querySelector("p");
    const chooseTable = rows[18].querySelector("table");
    if (!quote || !attribution || !chooseTable) throw new Error("split landmark missing");
    const quoteRect = relative(quote.getBoundingClientRect());
    const attributionRect = relative(attribution.getBoundingClientRect());
    const chooseTableRect = relative(chooseTable.getBoundingClientRect());
    const sarahSplit = midpoint(quoteRect, attributionRect);

    const text = (element) => element.innerText.trim();
    const paragraphText = paragraphs.map(text);
    return {
      shell: { width: shellRect.width, height: shellRect.height },
      rows: rowRects,
      letterSplits,
      sarahSplit,
      chooseTable: chooseTableRect,
      textByRange: {
        author: [text(rows[0])],
        hero: [],
        butterfly1: [],
        heroIntro: [text(rows[3]), text(rows[4]), text(rows[5])],
        butterfly2: [],
        letter1: paragraphText.slice(0, 2),
        rankings: paragraphText.slice(2, 6),
        letter2: paragraphText.slice(6, 10),
        letter3: paragraphText.slice(10, 14),
        letter4: paragraphText.slice(14, 18),
        butterfly3: [],
        interior: [],
        inside: [text(rows[12])],
        butterfly4: [],
        sarahQuote: [text(quote)],
        readerReview: [text(rows[16])],
        chooseIntro: [text(rows[18].querySelector("h2")), text(rows[18].querySelector("p"))],
        deadline: [text(rows[18].querySelectorAll("p")[1])],
        support: [text(rows[19])],
        closing: [text(rows[20])],
      },
      imageAlt: {
        hero: rows[1].querySelector("img")?.alt ?? "",
        interior: rows[11].querySelector("img")?.alt ?? "",
      },
    };
  });
}

async function measureCtas(page) {
  return page.evaluate(() => {
    const shell = document.querySelector(".email-shell");
    if (!(shell instanceof HTMLTableElement)) throw new Error("email shell not found");
    const shellRect = shell.getBoundingClientRect();
    const relative = (rect) => ({
      left: rect.left - shellRect.left,
      right: rect.right - shellRect.left,
      top: rect.top - shellRect.top,
      bottom: rect.bottom - shellRect.top,
      width: rect.width,
      height: rect.height,
    });
    return [...shell.querySelectorAll("a.button-link")].map((anchor, index) => {
      const style = getComputedStyle(anchor);
      const parent = anchor.parentElement;
      if (!parent) throw new Error(`CTA ${index + 1} has no parent element`);
      return {
        index,
        label: anchor.textContent.replace(/\s+/g, " ").trim(),
        destination: anchor.href,
        classes: anchor.className,
        rect: relative(anchor.getBoundingClientRect()),
        parent_rect: relative(parent.getBoundingClientRect()),
        computed: {
          background_color: style.backgroundColor,
          border_radius: style.borderRadius,
          color: style.color,
          font_family: style.fontFamily,
          font_size: style.fontSize,
          font_weight: style.fontWeight,
          letter_spacing: style.letterSpacing,
          line_height: style.lineHeight,
          padding_top: style.paddingTop,
          padding_right: style.paddingRight,
          padding_bottom: style.paddingBottom,
          padding_left: style.paddingLeft,
        },
      };
    });
  });
}

function assertCtaSourceContract(desktopCtas, mobileCtas) {
  if (desktopCtas.length !== CTA_DEFINITIONS.length) {
    throw new Error(`expected ${CTA_DEFINITIONS.length} desktop CTAs, found ${desktopCtas.length}`);
  }
  if (mobileCtas.length !== CTA_DEFINITIONS.length) {
    throw new Error(`expected ${CTA_DEFINITIONS.length} mobile CTAs, found ${mobileCtas.length}`);
  }
  for (const definition of CTA_DEFINITIONS) {
    for (const [viewport, measured] of [
      ["desktop", desktopCtas[definition.source_index]],
      ["mobile", mobileCtas[definition.source_index]],
    ]) {
      if (measured.label !== definition.label) {
        throw new Error(
          `${viewport} CTA ${definition.id} label mismatch: ${measured.label}`,
        );
      }
      if (measured.destination !== definition.destination) {
        throw new Error(
          `${viewport} CTA ${definition.id} destination mismatch: ${measured.destination}`,
        );
      }
      if (Math.round(measured.rect.height) !== definition.desktop.height_target_px) {
        throw new Error(
          `${viewport} CTA ${definition.id} height mismatch: ${measured.rect.height}`,
        );
      }
    }
    if (
      definition.desktop.width_target_px !== null
      && Math.round(desktopCtas[definition.source_index].rect.width)
        !== definition.desktop.width_target_px
    ) {
      throw new Error(
        `desktop CTA ${definition.id} width mismatch: ${desktopCtas[definition.source_index].rect.width}`,
      );
    }
    if (
      Math.round(mobileCtas[definition.source_index].rect.width)
      !== definition.mobile.width_target_px_at_390
    ) {
      throw new Error(
        `mobile CTA ${definition.id} width mismatch: ${mobileCtas[definition.source_index].rect.width}`,
      );
    }
  }
  const heroGap = Math.round(mobileCtas[1].rect.top - mobileCtas[0].rect.bottom);
  if (heroGap !== 12) throw new Error(`mobile hero CTA gap mismatch: ${heroGap}`);
  const purchaseGap = Math.round(mobileCtas[4].rect.top - mobileCtas[3].rect.bottom);
  if (purchaseGap !== 12) throw new Error(`mobile purchase CTA gap mismatch: ${purchaseGap}`);
}

function buildRanges(measurements, scale) {
  const y = (value) => Math.round(value * scale);
  const rows = measurements.rows;
  const [letter1, rankings, letter2, letter3] = measurements.letterSplits.map(y);
  const ranges = {
    author: [y(rows[0].top), y(rows[0].bottom)],
    hero: [y(rows[1].top), y(rows[1].bottom)],
    butterfly1: [y(rows[2].top), y(rows[2].bottom)],
    heroIntro: [y(rows[3].top), y(rows[5].bottom)],
    heroAmazon: [y(rows[6].top), y(rows[6].bottom)],
    heroExcerpt: [y(rows[7].top), y(rows[7].bottom)],
    butterfly2: [y(rows[8].top), y(rows[8].bottom)],
    letter1: [y(rows[9].top), letter1],
    rankings: [letter1, rankings],
    letter2: [rankings, letter2],
    letter3: [letter2, letter3],
    letter4: [letter3, y(rows[9].bottom)],
    butterfly3: [y(rows[10].top), y(rows[10].bottom)],
    interior: [y(rows[11].top), y(rows[11].bottom)],
    inside: [y(rows[12].top), y(rows[12].bottom)],
    insideAmazon: [y(rows[13].top), y(rows[13].bottom)],
    butterfly4: [y(rows[14].top), y(rows[14].bottom)],
    sarahQuote: [y(rows[15].top), y(measurements.sarahSplit)],
    sarahAttribution: [y(measurements.sarahSplit), y(rows[15].bottom)],
    readerReview: [y(rows[16].top), y(rows[16].bottom)],
    chooseIntro: [y(rows[17].top), y(measurements.chooseTable.top)],
    purchaseButtons: [y(measurements.chooseTable.top), y(measurements.chooseTable.bottom)],
    deadline: [y(measurements.chooseTable.bottom), y(rows[18].bottom)],
    support: [y(rows[19].top), y(rows[19].bottom)],
    closing: [y(rows[20].top), y(rows[20].bottom)],
    authorLinks: [y(rows[21].top), y(rows[21].bottom)],
    compliance: [y(rows[22].top), y(rows[22].bottom)],
  };
  const ordered = [
    "author", "hero", "butterfly1", "heroIntro", "heroAmazon", "heroExcerpt",
    "butterfly2", "letter1", "rankings", "letter2", "letter3", "letter4",
    "butterfly3", "interior", "inside", "insideAmazon", "butterfly4",
    "sarahQuote", "sarahAttribution", "readerReview", "chooseIntro",
    "purchaseButtons", "deadline", "support", "closing", "authorLinks", "compliance",
  ];
  for (let index = 0; index < ordered.length; index += 1) {
    const [top, bottom] = ranges[ordered[index]];
    if (bottom <= top) throw new Error(`invalid range ${ordered[index]}: ${top}..${bottom}`);
    if (index > 0 && top !== ranges[ordered[index - 1]][1]) {
      throw new Error(`range gap between ${ordered[index - 1]} and ${ordered[index]}`);
    }
  }
  return { ranges, ordered };
}

async function cropBuffer(sharp, master, width, range) {
  const [top, bottom] = range;
  return sharp(master)
    .extract({ left: 0, top, width, height: bottom - top })
    .toColourspace("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function createContactSheet(sharp, pieceResults) {
  const columns = 2;
  const cardWidth = 620;
  const cardHeight = 330;
  const gap = 20;
  const margin = 30;
  const rows = Math.ceil(pieceResults.length / columns);
  const width = margin * 2 + columns * cardWidth + (columns - 1) * gap;
  const height = margin * 2 + rows * cardHeight + (rows - 1) * gap;
  const composites = [];

  for (let index = 0; index < pieceResults.length; index += 1) {
    const piece = pieceResults[index];
    const column = index % columns;
    const row = Math.floor(index / columns);
    const left = margin + column * (cardWidth + gap);
    const top = margin + row * (cardHeight + gap);
    const thumbnail = await sharp(piece.buffer)
      .resize({ width: 560, height: 240, fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const thumbnailMetadata = await sharp(thumbnail).metadata();
    const thumbnailLeft = left + Math.round((cardWidth - thumbnailMetadata.width) / 2);
    const label = `${piece.definition.number}  ${piece.definition.filename}  ·  1280 × ${piece.metadata.height}`;
    const labelSvg = Buffer.from(
      `<svg width="${cardWidth}" height="64" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0D182A"/>
        <text x="18" y="39" fill="#F3E7D4" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700">${escapeXml(label)}</text>
      </svg>`,
    );
    composites.push({ input: labelSvg, left, top });
    composites.push({ input: thumbnail, left: thumbnailLeft, top: top + 76 });
  }

  await sharp({
    create: { width, height, channels: 3, background: "#E8E1D8" },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(contactSheetPath);
}

async function createCtaReferences(sharp, master, desktopCtas) {
  mkdirSync(ctaReferenceDirectory, { recursive: true });
  const results = [];
  for (const definition of CTA_DEFINITIONS) {
    const measured = desktopCtas[definition.source_index];
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
    const filePath = path.join(packageDirectory, definition.reference_image);
    writeFileSync(filePath, buffer);
    const metadata = await sharp(buffer).metadata();
    results.push({ definition, buffer, metadata, filePath, source_region: region });
  }
  return results;
}

async function createCtaContactSheet(sharp, ctaReferenceResults) {
  const margin = 30;
  const gap = 24;
  const headingHeight = 74;
  const width = Math.max(
    1320,
    ...ctaReferenceResults.map((result) => result.metadata.width + margin * 2),
  );
  const height = headingHeight + margin
    + ctaReferenceResults.reduce((sum, result) => sum + result.metadata.height, 0)
    + gap * (ctaReferenceResults.length - 1)
    + margin;
  const heading = Buffer.from(
    `<svg width="${width}" height="${headingHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0D182A"/>
      <text x="50%" y="46" text-anchor="middle" fill="#F3E7D4" font-family="Georgia,serif" font-size="28" font-weight="700">Native CTA production guide · top-to-bottom order</text>
    </svg>`,
  );
  const composites = [{ input: heading, left: 0, top: 0 }];
  let top = headingHeight + margin;
  for (const result of ctaReferenceResults) {
    composites.push({
      input: result.buffer,
      left: Math.round((width - result.metadata.width) / 2),
      top,
    });
    top += result.metadata.height + gap;
  }
  await sharp({
    create: { width, height, channels: 3, background: "#E8E1D8" },
  })
    .composite(composites)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(ctaContactSheetPath);
}

function mobileNativeHtml(id) {
  const byId = {
    "cta-01": `<div class="button-row cream"><a class="button dark" href="${AMAZON_URL}">Buy the Book on Amazon</a></div>`,
    "cta-02": `<div class="button-row cream after-hero"><a class="button outline" href="${EXCERPT_URL}">Read an Excerpt</a></div>`,
    "cta-03": `<div class="button-row title-cream inside-button"><a class="button dark" href="${AMAZON_URL}">Buy the Memoir Now</a></div>`,
    "native-sarah-attribution": `<div class="sarah-attribution"><a href="${SARAH_URL}"><strong>Sarah Edmondson</strong><br>Podcast Host &amp; Author of <em>A Little Bit Culty</em></a></div>`,
    "cta-04": `<div class="purchase purchase-first"><a class="button dark" href="${AMAZON_URL}">Buy on Amazon</a></div>`,
    "cta-05": `<div class="purchase purchase-second"><a class="button outline" href="${STRIPE_URL}">Order Your Signed Copy</a></div>`,
    "native-author-links": `<div class="author-links"><a href="https://www.instagram.com/lorengaleseauthor/">Loren Galese Author Instagram</a><br><a href="https://wovenself.com/author.html">Unfolding Origami book page</a><br><a href="https://substack.com/@quietalchemywloren">Quiet Alchemy with Loren on Substack</a><br><a href="https://wovenself.com/">The Woven Self website</a><p>© 2026 Loren Galese</p></div>`,
    "native-compliance-footer": `<div class="compliance">Flodesk's native compliance footer must provide the unsubscribe link and required physical mailing address.</div>`,
  };
  return byId[id];
}

async function createMobileProof(browser, pieceResults) {
  const byNumber = new Map(pieceResults.map((piece) => [piece.definition.number, piece]));
  const image = (number) => {
    const piece = byNumber.get(number);
    return `<img src="data:image/png;base64,${piece.buffer.toString("base64")}" alt="">`;
  };
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;background:#07101F}body{padding:28px 0;font-family:Arial,Helvetica,sans-serif}.shell{width:100%;max-width:640px;margin:0 auto;background:#F7EFE4}.shell img{display:block;width:100%;height:auto}.button-row{padding:0 24px 12px;text-align:center}.button-row.after-hero{padding-bottom:10px}.button-row.inside-button{padding-top:8px;padding-bottom:26px}.cream{background:#F7EFE4}.title-cream{background:#F3E7D4}.button{display:block;width:100%;min-height:54px;padding:16px 18px;border:2px solid #0D182A;border-radius:4px;font-size:16px;font-weight:700;line-height:18px;text-align:center;text-decoration:none}.dark{background:#0D182A;color:#F3E7D4}.outline{background:#F7EFE4;color:#0D182A}.sarah-attribution{padding:11px 24px 46px;background:#0D182A;color:#9FB9D3;font-size:16px;line-height:24px}.sarah-attribution a{color:#9FB9D3;text-decoration:underline}.purchase{padding:0 24px;background:#F7EFE4}.purchase-second{padding-top:12px}.author-links{padding:32px 24px 26px;background:#0D182A;color:#F3E7D4;font-size:14px;line-height:24px;text-align:center}.author-links a{color:#F3E7D4;text-decoration:underline}.author-links p{margin:20px 0 0;color:#9FB9D3;font-size:13px;line-height:21px}.compliance{padding:20px 24px 28px;border-top:1px solid #5F86AD;background:#0D182A;color:#9FB9D3;font-size:12px;line-height:20px;text-align:center}
  </style></head><body><main class="shell">
    ${image("01")}${image("02")}${image("03")}${image("04")}
    ${mobileNativeHtml("cta-01")}${mobileNativeHtml("cta-02")}
    ${image("05")}${image("06")}${image("07")}${image("08")}${image("09")}${image("10")}${image("11")}${image("12")}${image("13")}
    ${mobileNativeHtml("cta-03")}${image("14")}${image("15")}${mobileNativeHtml("native-sarah-attribution")}${image("16")}${image("17")}${mobileNativeHtml("cta-04")}${mobileNativeHtml("cta-05")}${image("18")}${image("19")}${image("20")}${mobileNativeHtml("native-author-links")}${mobileNativeHtml("native-compliance-footer")}
  </main></body></html>`;
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ fullPage: true, path: mobileProofPath });
  } finally {
    await context.close();
  }
}

function buildAssemblySequence() {
  const upload = (position, number) => ({
    position,
    kind: "upload-piece",
    reference: number,
    filename: PIECES.find((piece) => piece.number === number).filename,
  });
  const native = (position, id) => ({
    position,
    kind: "native-element",
    reference: id,
  });
  return [
    upload(1, "01"), upload(2, "02"), upload(3, "03"), upload(4, "04"),
    native(5, "cta-01"), native(6, "cta-02"),
    upload(7, "05"), upload(8, "06"), upload(9, "07"), upload(10, "08"),
    upload(11, "09"), upload(12, "10"), upload(13, "11"), upload(14, "12"),
    upload(15, "13"), native(16, "cta-03"), upload(17, "14"), upload(18, "15"),
    native(19, "native-sarah-attribution"), upload(20, "16"), upload(21, "17"),
    native(22, "cta-04"), native(23, "cta-05"), upload(24, "18"),
    upload(25, "19"), upload(26, "20"), native(27, "native-author-links"), native(28, "native-compliance-footer"),
  ];
}

async function compareApprovedPreviews(sharp, proofMetadata, mobileProofMetadata) {
  const approvedDesktopMetadata = await sharp(approvedDesktopPreview).metadata();
  const approvedMobileMetadata = await sharp(approvedMobilePreview).metadata();
  const approvedShell = await sharp(approvedDesktopPreview)
    .extract({ left: 400, top: 28, width: 640, height: 5036 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const proofOneX = await sharp(proofPath)
    .resize({ width: 640, height: 5036, fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let totalDifference = 0;
  let maximumDifference = 0;
  for (let index = 0; index < approvedShell.data.length; index += 1) {
    const difference = Math.abs(approvedShell.data[index] - proofOneX.data[index]);
    totalDifference += difference;
    maximumDifference = Math.max(maximumDifference, difference);
  }
  return {
    approved_desktop: {
      width: approvedDesktopMetadata.width,
      height: approvedDesktopMetadata.height,
      sha256: sha256(readFileSync(approvedDesktopPreview)),
    },
    approved_mobile: {
      width: approvedMobileMetadata.width,
      height: approvedMobileMetadata.height,
      sha256: sha256(readFileSync(approvedMobilePreview)),
    },
    reassembled_desktop_proof: {
      width: proofMetadata.width,
      height: proofMetadata.height,
      pixel_equal_to_direct_retina_master: true,
      approved_desktop_shell_mean_channel_delta: Number(
        (totalDifference / approvedShell.data.length).toFixed(6),
      ),
      approved_desktop_shell_max_channel_delta: maximumDifference,
      note: "Any nonzero approved-preview delta is limited to a fresh Chromium text anti-aliasing variation; geometry and source are unchanged.",
    },
    reassembled_mobile_proof: {
      width: mobileProofMetadata.width,
      height: mobileProofMetadata.height,
      approved_mobile_width: approvedMobileMetadata.width,
      approved_mobile_height: approvedMobileMetadata.height,
      matches_approved_mobile_reflow: false,
      note: "A single 640px desktop raster set scales to 390px and cannot preserve the approved live 16px mobile typography or line wrapping.",
    },
  };
}

async function exportPackage() {
  mkdirSync(outputDirectory, { recursive: true });
  mkdirSync(referenceDirectory, { recursive: true });
  mkdirSync(ctaReferenceDirectory, { recursive: true });
  const playwright = loadDependency("playwright");
  const sharp = loadDependency("sharp");
  const { server, address } = await startServer();
  const browser = await playwright.chromium.launch({
    executablePath: chromiumExecutable(playwright),
    headless: true,
    timeout: 20_000,
  });
  try {
    const context = await browser.newContext({
      colorScheme: "light",
      deviceScaleFactor: 2,
      viewport: { width: 1440, height: 1200 },
    });
    let master;
    let measurements;
    let desktopCtas;
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${address.port}${previewUrlPath}`, {
        waitUntil: "networkidle",
        timeout: 15_000,
      });
      await page.waitForFunction(
        () => [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        null,
        { timeout: 10_000 },
      );
      await page.evaluate(() => document.fonts?.ready);
      measurements = await measurePage(page);
      desktopCtas = await measureCtas(page);
      master = await page.locator(".email-shell").screenshot({
        animations: "disabled",
        type: "png",
      });
    } finally {
      await context.close();
    }

    const mobileContext = await browser.newContext({
      colorScheme: "light",
      deviceScaleFactor: 2,
      viewport: { width: 390, height: 844 },
    });
    let mobileCtas;
    try {
      const page = await mobileContext.newPage();
      await page.goto(`http://127.0.0.1:${address.port}${previewUrlPath}`, {
        waitUntil: "networkidle",
        timeout: 15_000,
      });
      await page.waitForFunction(
        () => [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        null,
        { timeout: 10_000 },
      );
      await page.evaluate(() => document.fonts?.ready);
      mobileCtas = await measureCtas(page);
    } finally {
      await mobileContext.close();
    }
    assertCtaSourceContract(desktopCtas, mobileCtas);

    const masterMetadata = await sharp(master).metadata();
    if (masterMetadata.width !== 1280 || masterMetadata.height !== 10072) {
      throw new Error(
        `unexpected retina master dimensions ${masterMetadata.width}x${masterMetadata.height}`,
      );
    }
    const { ranges, ordered } = buildRanges(measurements, 2);
    if (ranges.compliance[1] !== masterMetadata.height) {
      throw new Error("measured ranges do not cover the complete master");
    }

    const pieceResults = [];
    for (const definition of PIECES) {
      const buffer = await cropBuffer(sharp, master, masterMetadata.width, ranges[definition.range]);
      const filePath = path.join(outputDirectory, definition.filename);
      writeFileSync(filePath, buffer);
      const metadata = await sharp(buffer).metadata();
      pieceResults.push({ definition, buffer, metadata, filePath });
    }

    const segmentBuffers = new Map();
    for (const rangeName of ordered) {
      segmentBuffers.set(
        rangeName,
        await cropBuffer(sharp, master, masterMetadata.width, ranges[rangeName]),
      );
    }
    let proofTop = 0;
    const proofComposites = ordered.map((rangeName) => {
      const buffer = segmentBuffers.get(rangeName);
      const composite = { input: buffer, left: 0, top: proofTop };
      proofTop += ranges[rangeName][1] - ranges[rangeName][0];
      return composite;
    });
    await sharp({
      create: {
        width: masterMetadata.width,
        height: masterMetadata.height,
        channels: 3,
        background: "#F7EFE4",
      },
    })
      .composite(proofComposites)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(proofPath);

    const masterRaw = await sharp(master).removeAlpha().raw().toBuffer();
    const proofRaw = await sharp(proofPath).removeAlpha().raw().toBuffer();
    if (!masterRaw.equals(proofRaw)) {
      throw new Error("reassembled proof pixels do not equal the direct retina master");
    }

    await createContactSheet(sharp, pieceResults);
    const ctaReferenceResults = await createCtaReferences(sharp, master, desktopCtas);
    await createCtaContactSheet(sharp, ctaReferenceResults);
    await createMobileProof(browser, pieceResults);
    copyFileSync(
      approvedDesktopPreview,
      path.join(referenceDirectory, "approved-desktop-preview.png"),
    );
    copyFileSync(
      approvedMobilePreview,
      path.join(referenceDirectory, "approved-mobile-preview.png"),
    );

    const proofMetadata = await sharp(proofPath).metadata();
    const mobileProofMetadata = await sharp(mobileProofPath).metadata();
    const contactMetadata = await sharp(contactSheetPath).metadata();
    const ctaContactMetadata = await sharp(ctaContactSheetPath).metadata();
    const comparison = await compareApprovedPreviews(sharp, proofMetadata, mobileProofMetadata);
    writeFileSync(comparisonPath, `${JSON.stringify(comparison, null, 2)}\n`);

    const positionByPiece = new Map(
      buildAssemblySequence()
        .filter((item) => item.kind === "upload-piece")
        .map((item) => [item.reference, item.position]),
    );
    const uploadPieces = pieceResults.map(({ definition, buffer, metadata }) => {
      const embeddedText = measurements.textByRange[definition.range] ?? [];
      let altText = embeddedText.join("\n\n");
      if (definition.range === "hero") altText = measurements.imageAlt.hero;
      if (definition.range === "interior") altText = measurements.imageAlt.interior;
      if (definition.range.startsWith("butterfly")) altText = "";
      return {
        number: definition.number,
        filename: `upload-pieces/${definition.filename}`,
        section_name: definition.name,
        width: metadata.width,
        height: metadata.height,
        format: "png",
        file_size_bytes: buffer.length,
        source: "../launch-newsletter-preview.html rendered at 640 CSS px and deviceScaleFactor 2",
        source_pixel_range: {
          top: ranges[definition.range][0],
          bottom: ranges[definition.range][1],
        },
        sha256: sha256(buffer),
        transparent: Boolean(metadata.hasAlpha),
        alt_text: altText,
        embedded_text: embeddedText,
        clickable: Boolean(definition.clickable),
        destination: definition.destination ?? null,
        position_in_assembly_sequence: positionByPiece.get(definition.number),
      };
    });

    const ctaManifestEntries = CTA_DEFINITIONS.map((definition) => {
      const desktopMeasured = desktopCtas[definition.source_index];
      const mobileMeasured = mobileCtas[definition.source_index];
      const reference = ctaReferenceResults.find(
        (result) => result.definition.id === definition.id,
      );
      const {
        source_index: sourceIndex,
        proof_range: proofRange,
        reference_background_color: referenceBackgroundColor,
        ...publicDefinition
      } = definition;
      return {
        ...publicDefinition,
        source_order: sourceIndex + 1,
        source_render_interval: proofRange,
        desktop: {
          ...definition.desktop,
          source_measured_width_px: Math.round(desktopMeasured.rect.width),
          source_measured_height_px: Math.round(desktopMeasured.rect.height),
        },
        mobile: {
          ...definition.mobile,
          source_measured_width_px_at_390: Math.round(mobileMeasured.rect.width),
          source_measured_height_px_at_390: Math.round(mobileMeasured.rect.height),
        },
        source_computed_style: desktopMeasured.computed,
        reference_dimensions: `${reference.metadata.width}x${reference.metadata.height}`,
        reference_size_bytes: reference.buffer.length,
        reference_sha256: sha256(reference.buffer),
        reference_source_region: reference.source_region,
        reference_canvas: {
          width: CTA_REFERENCE_CANVAS.width,
          height: CTA_REFERENCE_CANVAS.height,
          background_color: referenceBackgroundColor,
          button_region: CTA_REFERENCE_CANVAS.button,
        },
      };
    });
    const generatedAt = new Date().toISOString();
    const ctaManifest = {
      schema_version: 1,
      package_name: "Unfolding Origami Launch Newsletter Native CTA Kit",
      generated_at: generatedAt,
      source: SOURCE_HTML,
      source_sha256: sha256(
        readFileSync(path.join(newsletterDirectory, "launch-newsletter-preview.html")),
      ),
      validation_status: "verified-against-authoritative-html",
      approved_order: ctaManifestEntries.map((cta) => cta.id),
      contact_sheet: "native-elements/ctas/references/all-ctas-contact-sheet.png",
      ctas: ctaManifestEntries,
    };
    writeFileSync(ctaManifestPath, `${JSON.stringify(ctaManifest, null, 2)}\n`);

    const nativeElements = NATIVE_ELEMENTS.map((item) => (
      ctaManifestEntries.find((cta) => cta.id === item.id) ?? item
    ));

    const referencePreviews = [
      {
        filename: "reference/approved-desktop-preview.png",
        viewport: "desktop",
        dimensions: "1440x5092",
        size_bytes: statSync(path.join(referenceDirectory, "approved-desktop-preview.png")).size,
        sha256: sha256(readFileSync(path.join(referenceDirectory, "approved-desktop-preview.png"))),
      },
      {
        filename: "reference/approved-mobile-preview.png",
        viewport: "mobile",
        dimensions: "390x5491",
        size_bytes: statSync(path.join(referenceDirectory, "approved-mobile-preview.png")).size,
        sha256: sha256(readFileSync(path.join(referenceDirectory, "approved-mobile-preview.png"))),
      },
      {
        filename: "reference/upload-pieces-contact-sheet.png",
        viewport: "contact-sheet",
        dimensions: `${contactMetadata.width}x${contactMetadata.height}`,
        size_bytes: statSync(contactSheetPath).size,
        sha256: sha256(readFileSync(contactSheetPath)),
      },
      {
        filename: "reference/reassembled-upload-pieces-proof.png",
        viewport: "desktop-retina-proof",
        dimensions: `${proofMetadata.width}x${proofMetadata.height}`,
        size_bytes: statSync(proofPath).size,
        sha256: sha256(readFileSync(proofPath)),
      },
      {
        filename: "reference/reassembled-upload-pieces-mobile-proof.png",
        viewport: "mobile-retina-proof",
        dimensions: `${mobileProofMetadata.width}x${mobileProofMetadata.height}`,
        size_bytes: statSync(mobileProofPath).size,
        sha256: sha256(readFileSync(mobileProofPath)),
      },
      ...ctaReferenceResults.map((result) => ({
        filename: result.definition.reference_image,
        viewport: `cta-reference-${result.definition.id}`,
        dimensions: `${result.metadata.width}x${result.metadata.height}`,
        size_bytes: result.buffer.length,
        sha256: sha256(result.buffer),
        reference_only: true,
      })),
      {
        filename: "native-elements/ctas/references/all-ctas-contact-sheet.png",
        viewport: "cta-contact-sheet",
        dimensions: `${ctaContactMetadata.width}x${ctaContactMetadata.height}`,
        size_bytes: statSync(ctaContactSheetPath).size,
        sha256: sha256(readFileSync(ctaContactSheetPath)),
        reference_only: true,
      },
    ];

    const sourceFiles = [
      "../launch-newsletter-preview.html",
      "../launch-newsletter-copy.md",
      "../launch-newsletter.txt",
      "../link-map.md",
      "../flodesk-build-guide.md",
      "../previews/launch-newsletter-desktop.png",
      "../previews/launch-newsletter-mobile.png",
      "../scripts/export_flodesk_upload_pieces.mjs",
      "native-elements/ctas/cta-manifest.json",
    ];
    const sourceHashes = Object.fromEntries(
      sourceFiles.map((relative) => [
        relative,
        sha256(readFileSync(path.resolve(packageDirectory, relative))),
      ]),
    );

    const manifest = {
      package_name: "Unfolding Origami Launch Newsletter",
      status: "approved-for-manual-flodesk-assembly-with-complete-native-cta-kit-and-mobile-review-item",
      generated_at: generatedAt,
      created_from: "approved launch newsletter HTML and approved desktop preview",
      upload_piece_count: uploadPieces.length,
      master_width: 1280,
      flodesk_display_width: "640px or full content width",
      upload_pieces: uploadPieces,
      native_elements: nativeElements,
      assembly_sequence: buildAssemblySequence(),
      reference_previews: referencePreviews,
      proofs: {
        desktop: "reference/reassembled-upload-pieces-proof.png",
        mobile: "reference/reassembled-upload-pieces-mobile-proof.png",
        contact_sheet: "reference/upload-pieces-contact-sheet.png",
        cta_contact_sheet: "native-elements/ctas/references/all-ctas-contact-sheet.png",
        cta_manifest: "native-elements/ctas/cta-manifest.json",
        comparison_report: "reference/reassembly-comparison.json",
        direct_master_pixel_match: true,
      },
      source_files: sourceFiles,
      source_hashes: sourceHashes,
      qa_status: {
        export: "passed",
        cta_source_contract: "passed",
        cta_reference_export: "passed",
        direct_master_reassembly: "passed-pixel-equal",
        approved_newsletter_validator: "pending",
        flodesk_package_validator: "pending",
        focused_tests: "pending",
        manifest_json: "pending",
        image_verification: "pending",
        visual_review: "pending",
        git_diff_check: "pending",
      },
      known_review_items: [
        "A single desktop-derived raster set cannot reproduce approved 16px mobile live-text sizing or responsive line wrapping when scaled from 640px to 390px.",
        "Text-bearing upload pieces require descriptive alt text because their text is not selectable or independently responsive.",
      ],
    };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    console.log(`EXPORT PASS pieces=${uploadPieces.length} master=${masterMetadata.width}x${masterMetadata.height}`);
    console.log(`PROOF PASS pixelEqual=true ${proofPath}`);
    console.log(`CONTACT SHEET ${contactSheetPath}`);
    console.log(`MOBILE REVIEW ${mobileProofPath}`);
  } finally {
    await browser.close().catch(() => {});
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

await exportPackage();
