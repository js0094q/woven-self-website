import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
const previewUrlPath = "/newsletter/book-launch/launch-newsletter-preview.html";
const previewDirectory = path.resolve(scriptDirectory, "../previews");
const desktopScreenshot = path.join(previewDirectory, "launch-newsletter-desktop.png");
const mobileScreenshot = path.join(previewDirectory, "launch-newsletter-mobile.png");

const approved = {
  amazonAsin: "B0H7YZ5N28",
  stripe: "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00",
  excerpt: "https://wovenself.com/excerpt-unfolding-origami.html",
  sarah: "https://alittlebitculty.com/",
};

const viewports = [
  { name: "desktop", width: 1440, height: 1200, screenshot: desktopScreenshot },
  { name: "mobile", width: 390, height: 844, screenshot: mobileScreenshot },
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
  [".txt", "text/plain; charset=utf-8"],
]);

let browser;
let server;

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (repositoryError) {
    const runtimePlaywright = path.join(
      os.homedir(),
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
    );
    try {
      return require(runtimePlaywright);
    } catch (runtimeError) {
      throw new Error(
        `Playwright unavailable in repository and bundled runtime: ${runtimeError.message}`,
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
  if (!executable) {
    throw new Error("Existing Playwright Chromium executable was not found");
  }
  return executable;
}

function startServer() {
  server = createServer((request, response) => {
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
    server.listen(0, "127.0.0.1", () => resolve(server.address()));
  });
}

async function auditPage(page, viewportName) {
  return page.evaluate(
    ({ approvedValues, currentViewport }) => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };
      const visibleElements = [...document.querySelectorAll("body *")].filter(
        (element) => isVisible(element) && !element.classList.contains("sr-only"),
      );
      const viewportWidth = document.documentElement.clientWidth;
      const overflowElements = visibleElements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -0.5 || rect.right > viewportWidth + 0.5;
      });
      const clippedElements = visibleElements.filter((element) => {
        const style = getComputedStyle(element);
        const clipsX = ["clip", "hidden"].includes(style.overflowX);
        const clipsY = ["clip", "hidden"].includes(style.overflowY);
        return (
          (clipsX && element.scrollWidth > element.clientWidth + 1) ||
          (clipsY && element.scrollHeight > element.clientHeight + 1)
        );
      });

      const images = [...document.images];
      const brokenImages = images.filter(
        (image) => !image.complete || image.naturalWidth === 0,
      );
      const links = [...document.querySelectorAll("a[href]")];
      const amazonLinks = links.filter((link) => {
        const hostname = new URL(link.href).hostname.toLowerCase();
        return hostname === "amazon.com" || hostname.endsWith(".amazon.com");
      });
      const affiliateParameters = new Set([
        "tag",
        "ascsubtag",
        "linkcode",
        "camp",
        "creative",
        "creativeasin",
      ]);
      const invalidAmazonLinks = amazonLinks.filter((link) => {
        const url = new URL(link.href);
        const hasAffiliateParameter = [...url.searchParams.keys()].some((key) =>
          affiliateParameters.has(key.toLowerCase()),
        );
        return !url.href.includes(approvedValues.amazonAsin) || hasAffiliateParameter;
      });

      const stripeLinks = links.filter(
        (link) => new URL(link.href).hostname.toLowerCase() === "buy.stripe.com",
      );
      const excerptLinks = links.filter((link) => link.textContent.trim() === "Read an Excerpt");
      const sarahLinks = links.filter((link) => link.textContent.includes("Sarah Edmondson"));

      const bodyElements = [
        ...new Set(document.querySelectorAll(".body-copy, .mobile-body")),
      ].filter(isVisible);
      const bodyFontSizes = bodyElements.map((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize),
      );
      const minimumBodyFontSize = Math.min(...bodyFontSizes);

      const butterflies = [
        ...document.querySelectorAll('img[data-butterfly="true"]'),
      ].filter((image) => isVisible(image) && image.complete && image.naturalWidth > 0);
      const purchaseButtons = [...document.querySelectorAll("a.purchase-button")];
      const purchaseRects = purchaseButtons.map((button) => {
        const rect = button.getBoundingClientRect();
        const parentRect = button.parentElement.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          href: button.href,
          left: rect.left,
          parentWidth: parentRect.width,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        };
      });
      const mobileSeparation =
        purchaseRects.length === 2 ? purchaseRects[1].top - purchaseRects[0].bottom : -1;
      const mobileFullWidth =
        purchaseRects.length === 2 &&
        purchaseRects.every((rect) => Math.abs(rect.width - rect.parentWidth) <= 1);
      const absolutePositioned = [...document.querySelectorAll("body *")].filter(
        (element) =>
          getComputedStyle(element).position === "absolute" &&
          !element.classList.contains("sr-only"),
      );

      return {
        absolutePositionedCount: absolutePositioned.length,
        amazonLinkCount: amazonLinks.length,
        amazonLinksValid: amazonLinks.length > 0 && invalidAmazonLinks.length === 0,
        brokenImageCount: brokenImages.length,
        clippingCount: clippedElements.length,
        excerptLinksValid:
          excerptLinks.length === 1 && excerptLinks[0].href === approvedValues.excerpt,
        horizontalOverflowCount: overflowElements.length,
        minimumBodyFontSize,
        purchaseButtonHeights: purchaseRects.map((rect) => rect.height),
        sarahLinksValid: sarahLinks.length === 1 && sarahLinks[0].href === approvedValues.sarah,
        stripeLinksValid:
          stripeLinks.length === 1 && stripeLinks[0].href === approvedValues.stripe,
        viewport: currentViewport,
        visibleButterflyCount: butterflies.length,
        mobilePurchaseLayout: {
          amazonFirst:
            purchaseRects.length === 2 &&
            purchaseRects[0].href.includes(approvedValues.amazonAsin),
          fullWidth: mobileFullWidth,
          separation: mobileSeparation,
          stacked:
            purchaseRects.length === 2 &&
            purchaseRects[0].top < purchaseRects[1].top &&
            purchaseRects[1].top >= purchaseRects[0].bottom,
        },
      };
    },
    { approvedValues: approved, currentViewport: viewportName },
  );
}

