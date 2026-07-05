import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const outDir = path.dirname(__filename);
const repoRoot = path.resolve(outDir, "../..");

const assets = {
  headerLogo: path.join(repoRoot, "newsletter/assets/flodesk/woven-self-flodesk-header-logo.png"),
  cover: path.join(repoRoot, "images/unfolding-origami-ebook-cover.jpg"),
  butterflyOne: path.join(repoRoot, "images/unfolding-origami-butterfly-1.png"),
  butterflyTwo: path.join(repoRoot, "images/unfolding-origami-butterfly-2.png"),
  butterflyThree: path.join(repoRoot, "images/unfolding-origami-butterfly-3.png"),
};

const urls = {
  author: "https://wovenself.com/author.html",
  signedPaperback: "https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00",
  kindle: "https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese-ebook/dp/B0H27BM8K1",
  excerpt: "https://wovenself.com/excerpt-unfolding-origami.html",
};

const palette = {
  blue: "#102231",
  paper: "#F6EFE8",
  cream: "#FFF8F0",
  rose: "#9B5F6F",
  text: "#24313A",
  border: "#E4D7CC",
  white: "#FFFFFF",
};

const imageFilesForPreview = [
  "01-header-logo.png",
  "02-hero-cover-announcement.png",
  "03a-preorder-signed-paperback.png",
  "03b-preorder-kindle-ebook.png",
  "04-excerpt-feature.png",
  "05a-reminder-signed-paperback.png",
  "05b-reminder-kindle-ebook.png",
  "06-closing-note.png",
  "07-footer.png",
];

