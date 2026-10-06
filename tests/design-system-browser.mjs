import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8080';
const chromePath = process.env.CHROME_EXECUTABLE_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

const routes = [
  '/',
  '/about.html',
  '/author.html',
  '/blog.html',
  '/blog/post.html?slug=the-parts-we-carry',
  '/blog/post.html?slug=design-system-qa-missing-post',
  '/coaching.html',
  '/peer-support.html',
  '/preorder.html',
  '/preorder-thank-you.html',
  '/speaking.html',
  '/substack.html',
  '/therapy.html',
];
const widths = [1440, 1280, 768, 320];
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const failures = [];
const pageErrors = [];
const consoleErrors = [];
const screenshotOutput = process.env.QA_OUTPUT_DIR;

if (screenshotOutput) await mkdir(screenshotOutput, { recursive: true });

function isExpectedVercel404(url, message = '') {
  return /_vercel\/speed-insights|vercel-scripts\.com/i.test(`${url} ${message}`);
}

function isExpectedMissingPost(url) {
  return new URL(url, baseUrl).pathname === '/blog/posts/design-system-qa-missing-post.md';
}

async function waitForRenderedStyles(page) {
  await page.waitForLoadState('load', { timeout: 12000 }).catch(() => {});
  await page.waitForFunction(() => {
    const probe = document.createElement('div');
    probe.className = 'hidden';
    document.body.append(probe);
    const utilityStylesLoaded = getComputedStyle(probe).display === 'none';
    probe.remove();
    const sharedStylesLoaded = getComputedStyle(document.documentElement)
      .getPropertyValue('--control-height').trim() === '3.25rem';
    return utilityStylesLoaded && sharedStylesLoaded;
  }, null, { timeout: 15000 });
  await page.evaluate(async () => {
    const localStylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .filter((link) => new URL(link.href).origin === location.origin);
    await Promise.all(localStylesheets.map((link) => link.sheet
      ? Promise.resolve()
      : new Promise((resolve) => {
        link.addEventListener('load', resolve, { once: true });
        link.addEventListener('error', resolve, { once: true });
      })));
    await document.fonts.ready;
  });
}

async function checkRouteAtWidth(page, route, width) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(new URL(route, baseUrl).href, {
    waitUntil: 'domcontentloaded',
    timeout: 20000,
  });
  assert.ok(response && response.ok(), `${route} returned ${response?.status() ?? 'no response'}`);
  await page.locator('body').waitFor({ state: 'visible' });
  await waitForRenderedStyles(page);

  if (route.includes('slug=design-system-qa-missing-post')) {
    await page.locator('#post-meta h1').filter({ hasText: 'Post not found' }).waitFor();
    assert.ok(await page.locator('#post-content a[href="../blog.html"]').isVisible(),
      'Missing posts provide a visible recovery link');
  } else if (route.includes('slug=the-parts-we-carry')) {
    await page.locator('#post-meta h1').filter({ hasText: 'The Parts We Carry' }).waitFor();
  }

  const result = await page.evaluate(() => {
    const ctas = [...document.querySelectorAll(
      'a.btn-primary, a.btn-secondary, button.btn-primary, button.btn-secondary',
    )].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });
    const problems = [];
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    if (overflow > 1) problems.push(`horizontal overflow ${overflow}px`);

    for (const cta of ctas) {
      const rect = cta.getBoundingClientRect();
      const label = cta.querySelector('.btn-label');
      const arrow = cta.querySelector('.btn-arrow');
      if (!label || !arrow) {
        problems.push(`CTA missing label or arrow: ${cta.textContent.trim()}`);
        continue;
      }
      const labelRect = label.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();
      if (rect.height < 44) problems.push(`CTA target under 44px high: ${cta.textContent.trim()} (${rect.height}px)`);
      if (labelRect.right > arrowRect.left + 1) problems.push(`CTA label overlaps arrow: ${cta.textContent.trim()}`);
      if (arrowRect.left < rect.left - 1 || arrowRect.right > rect.right + 1
        || arrowRect.top < rect.top - 1 || arrowRect.bottom > rect.bottom + 1) {
        problems.push(`CTA arrow outside button: ${cta.textContent.trim()}`);
      }
      if (label.scrollWidth > label.clientWidth + 1) problems.push(`CTA label clips: ${cta.textContent.trim()}`);
      if (cta.querySelectorAll('.btn-arrow').length !== 1) problems.push(`CTA has multiple arrow marks: ${cta.textContent.trim()}`);
      const afterContent = getComputedStyle(cta, '::after').content;
      if (afterContent && afterContent !== 'none' && afterContent !== 'normal') {
        problems.push(`CTA has a second CSS-generated mark: ${cta.textContent.trim()}`);
      }
      const card = cta.closest('.card, article');
      if (card) {
        const cardRect = card.getBoundingClientRect();
        if (rect.left < cardRect.left - 1 || rect.right > cardRect.right + 1) {
          problems.push(`CTA extends beyond card: ${cta.textContent.trim()}`);
        }
      }
    }
    return { problems, ctaCount: ctas.length, overflow };
  });

  assert.deepEqual(result.problems, [], `${route} at ${width}px: ${result.problems.join('; ')}`);
}

