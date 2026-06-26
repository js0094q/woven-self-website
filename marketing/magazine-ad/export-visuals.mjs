import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const adDir = path.dirname(__filename);
const repoRoot = path.resolve(adDir, "../..");
const exportsDir = path.join(adDir, "exports");

const sourceFiles = {
  primaryHtml: path.join(adDir, "magazine-ad.html"),
  minimalHtml: path.join(adDir, "magazine-ad-minimal.html"),
  halfHorizontalHtml: path.join(adDir, "magazine-ad-half-horizontal.html"),
  halfVerticalHtml: path.join(adDir, "magazine-ad-half-vertical.html"),
  css: path.join(adDir, "magazine-ad.css"),
  qr: path.join(adDir, "assets/qr-author.png"),
  cover: path.join(repoRoot, "design/book-cover-unfolding-origami/front-cover-concept-v7-title-author-allcaps-larger.png"),
  logo: path.join(repoRoot, "images/logo.png"),
  authorPortrait: path.join(repoRoot, "images/loren-author-blue-floral.jpeg"),
};

const outputs = {
  primaryPng: path.join(exportsDir, "magazine-ad.png"),
  primaryPdf: path.join(exportsDir, "magazine-ad.pdf"),
  minimalPng: path.join(exportsDir, "magazine-ad-minimal.png"),
  minimalPdf: path.join(exportsDir, "magazine-ad-minimal.pdf"),
  previewJpg: path.join(exportsDir, "magazine-ad-preview.jpg"),
  halfHorizontalPng: path.join(exportsDir, "magazine-ad-half-horizontal.png"),
  halfHorizontalPdf: path.join(exportsDir, "magazine-ad-half-horizontal.pdf"),
  halfVerticalPng: path.join(exportsDir, "magazine-ad-half-vertical.png"),
  halfVerticalPdf: path.join(exportsDir, "magazine-ad-half-vertical.pdf"),
  halfHorizontalPreviewJpg: path.join(exportsDir, "magazine-ad-half-horizontal-preview.jpg"),
};

const layouts = [
  {
    label: "primary",
    htmlPath: sourceFiles.primaryHtml,
    pngPath: outputs.primaryPng,
    pdfPath: outputs.primaryPdf,
    cssWidth: 816,
    cssHeight: 1056,
    pdfWidth: "8.5in",
    pdfHeight: "11in",
    expectedPng: { width: 2550, height: 3300, tolerance: 10 },
    viewport: { width: 900, height: 1200 },
    safeInset: 24,
    minQrCssSize: 96,
  },
  {
    label: "minimal",
    htmlPath: sourceFiles.minimalHtml,
    pngPath: outputs.minimalPng,
    pdfPath: outputs.minimalPdf,
    cssWidth: 816,
    cssHeight: 1056,
    pdfWidth: "8.5in",
    pdfHeight: "11in",
    expectedPng: { width: 2550, height: 3300, tolerance: 10 },
    viewport: { width: 900, height: 1200 },
    safeInset: 24,
    minQrCssSize: 96,
  },
  {
    label: "half-horizontal",
    htmlPath: sourceFiles.halfHorizontalHtml,
    pngPath: outputs.halfHorizontalPng,
    pdfPath: outputs.halfHorizontalPdf,
    cssWidth: 720,
    cssHeight: 468,
    pdfWidth: "7.5in",
    pdfHeight: "4.875in",
    expectedPng: { width: 2250, height: 1463, tolerance: 10 },
    viewport: { width: 820, height: 570 },
    safeInset: 17.28,
    minQrCssSize: 78,
  },
  {
    label: "half-vertical",
    htmlPath: sourceFiles.halfVerticalHtml,
    pngPath: outputs.halfVerticalPng,
    pdfPath: outputs.halfVerticalPdf,
    cssWidth: 348,
    cssHeight: 936,
    pdfWidth: "3.625in",
    pdfHeight: "9.75in",
    expectedPng: { width: 1088, height: 2925, tolerance: 10 },
    viewport: { width: 448, height: 1036 },
    safeInset: 17.28,
    minQrCssSize: 78,
  },
];

const previewExports = [
  {
    label: "primary preview",
    sourcePng: outputs.primaryPng,
    outputJpg: outputs.previewJpg,
    width: 1200,
  },
  {
    label: "half-horizontal preview",
    sourcePng: outputs.halfHorizontalPng,
    outputJpg: outputs.halfHorizontalPreviewJpg,
    width: 1200,
  },
];