const blocks = [
  {
    name: "01-header-logo",
    width: 1200,
    height: 280,
    body: `
      <section class="block block-header">
        <div class="logo-panel">
          <img class="header-logo" src="${fileUrl(assets.headerLogo)}" alt="The Woven Self logo">
        </div>
      </section>
    `,
  },
  {
    name: "02-hero-cover-announcement",
    width: 1200,
    height: 1100,
    body: `
      <section class="block block-hero">
        <div class="hero-copy">
          <p class="eyebrow">The Official Cover Is Here</p>
          <h1>Unfolding Origami: A Memoir is now available for preorder.</h1>
          <p>I’m so grateful to finally share the official cover with you. This book has been years in the making, and seeing it take shape as something real, visible, and close to readers’ hands has been emotional in a way I’m still trying to find language for.</p>
          <p class="release">Releasing July 2026</p>
        </div>
        <div class="hero-cover-panel">
          <p class="cover-kicker">The official cover is here.</p>
          <img class="cover-image" src="${fileUrl(assets.cover)}" alt="Cover of Unfolding Origami: A Memoir by Loren Galese">
        </div>
      </section>
    `,
  },
  {
    name: "03-preorder-buttons",
    width: 1200,
    height: 360,
    body: `
      <section class="block block-cta">
        <p class="eyebrow">Preorder options are now live</p>
        <div class="button-row">
          <span class="button button-primary">Preorder Signed Paperback</span>
          <span class="button button-secondary">Preorder Kindle Ebook</span>
        </div>
        <p class="small-line">Signed paperback: $24.99 · Kindle ebook preorder: $9.95</p>
      </section>
    `,
  },
  {
    name: "03a-preorder-signed-paperback",
    width: 1200,
    height: 220,
    body: ctaSplitBlock("Preorder Signed Paperback", "Signed paperback: $24.99", "primary"),
  },
  {
    name: "03b-preorder-kindle-ebook",
    width: 1200,
    height: 220,
    body: ctaSplitBlock("Preorder Kindle Ebook", "Kindle ebook preorder: $9.95", "secondary"),
  },
  {
    name: "04-excerpt-feature",
    width: 1200,
    height: 900,
    body: `
      <section class="block block-excerpt">
        <img class="motif motif-one" src="${fileUrl(assets.butterflyOne)}" alt="">
        <img class="motif motif-two" src="${fileUrl(assets.butterflyTwo)}" alt="">
        <div class="excerpt-copy">
          <p class="eyebrow">Private first-look excerpt</p>
          <h2>A Quiet First Look at Loren Galese’s Upcoming Memoir</h2>
          <p>As a thank-you for being here early, I wanted to share a private excerpt from <em>Unfolding Origami</em> before it is shared more widely.</p>
          <p>This excerpt comes from a chapter titled “Dumpster Fire Hair Trigger” and reflects on how trauma can collapse the distance between past and present — how the body can remember before the mind has time to catch up.</p>
          <div class="content-note">
            <strong>Please read at your own pace.</strong>
          </div>
          <span class="button button-primary excerpt-button">Read the Excerpt</span>
        </div>
        <div class="excerpt-band">
          <p>Unfolding Origami: A Memoir</p>
        </div>
      </section>
    `,
  },
  {
    name: "05-preorder-reminder",
    width: 1200,
    height: 760,
    body: `
      <section class="block block-reminder">
        <div class="reminder-card">
          <p class="eyebrow">Preorder reminder</p>
          <h2>Preorders matter more than most people realize.</h2>
          <p>They help show early interest in the book, support launch visibility, and make it easier for the memoir to reach readers who may need it.</p>
          <p>Signed paperback preorders are available now through The Woven Self.</p>
          <p>Kindle ebook preorders are available now through Amazon for $9.95.</p>
          <div class="button-row reminder-buttons">
            <span class="button button-primary">Preorder Signed Paperback</span>
            <span class="button button-secondary">Preorder Kindle Ebook</span>
          </div>
        </div>
      </section>
    `,
  },
  {
    name: "05a-reminder-signed-paperback",
    width: 1200,
    height: 220,
    body: ctaSplitBlock("Preorder Signed Paperback", "Signed paperback preorders are $24.99", "primary"),
  },
  {
    name: "05b-reminder-kindle-ebook",
    width: 1200,
    height: 220,
    body: ctaSplitBlock("Preorder Kindle Ebook", "Kindle ebook preorders are $9.95", "secondary"),
  },
  {
    name: "06-closing-note",
    width: 1200,
    height: 620,
    body: `
      <section class="block block-closing">
        <img class="motif motif-three" src="${fileUrl(assets.butterflyThree)}" alt="">
        <div class="closing-note">
          <p>Thank you for reading, sharing, preordering, and being part of this process.</p>
          <p>This book is about trauma, coercive control, identity, and the nonlinear journey back to self-trust. I’m grateful it is beginning to find its way toward readers.</p>
          <p class="signature">With gratitude,<br>Loren</p>
        </div>
      </section>
    `,
  },
  {
    name: "07-footer",
    width: 1200,
    height: 360,
    body: `
      <section class="block block-footer">
        <p class="footer-title">The Woven Self Therapeutic Services, LLC</p>
        <p>New Jersey</p>
        <p class="footer-label">Author updates:</p>
        <p>Instagram: @lorengaleseauthor</p>
        <p>Substack: Quiet Alchemy with Loren</p>
      </section>
    `,
  },
];

function fileUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;
}

function ctaSplitBlock(label, detail, variant) {
  return `
    <section class="block block-split-cta">
      <div class="split-inner">
        <span class="button ${variant === "primary" ? "button-primary" : "button-secondary"}">${label}</span>
        <p>${detail}</p>
      </div>
    </section>
  `;
}

function pageHtml(block) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    ${baseCss()}
  </style>
</head>
<body>
  ${block.body}