async function checkMenu(page, route) {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(new URL(route, baseUrl).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await waitForRenderedStyles(page);
  const trigger = page.locator('.hamburger');
  const drawer = page.locator('#mobile-nav');
  const backdrop = page.locator('#mobile-nav-panel');
  const closeButton = page.locator('#close-mobile-nav');
  await trigger.waitFor({ state: 'visible' });

  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', `${route} menu starts closed`);
  assert.equal(await drawer.getAttribute('aria-hidden'), 'true', `${route} drawer starts hidden`);
  assert.equal(await drawer.evaluate((element) => element.inert), true, `${route} drawer starts inert`);
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < 14; i += 1) await page.keyboard.press('Tab');
  assert.equal(await drawer.evaluate((element) => element.contains(document.activeElement)), false,
    `${route} hidden links must not receive keyboard focus`);

  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true', `${route} menu opens`);
  assert.equal(await drawer.getAttribute('aria-hidden'), 'false', `${route} drawer is exposed when open`);
  assert.equal(await drawer.evaluate((element) => element.inert), false, `${route} drawer is active when open`);
  assert.equal(await closeButton.evaluate((element) => element === document.activeElement), true,
    `${route} focus moves into the drawer`);
  assert.equal(await page.locator('header').evaluate((element) => element.inert), true,
    `${route} background is inert while open`);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden',
    `${route} body scroll locks while open`);

  const focusable = drawer.locator('a[href], button:not([disabled])');
  const count = await focusable.count();
  assert.ok(count >= 2, `${route} drawer needs multiple focus stops`);
  await focusable.nth(count - 1).focus();
  await page.keyboard.press('Tab');
  assert.equal(await closeButton.evaluate((element) => element === document.activeElement), true,
    `${route} Tab wraps from the last stop to the first`);
  await closeButton.focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await focusable.nth(count - 1).evaluate((element) => element === document.activeElement), true,
    `${route} Shift+Tab wraps from the first stop to the last`);

  await page.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', `${route} Escape closes the menu`);
  assert.equal(await drawer.getAttribute('aria-hidden'), 'true', `${route} Escape hides the drawer`);
  assert.equal(await drawer.evaluate((element) => element.inert), true, `${route} Escape makes drawer inert`);
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true,
    `${route} focus returns to the trigger after Escape`);
  assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden',
    `${route} Escape restores scrolling`);

  await trigger.click();
  await backdrop.click({ position: { x: 12, y: 12 } });
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', `${route} backdrop click closes the menu`);
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true,
    `${route} focus returns to the trigger after backdrop close`);

  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForFunction(() => document.querySelector('.hamburger')?.getAttribute('aria-expanded') === 'false');
  assert.equal(await drawer.evaluate((element) => element.inert), true, `${route} desktop resize closes the drawer`);
}

