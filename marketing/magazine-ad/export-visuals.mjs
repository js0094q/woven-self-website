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
  css: path.join(adDir, "magazine-ad.css"),
  qr: path.join(adDir, "assets/qr-author.png"),
  cover: path.join(repoRoot, "design/book-cover-unfolding-origami/front-cover-concept-v7-title-author-allcaps-larger.png"),
  logo: path.join(repoRoot, "images/logo.png"),
};

const outputs = {
  primaryPng: path.join(exportsDir, "magazine-ad.png"),
  primaryPdf: path.join(exportsDir, "magazine-ad.pdf"),
  minimalPng: path.join(exportsDir, "magazine-ad-minimal.png"),
  minimalPdf: path.join(exportsDir, "magazine-ad-minimal.pdf"),
  previewJpg: path.join(exportsDir, "magazine-ad-preview.jpg"),
};

const expectedPng = {
  width: 2550,
  height: 3300,
  tolerance: 10,
};

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

function assertApproxDimension(actual, expected, label) {
  if (Math.abs(actual - expected) > expectedPng.tolerance) {
    throw new Error(`${label} expected approximately ${expected}px, got ${actual}px`);
  }
}

async function loadAdPage(browser, htmlPath) {
  const page = await browser.newPage({
    viewport: { width: 900, height: 1200 },
    deviceScaleFactor: 3.125,
  });

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  return page;
}

async function runLayoutChecks(page, label) {
  const result = await page.evaluate(() => {
    const px = value => Math.round(value * 100) / 100;
    const pageEl = document.querySelector(".ad-page");
    const safeEl = document.querySelector(".safe-area");
    const qrCard = document.querySelector(".qr-card");
    const qrImg = document.querySelector(".qr-card img");
    const coverImg = document.querySelector(".cover-frame img, .minimal-cover img");

    if (!pageEl || !safeEl || !qrCard || !qrImg || !coverImg) {
      return { missingSelectors: true };
    }

    const pageRect = pageEl.getBoundingClientRect();
    const safeRect = safeEl.getBoundingClientRect();
    const qrCardRect = qrCard.getBoundingClientRect();
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
        className: el.className || "",
        text: (el.textContent || "").trim().slice(0, 80),
      }));

    const qrInsideCard =
      qrRect.left >= qrCardRect.left &&
      qrRect.top >= qrCardRect.top &&
      qrRect.right <= qrCardRect.right &&
      qrRect.bottom <= qrCardRect.bottom;

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
      qrInsideCard,
      coverAspect: {
        rendered: px(coverRect.width / coverRect.height),
        natural: px(coverImg.naturalWidth / coverImg.naturalHeight),
      },
      forbiddenText: {
        headway: /Headway|Book via Headway|care\.headway/i.test(text),
        rawStripe: /buy\.stripe\.com/i.test(document.documentElement.outerHTML),
        foldingOrigami: /Folding Origami/.test(text),
      },
    };
  });

  if (result.missingSelectors) throw new Error(`${label}: required layout selectors are missing`);
  if (result.pageSize.width !== 816 || result.pageSize.height !== 1056) {
    throw new Error(`${label}: expected .ad-page to be 816x1056 CSS px, got ${JSON.stringify(result.pageSize)}`);
  }
  if (
    result.safeArea.insetLeft !== 24 ||
    result.safeArea.insetTop !== 24 ||
    result.safeArea.width !== 768 ||
    result.safeArea.height !== 1008
  ) {
    throw new Error(`${label}: safe area check failed: ${JSON.stringify(result.safeArea)}`);
  }
  if (result.brokenImages.length > 0) {
    throw new Error(`${label}: broken images: ${result.brokenImages.join(", ")}`);
  }
  if (result.outsideSafeArea.length > 0) {
    throw new Error(`${label}: content outside safe area: ${JSON.stringify(result.outsideSafeArea)}`);
  }
  if (result.scrollOverflow.x !== 0 || result.scrollOverflow.y !== 0) {
    throw new Error(`${label}: scroll overflow: ${JSON.stringify(result.scrollOverflow)}`);
  }
  if (result.qrSize.width < 96 || result.qrSize.height < 96 || !result.qrInsideCard) {
    throw new Error(`${label}: QR placement check failed: ${JSON.stringify({ qrSize: result.qrSize, qrInsideCard: result.qrInsideCard })}`);
  }
  if (Math.abs(result.coverAspect.rendered - result.coverAspect.natural) > 0.01) {
    throw new Error(`${label}: book cover aspect ratio changed: ${JSON.stringify(result.coverAspect)}`);
  }
  for (const [name, found] of Object.entries(result.forbiddenText)) {
    if (found) throw new Error(`${label}: forbidden text found: ${name}`);
  }
}

async function exportLayout(browser, sharp, { label, htmlPath, pngPath, pdfPath }) {
  const page = await loadAdPage(browser, htmlPath);
  await runLayoutChecks(page, label);

  await page.locator(".ad-page").screenshot({ path: pngPath });
  await page.pdf({
    path: pdfPath,
    width: "8.5in",
    height: "11in",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    printBackground: true,
    preferCSSPageSize: true,
  });

  await page.close();

  await assertOutputExists(pngPath, `${label} PNG`);
  await assertOutputExists(pdfPath, `${label} PDF`);

  const metadata = await sharp(pngPath).metadata();
  assertApproxDimension(metadata.width, expectedPng.width, `${label} PNG width`);
  assertApproxDimension(metadata.height, expectedPng.height, `${label} PNG height`);

  return {
    label,
    png: path.relative(repoRoot, pngPath),
    pdf: path.relative(repoRoot, pdfPath),
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
    exported.push(await exportLayout(browser, sharp, {
      label: "primary",
      htmlPath: sourceFiles.primaryHtml,
      pngPath: outputs.primaryPng,
      pdfPath: outputs.primaryPdf,
    }));
    exported.push(await exportLayout(browser, sharp, {
      label: "minimal",
      htmlPath: sourceFiles.minimalHtml,
      pngPath: outputs.minimalPng,
      pdfPath: outputs.minimalPdf,
    }));

    await sharp(outputs.primaryPng)
      .resize({ width: 1200 })
      .jpeg({ quality: 85 })
      .toFile(outputs.previewJpg);

    await assertOutputExists(outputs.previewJpg, "preview JPG");
    const previewMetadata = await sharp(outputs.previewJpg).metadata();

    console.log(JSON.stringify({
      exports: exported,
      preview: {
        file: path.relative(repoRoot, outputs.previewJpg),
        dimensions: `${previewMetadata.width}x${previewMetadata.height}`,
      },
    }, null, 2));
  } finally {
    await browser?.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