</body>
</html>`;
}

function baseCss() {
  return `
    :root {
      --blue: ${palette.blue};
      --paper: ${palette.paper};
      --cream: ${palette.cream};
      --rose: ${palette.rose};
      --text: ${palette.text};
      --border: ${palette.border};
      --white: ${palette.white};
    }

    * { box-sizing: border-box; }

    html,
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
      background: transparent;
      color: var(--text);
      font-family: "Inter", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    .block {
      position: relative;
      width: 1200px;
      overflow: hidden;
      background: var(--paper);
    }

    .block-header {
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 54px 120px;
    }

    .logo-panel {
      width: 540px;
      height: 136px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.42);
      border: 1px solid rgba(228, 215, 204, 0.78);
      border-radius: 34px;
    }

    .header-logo {
      width: 390px;
      height: auto;
      display: block;
    }

    .block-hero {
      height: 1100px;
      display: grid;
      grid-template-columns: 1fr 450px;
    }

    .hero-copy {
      width: 650px;
      margin-left: 120px;
      padding-top: 112px;
    }

    .eyebrow {
      margin: 0 0 30px;
      color: var(--rose);
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 0.13em;
      line-height: 1.25;
      text-transform: uppercase;
    }

    h1,
    h2 {
      margin: 0;
      color: var(--blue);
      font-family: "Playfair Display", Georgia, serif;
      font-weight: 600;
      line-height: 1.05;
    }

    h1 {
      max-width: 600px;
      font-size: 76px;
      letter-spacing: 0;
    }

    h2 {
      max-width: 820px;
      font-size: 70px;
      letter-spacing: 0;
    }

    p {
      margin: 28px 0 0;
      color: rgba(36, 49, 58, 0.82);
      font-size: 30px;
      line-height: 1.55;
      letter-spacing: 0;
    }

    em { font-style: italic; }

    .release {
      margin-top: 36px;
      color: var(--rose);
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .hero-cover-panel {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--blue);
      padding: 80px 46px;
      color: var(--cream);
    }

    .cover-kicker {
      margin: 0 0 28px;
      color: #f0b0b8;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.13em;
      line-height: 1.3;
      text-align: center;
      text-transform: uppercase;
    }

    .cover-image {
      display: block;
      width: 350px;
      height: auto;
      border-radius: 26px;
      box-shadow: 0 32px 70px rgba(0, 0, 0, 0.34);
    }

    .block-cta,
    .block-split-cta {
      height: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 120px;
      text-align: center;
    }

    .button-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      width: 100%;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 360px;
      min-height: 76px;
      border: 2px solid transparent;
      border-radius: 999px;
      padding: 18px 30px;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.1;
      text-align: center;
      white-space: nowrap;
    }

    .button-primary {
      background: var(--blue);
      color: var(--white);
      box-shadow: 0 14px 30px rgba(16, 34, 49, 0.13);
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.66);
      border-color: rgba(16, 34, 49, 0.44);
      color: var(--blue);
    }

    .small-line {
      margin-top: 26px;
      font-size: 24px;
      line-height: 1.4;
    }

    .block-split-cta {
      height: 220px;
      padding: 36px 120px;
    }

    .split-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-top: 1px solid rgba(228, 215, 204, 0.78);
      border-bottom: 1px solid rgba(228, 215, 204, 0.78);
    }

    .split-inner .button {
      width: 510px;
    }

    .split-inner p {
      margin-top: 18px;
      font-size: 23px;
      line-height: 1.3;
    }

    .block-excerpt {
      height: 900px;
      padding: 68px 120px 0;
    }

    .excerpt-copy {
      position: relative;
      z-index: 2;
      width: 790px;
    }

    .block-excerpt h2 {
      max-width: 790px;
      font-size: 62px;
    }

    .block-excerpt p {
      max-width: 800px;
      font-size: 25px;
      line-height: 1.42;
    }

    .content-note {
      width: 560px;
      margin-top: 24px;
      padding: 20px 28px;
      background: rgba(255, 255, 255, 0.76);
      border: 1px solid rgba(255, 255, 255, 0.78);
      border-radius: 28px;
      color: var(--blue);
      font-size: 24px;
      line-height: 1.35;
    }

    .excerpt-button {
      width: 330px;
      margin-top: 24px;
    }

    .excerpt-band {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 112px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--blue);
    }

    .excerpt-band p {
      margin: 0;
      color: rgba(255, 248, 240, 0.9);
      font-family: "Playfair Display", Georgia, serif;
      font-size: 34px;
      line-height: 1.2;
    }

    .motif {
      position: absolute;
      display: block;
      pointer-events: none;
      filter: drop-shadow(0 12px 18px rgba(16, 34, 49, 0.16));
    }

    .motif-one {
      width: 104px;
      right: 160px;
      top: 92px;
      opacity: 0.82;
      transform: rotate(8deg);
    }

    .motif-two {
      width: 92px;
      right: 280px;
      bottom: 184px;
      opacity: 0.48;
      transform: rotate(-12deg);
    }

    .block-reminder {
      height: 760px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 72px 120px;
    }

    .reminder-card {
      width: 960px;
      min-height: 590px;
      padding: 58px 70px;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid rgba(228, 215, 204, 0.9);
      border-radius: 36px;
      box-shadow: 0 20px 48px rgba(16, 34, 49, 0.08);
    }

    .reminder-card h2 {
      font-size: 60px;
    }

    .reminder-card p {
      font-size: 28px;
      line-height: 1.45;
    }

    .reminder-buttons {
      margin-top: 36px;
    }

    .block-closing {
      height: 620px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 82px 120px;
    }

    .closing-note {
      position: relative;
      z-index: 2;
      width: 850px;
      text-align: center;
    }

    .closing-note p {
      margin-top: 0;
      margin-bottom: 30px;
      color: var(--blue);
      font-family: "Playfair Display", Georgia, serif;
      font-size: 42px;
      line-height: 1.32;
    }

    .closing-note .signature {
      margin-bottom: 0;
      color: var(--rose);
      font-size: 38px;
      font-style: italic;
      line-height: 1.35;
    }

    .motif-three {
      width: 94px;
      right: 178px;
      top: 84px;
      opacity: 0.58;
      transform: rotate(12deg);
    }

    .block-footer {
      height: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--blue);
      padding: 56px 120px;
      text-align: center;
    }

    .block-footer p {
      margin: 8px 0 0;
      color: rgba(255, 248, 240, 0.84);
      font-size: 24px;
      line-height: 1.35;
    }

    .block-footer .footer-title {
      margin-top: 0;
      color: var(--cream);
      font-family: "Playfair Display", Georgia, serif;
      font-size: 34px;
      line-height: 1.2;
    }

    .footer-label {
      margin-top: 24px !important;
      color: #f0b0b8 !important;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  `;
}