async function importRequiredPackage(packageName, installHint) {
  try {
    return await import(packageName);
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" || error?.code === "MODULE_NOT_FOUND") {
      throw new Error(`Missing required package "${packageName}". ${installHint}`);
    }
    throw error;
  }
}

async function assertFileExists(filePath, label) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error(`${label} is not a file: ${filePath}`);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Missing ${label}: ${filePath}`);
    }
    throw error;
  }
}

async function assertOutputExists(filePath, label) {
  const stat = await fs.stat(filePath);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error(`${label} was not created or is empty: ${filePath}`);
  }
}

function assertApproxDimension(actual, expected, tolerance, label) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label} expected approximately ${expected}px, got ${actual}px`);
  }
}

async function loadAdPage(browser, layout) {
  const page = await browser.newPage({
    viewport: layout.viewport,
    deviceScaleFactor: 3.125,
  });

  await page.goto(pathToFileURL(layout.htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  return page;
}

async function runLayoutChecks(page, layout) {
  const result = await page.evaluate(() => {
    const px = value => Math.round(value * 100) / 100;
    const pageEl = document.querySelector(".ad-page");
    const safeEl = document.querySelector(".safe-area");
    const qrContainer = document.querySelector(".qr-card, .half-cta");
    const qrImg = document.querySelector(".qr-card img, .half-qr-row img");
    const coverImg = document.querySelector(".cover-frame img, .minimal-cover img, .half-cover img");
    const portraitImg = document.querySelector(".author-photo img");

    if (!pageEl || !safeEl || !qrContainer || !qrImg || !coverImg) {
      return { missingSelectors: true };
    }

    const pageRect = pageEl.getBoundingClientRect();
    const safeRect = safeEl.getBoundingClientRect();
    const qrContainerRect = qrContainer.getBoundingClientRect();
    const qrRect = qrImg.getBoundingClientRect();
    const coverRect = coverImg.getBoundingClientRect();
    const brokenImages = [...document.images]
      .filter(img => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
      .map(img => img.getAttribute("src"));

    const outsideSafeArea = [...safeEl.querySelectorAll("*")]
      .filter(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        return (
          rect.left < safeRect.left - 0.5 ||
          rect.top < safeRect.top - 0.5 ||
          rect.right > safeRect.right + 0.5 ||
          rect.bottom > safeRect.bottom + 0.5
        );
      })
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === "string" ? el.className : "",
        text: (el.textContent || "").trim().slice(0, 80),
      }));

    const qrInsideContainer =
      qrRect.left >= qrContainerRect.left &&
      qrRect.top >= qrContainerRect.top &&
      qrRect.right <= qrContainerRect.right &&
      qrRect.bottom <= qrContainerRect.bottom;

    const portrait = portraitImg
      ? {
          naturalWidth: portraitImg.naturalWidth,
          naturalHeight: portraitImg.naturalHeight,
          objectFit: window.getComputedStyle(portraitImg).objectFit,
        }
      : null;
    const text = document.body.innerText;

    return {
      missingSelectors: false,
      pageSize: { width: px(pageRect.width), height: px(pageRect.height) },
      safeArea: {
        insetLeft: px(safeRect.left - pageRect.left),
        insetTop: px(safeRect.top - pageRect.top),
        width: px(safeRect.width),
        height: px(safeRect.height),
      },
      brokenImages,
      outsideSafeArea,
      scrollOverflow: {
        x: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        y: Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight),
      },
      qrSize: { width: px(qrRect.width), height: px(qrRect.height) },
      qrInsideContainer,
      coverAspect: {
        rendered: px(coverRect.width / coverRect.height),
        natural: px(coverImg.naturalWidth / coverImg.naturalHeight),
      },
      portrait,
      forbiddenText: {
        headway: /Headway|Book via Headway|care\.headway/i.test(text),
        rawStripe: /buy\.stripe\.com/i.test(document.documentElement.outerHTML),
        foldingOrigami: new RegExp("Fold" + "ing Origami").test(text),
      },
    };
  });

  if (result.missingSelectors) throw new Error(`${layout.label}: required layout selectors are missing`);
  assertApproxDimension(result.pageSize.width, layout.cssWidth, 0.75, `${layout.label} .ad-page width`);
  assertApproxDimension(result.pageSize.height, layout.cssHeight, 0.75, `${layout.label} .ad-page height`);
  assertApproxDimension(result.safeArea.insetLeft, layout.safeInset, 0.75, `${layout.label} safe-area left inset`);
  assertApproxDimension(result.safeArea.insetTop, layout.safeInset, 0.75, `${layout.label} safe-area top inset`);
  assertApproxDimension(result.safeArea.width, layout.cssWidth - layout.safeInset * 2, 1, `${layout.label} safe-area width`);
  assertApproxDimension(result.safeArea.height, layout.cssHeight - layout.safeInset * 2, 1, `${layout.label} safe-area height`);

  if (result.brokenImages.length > 0) {
    throw new Error(`${layout.label}: broken images: ${result.brokenImages.join(", ")}`);
  }
  if (result.outsideSafeArea.length > 0) {
    throw new Error(`${layout.label}: content outside safe area: ${JSON.stringify(result.outsideSafeArea)}`);
  }
  if (result.scrollOverflow.x !== 0 || result.scrollOverflow.y !== 0) {
    throw new Error(`${layout.label}: scroll overflow: ${JSON.stringify(result.scrollOverflow)}`);
  }
  if (result.qrSize.width < layout.minQrCssSize || result.qrSize.height < layout.minQrCssSize || !result.qrInsideContainer) {
    throw new Error(`${layout.label}: QR placement check failed: ${JSON.stringify({ qrSize: result.qrSize, qrInsideContainer: result.qrInsideContainer })}`);
  }
  if (Math.abs(result.coverAspect.rendered - result.coverAspect.natural) > 0.01) {
    throw new Error(`${layout.label}: book cover aspect ratio changed: ${JSON.stringify(result.coverAspect)}`);
  }
  if (result.portrait && (result.portrait.naturalWidth === 0 || result.portrait.naturalHeight === 0 || !["cover", "contain"].includes(result.portrait.objectFit))) {
    throw new Error(`${layout.label}: author portrait rendering check failed: ${JSON.stringify(result.portrait)}`);
  }
  for (const [name, found] of Object.entries(result.forbiddenText)) {
    if (found) throw new Error(`${layout.label}: forbidden text found: ${name}`);
  }
}