async function checkRepresentativeCtas(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(new URL('/', baseUrl).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await waitForRenderedStyles(page);

  const checks = [
    { selector: 'a.btn-primary', name: 'primary CTA' },
    { selector: 'a.btn-secondary', name: 'secondary CTA' },
  ];
  for (const check of checks) {
    const cta = page.locator(check.selector).filter({ visible: true }).first();
    await cta.waitFor({ state: 'visible' });

    const before = await cta.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        transform: style.transform,
        boxShadow: style.boxShadow,
        display: style.display,
        labelDecoration: getComputedStyle(element.querySelector('.btn-label')).textDecorationLine,
      };
    });
    assert.match(before.display, /flex/, `${check.name} should use flex alignment`);

    await cta.hover();
    await page.waitForTimeout(300);
    const hover = await cta.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        hovered: element.matches(':hover'),
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        transform: style.transform,
        boxShadow: style.boxShadow,
        labelDecoration: getComputedStyle(element.querySelector('.btn-label')).textDecorationLine,
      };
    });
    assert.equal(hover.hovered, true, `${check.name} should receive pointer hover`);
    assert.ok(['color', 'backgroundColor', 'borderColor', 'transform', 'boxShadow', 'labelDecoration']
      .some((property) => hover[property] !== before[property]), `${check.name} should visibly respond to hover`);

    const contrast = await cta.evaluate((element) => {
      const parse = (value) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const channels = match[1].split(',').map((item) => Number.parseFloat(item.trim()));
        return channels.length >= 3 ? channels.slice(0, 3) : null;
      };
      const luminance = ([r, g, b]) => {
        const channel = (value) => {
          const srgb = value / 255;
          return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const foreground = parse(getComputedStyle(element).color);
      let background = null;
      for (let node = element; node && !background; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor;
        const components = color.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map((value) => Number.parseFloat(value.trim()));
        if (components && (components.length < 4 || components[3] > 0)) background = components.slice(0, 3);
      }
      background ||= [250, 247, 242];
      if (!foreground) return { ratio: 0 };
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return { ratio: (values[0] + 0.05) / (values[1] + 0.05) };
    });
    assert.ok(contrast.ratio >= 4.5, `${check.name} text contrast ${contrast.ratio.toFixed(2)}:1 is below 4.5:1`);

    const anatomy = await cta.evaluate((element) => {
      const label = element.querySelector('.btn-label')?.getBoundingClientRect();
      const arrow = element.querySelector('.btn-arrow')?.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        alignsCenter: style.alignItems === 'center',
        gap: label && arrow ? arrow.left - label.right : -1,
        labelAndArrowPresent: Boolean(label && arrow),
      };
    });
    assert.equal(anatomy.labelAndArrowPresent, true, `${check.name} should have a label and arrow`);
    assert.equal(anatomy.alignsCenter, true, `${check.name} label and arrow should align vertically`);
    assert.ok(anatomy.gap >= 4, `${check.name} label/arrow gap ${anatomy.gap.toFixed(1)}px is too small`);

    await cta.evaluate((element) => element.focus({ focusVisible: true }));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const focus = await cta.evaluate((element) => ({
      visible: element.matches(':focus-visible'),
      outlineStyle: getComputedStyle(element).outlineStyle,
      outlineWidth: Number.parseFloat(getComputedStyle(element).outlineWidth),
    }));
    assert.equal(focus.visible, true, `${check.name} should expose keyboard focus`);
    assert.notEqual(focus.outlineStyle, 'none', `${check.name} should draw a focus outline`);
    assert.ok(focus.outlineWidth >= 2, `${check.name} focus outline should be at least 2px`);
  }
}

try {
  const page = await browser.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (!isExpectedVercel404(message.location().url, text)
      && !isExpectedMissingPost(message.location().url)) consoleErrors.push(text);
  });
  page.on('response', (response) => {
    if (response.status() >= 400
      && (isExpectedVercel404(response.url()) || isExpectedMissingPost(response.url()))) return;
    if (response.status() >= 400) consoleErrors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of routes) {
    for (const width of widths) {
      try {
        await checkRouteAtWidth(page, route, width);
      } catch (error) {
        failures.push(`${route} at ${width}px: ${error.message}`);
      }
      const screenshotName = {
        '/': 'home',
        '/author.html': 'author',
        '/therapy.html': 'therapy',
        '/coaching.html': 'coaching',
      }[route];
      if (screenshotOutput && screenshotName
        && ((width === 1440 && route !== '/coaching.html')
          || (width === 320 && route !== '/coaching.html')
          || (width === 768 && route === '/coaching.html'))) {
        try {
          await page.screenshot({
            path: path.join(screenshotOutput, `${screenshotName}-${width}.png`),
            fullPage: false,
          });
        } catch (error) {
          failures.push(`${route} at ${width}px screenshot: ${error.message}`);
        }
      }
    }
    try {
      await checkMenu(page, route);
    } catch (error) {
      failures.push(`${route} menu: ${error.message}`);
    }
  }
  try {
    await checkRepresentativeCtas(page);
  } catch (error) {
    failures.push(`representative CTA states: ${error.message}`);
  }
  await page.close();
} finally {
  await browser.close();
}

if (pageErrors.length) failures.push(`page errors: ${pageErrors.join('; ')}`);
if (consoleErrors.length) failures.push(`unexpected console/network errors: ${consoleErrors.join('; ')}`);

if (failures.length) {
  console.error(`Design-system browser QA failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Design-system browser QA passed for ${routes.length} routes at ${widths.join(', ')}px, including menu keyboard and resize behavior.`);
}