async function assertAssets() {
  await Promise.all(
    Object.entries(assets).map(async ([label, assetPath]) => {
      const stat = await fs.stat(assetPath);
      if (!stat.isFile()) {
        throw new Error(`Missing asset ${label}: ${assetPath}`);
      }
    }),
  );
}

async function exportBlock(browser, block) {
  const page = await browser.newPage({
    viewport: { width: block.width, height: block.height },
    deviceScaleFactor: 1,
  });

  await page.setContent(pageHtml(block), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);

  const pngPath = path.join(outDir, `${block.name}.png`);
  const jpgPath = path.join(outDir, `${block.name}.jpg`);
  await page.locator(".block").screenshot({ path: pngPath, omitBackground: false });
  await page.close();

  await sharp(pngPath)
    .jpeg({
      quality: 86,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    })
    .toFile(jpgPath);

  const meta = await sharp(pngPath).metadata();
  if (meta.width !== block.width || meta.height !== block.height) {
    throw new Error(`${block.name}.png expected ${block.width}x${block.height}, got ${meta.width}x${meta.height}`);
  }

  return {
    name: block.name,
    png: pngPath,
    jpg: jpgPath,
    width: meta.width,
    height: meta.height,
  };
}

async function writePreviewHtml() {
  const rows = imageFilesForPreview
    .map(
      fileName => `      <figure>
        <img src="./${fileName}" alt="${altText(fileName)}">
        <figcaption>${fileName}</figcaption>
      </figure>`,
    )
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Newsletter Part 2 Image Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ece7df;
      color: ${palette.text};
      font-family: Inter, Arial, sans-serif;
    }
    main {
      width: min(700px, 100%);
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 20px 70px rgba(16, 34, 49, 0.16);
    }
    figure {
      margin: 0;
      padding: 0;
      background: ${palette.paper};
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    figcaption {
      padding: 8px 14px;
      background: rgba(16, 34, 49, 0.06);
      color: rgba(36, 49, 58, 0.72);
      font-size: 11px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <main aria-label="Newsletter Part 2 image block preview">
${rows}
  </main>
</body>
</html>
`;

  await fs.writeFile(path.join(outDir, "preview.html"), html, "utf8");
}

function altText(fileName) {
  const map = {
    "01-header-logo.png": "The Woven Self logo",
    "02-hero-cover-announcement.png": "The official cover announcement for Unfolding Origami: A Memoir by Loren Galese",
    "03a-preorder-signed-paperback.png": "Preorder signed paperback",
    "03b-preorder-kindle-ebook.png": "Preorder Kindle ebook",
    "04-excerpt-feature.png": "A quiet first look at Loren Galese's upcoming memoir",
    "05a-reminder-signed-paperback.png": "Preorder signed paperback",
    "05b-reminder-kindle-ebook.png": "Preorder Kindle ebook",
    "06-closing-note.png": "A closing note from Loren Galese",
    "07-footer.png": "The Woven Self Therapeutic Services footer",
  };
  return map[fileName] || fileName.replace(/[-_]/g, " ");
}

async function writeBuildMap() {
  const markdown = `# Flodesk Image Build Map — Newsletter Part 2

## Subject
A quiet first look inside Unfolding Origami

## Preview Text
The official cover is here, preorders are live, and I’m sharing a private excerpt with you first.

---

## Upload Order

### 1. Header
Image:
\`01-header-logo.png\`
Flodesk link:
No link required, or link to:
\`${urls.author}\`

Alt text:
The Woven Self logo

---

### 2. Hero
Image:
\`02-hero-cover-announcement.png\`
Flodesk link:
No link required.

Alt text:
The official cover announcement for Unfolding Origami: A Memoir by Loren Galese

---

### 3. Signed Paperback CTA
Image:
\`03a-preorder-signed-paperback.png\`
Flodesk link:
\`${urls.signedPaperback}\`

Alt text:
Preorder signed paperback

---

### 4. Kindle Ebook CTA
Image:
\`03b-preorder-kindle-ebook.png\`
Flodesk link:
\`${urls.kindle}\`

Alt text:
Preorder Kindle ebook

---

### 5. Excerpt Feature
Image:
\`04-excerpt-feature.png\`
Flodesk link:
\`${urls.excerpt}\`

Alt text:
A quiet first look at Loren Galese's upcoming memoir

---

### 6. Signed Paperback Reminder CTA
Image:
\`05a-reminder-signed-paperback.png\`
Flodesk link:
\`${urls.signedPaperback}\`

Alt text:
Preorder signed paperback

---

### 7. Kindle Ebook Reminder CTA
Image:
\`05b-reminder-kindle-ebook.png\`
Flodesk link:
\`${urls.kindle}\`

Alt text:
Preorder Kindle ebook

---

### 8. Closing Note
Image:
\`06-closing-note.png\`
Flodesk link:
No link required.

Alt text:
A closing note from Loren Galese

---

### 9. Footer
Image:
\`07-footer.png\`
Flodesk link:
No link required.

Alt text:
The Woven Self Therapeutic Services footer
`;

  await fs.writeFile(path.join(outDir, "flodesk-image-build-map.md"), markdown, "utf8");
}

async function writePreviewScreenshots(browser) {
  const previewUrl = pathToFileURL(path.join(outDir, "preview.html")).href;
  const desktopPage = await browser.newPage({ viewport: { width: 900, height: 1600 }, deviceScaleFactor: 1 });
  await desktopPage.goto(previewUrl, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: path.join(outDir, "preview-desktop.png"), fullPage: true });
  await desktopPage.close();

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 1200 }, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto(previewUrl, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(outDir, "preview-mobile.png"), fullPage: true });
  await mobilePage.close();
}

async function main() {
  await assertAssets();
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const exported = [];
    for (const block of blocks) {
      exported.push(await exportBlock(browser, block));
    }
    await writePreviewHtml();
    await writeBuildMap();
    await writePreviewScreenshots(browser);

    const jpgSizes = {};
    for (const block of blocks) {
      const stat = await fs.stat(path.join(outDir, `${block.name}.jpg`));
      jpgSizes[`${block.name}.jpg`] = stat.size;
    }

    console.log(JSON.stringify({ exported, jpgSizes }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