async function exportLayout(browser, sharp, layout) {
  const page = await loadAdPage(browser, layout);
  await runLayoutChecks(page, layout);

  await page.locator(".ad-page").screenshot({ path: layout.pngPath });
  await page.pdf({
    path: layout.pdfPath,
    width: layout.pdfWidth,
    height: layout.pdfHeight,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    printBackground: true,
  });

  await page.close();

  await assertOutputExists(layout.pngPath, `${layout.label} PNG`);
  await assertOutputExists(layout.pdfPath, `${layout.label} PDF`);

  const metadata = await sharp(layout.pngPath).metadata();
  assertApproxDimension(metadata.width, layout.expectedPng.width, layout.expectedPng.tolerance, `${layout.label} PNG width`);
  assertApproxDimension(metadata.height, layout.expectedPng.height, layout.expectedPng.tolerance, `${layout.label} PNG height`);

  return {
    label: layout.label,
    png: path.relative(repoRoot, layout.pngPath),
    pdf: path.relative(repoRoot, layout.pdfPath),
    dimensions: `${metadata.width}x${metadata.height}`,
  };
}

async function exportPreview(sharp, preview) {
  await sharp(preview.sourcePng)
    .resize({ width: preview.width })
    .jpeg({ quality: 85 })
    .toFile(preview.outputJpg);

  await assertOutputExists(preview.outputJpg, preview.label);
  const metadata = await sharp(preview.outputJpg).metadata();

  return {
    label: preview.label,
    file: path.relative(repoRoot, preview.outputJpg),
    dimensions: `${metadata.width}x${metadata.height}`,
  };
}

async function main() {
  await Promise.all(Object.entries(sourceFiles).map(([label, filePath]) => assertFileExists(filePath, label)));
  await fs.mkdir(exportsDir, { recursive: true });

  const [{ chromium }, sharpModule] = await Promise.all([
    importRequiredPackage("playwright", "Run `npm install` before exporting. If browser binaries are missing, run `npx playwright install chromium`."),
    importRequiredPackage("sharp", "Run `npm install` before exporting."),
  ]);
  const sharp = sharpModule.default;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    throw new Error(`Unable to launch Playwright Chromium. Run \`npx playwright install chromium\` and retry.\n${error.message}`);
  }

  try {
    const exported = [];
    for (const layout of layouts) {
      exported.push(await exportLayout(browser, sharp, layout));
    }

    const previews = [];
    for (const preview of previewExports) {
      previews.push(await exportPreview(sharp, preview));
    }

    console.log(JSON.stringify({
      exports: exported,
      previews,
    }, null, 2));
  } finally {
    await browser?.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