function validateAudit(audit) {
  const failures = [];
  const requireCheck = (condition, message) => {
    if (!condition) failures.push(message);
  };

  requireCheck(audit.brokenImageCount === 0, `broken images=${audit.brokenImageCount}`);
  requireCheck(
    audit.horizontalOverflowCount === 0,
    `horizontal overflow=${audit.horizontalOverflowCount}`,
  );
  requireCheck(audit.clippingCount === 0, `visible clipping=${audit.clippingCount}`);
  requireCheck(audit.amazonLinksValid, "Amazon link or Associates validation failed");
  requireCheck(audit.stripeLinksValid, "Stripe destination validation failed");
  requireCheck(audit.excerptLinksValid, "excerpt destination validation failed");
  requireCheck(audit.sarahLinksValid, "Sarah destination validation failed");
  requireCheck(audit.minimumBodyFontSize >= 16, `minimum body font=${audit.minimumBodyFontSize}px`);
  requireCheck(
    audit.absolutePositionedCount === 0,
    `non-sr-only absolute positioning=${audit.absolutePositionedCount}`,
  );
  requireCheck(audit.purchaseButtonHeights.length === 2, "expected two purchase buttons");

  if (audit.viewport === "desktop" && audit.purchaseButtonHeights.length === 2) {
    requireCheck(
      Math.abs(audit.purchaseButtonHeights[0] - audit.purchaseButtonHeights[1]) <= 0.5,
      `desktop purchase heights=${audit.purchaseButtonHeights.join(",")}`,
    );
  }
  if (audit.viewport === "mobile") {
    requireCheck(audit.visibleButterflyCount >= 3, `visible butterflies=${audit.visibleButterflyCount}`);
    requireCheck(audit.mobilePurchaseLayout.amazonFirst, "mobile Amazon button is not first");
    requireCheck(audit.mobilePurchaseLayout.fullWidth, "mobile purchase buttons are not full width");
    requireCheck(audit.mobilePurchaseLayout.stacked, "mobile purchase buttons are not stacked");
    requireCheck(
      audit.mobilePurchaseLayout.separation >= 12,
      `mobile purchase separation=${audit.mobilePurchaseLayout.separation}px`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`${audit.viewport} validation failed: ${failures.join("; ")}`);
  }
}

function printAudit(audit) {
  const heights = audit.purchaseButtonHeights.map((height) => height.toFixed(2)).join(",");
  console.log(
    [
      `RENDER ${audit.viewport}`,
      `brokenImages=${audit.brokenImageCount}`,
      `horizontalOverflow=${audit.horizontalOverflowCount}`,
      `clipping=${audit.clippingCount}`,
      `amazon=${audit.amazonLinksValid ? "PASS" : "FAIL"}`,
      `stripe=${audit.stripeLinksValid ? "PASS" : "FAIL"}`,
      `excerpt=${audit.excerptLinksValid ? "PASS" : "FAIL"}`,
      `sarah=${audit.sarahLinksValid ? "PASS" : "FAIL"}`,
      `minBodyFont=${audit.minimumBodyFontSize.toFixed(2)}px`,
      `purchaseHeights=${heights}`,
      `butterflies=${audit.visibleButterflyCount}`,
      `mobileStack=${audit.mobilePurchaseLayout.stacked}`,
      `mobileFullWidth=${audit.mobilePurchaseLayout.fullWidth}`,
      `mobileAmazonFirst=${audit.mobilePurchaseLayout.amazonFirst}`,
      `mobileSeparation=${audit.mobilePurchaseLayout.separation.toFixed(2)}px`,
      `absoluteOutsideSrOnly=${audit.absolutePositionedCount}`,
    ].join(" "),
  );
}

async function render() {
  const playwright = loadPlaywright();
  const address = await startServer();
  const executablePath = chromiumExecutable(playwright);
  browser = await playwright.chromium.launch({ executablePath, headless: true, timeout: 20_000 });
  const url = `http://127.0.0.1:${address.port}${previewUrlPath}`;

  for (const viewport of viewports) {
    const context = await browser.newContext({
      deviceScaleFactor: 1,
      viewport: { width: viewport.width, height: viewport.height },
    });
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 15_000 });
      await page.waitForFunction(
        () => [...document.images].every((image) => image.complete),
        null,
        { timeout: 10_000 },
      );
      await page.evaluate(() => document.fonts?.ready);
      const audit = await auditPage(page, viewport.name);
      await page.screenshot({ fullPage: true, path: viewport.screenshot });
      printAudit(audit);
      validateAudit(audit);
      console.log(`SCREENSHOT ${viewport.name} ${viewport.screenshot}`);
    } finally {
      await context.close();
    }
  }
}

async function cleanup() {
  if (browser) {
    await browser.close().catch(() => {});
    browser = undefined;
  }
  if (server) {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(() => resolve()));
    server = undefined;
  }
}

async function main() {
  let watchdog;
  try {
    const timeout = new Promise((_, reject) => {
      watchdog = setTimeout(() => reject(new Error("render exceeded 85 seconds")), 85_000);
    });
    await Promise.race([render(), timeout]);
    console.log("RENDER PASS");
  } catch (error) {
    console.error(`RENDER FAIL: ${error.stack ?? error.message}`);
    process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    await cleanup();
  }
}

await main();
