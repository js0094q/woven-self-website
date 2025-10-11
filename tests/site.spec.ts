import { test, expect } from '@playwright/test';
import path from 'path';

const pageUrl = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('The Woven Self marketing site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);
  });

  test('renders hero content and booking CTAs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Trauma therapy for when your story feels tangled/i })).toBeVisible();
    const bookingButtons = page.locator('[data-booking-link]');
    await expect(bookingButtons.first()).toBeVisible();
    await expect(bookingButtons.first()).toHaveAttribute('href', /helloalma/);
  });

  test('mobile navigation toggles open and closed', async ({ page }) => {
    const projectName = test.info().project.name;
    test.skip(!/Mobile|Pixel/i.test(projectName), 'Navigation drawer only tested on mobile viewports');

    const toggle = page.getByRole('button', { name: /toggle navigation/i });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-drawer')).toHaveAttribute('aria-hidden', 'false');

    await page.getByRole('button', { name: /close navigation/i }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#mobile-drawer')).toHaveAttribute('aria-hidden', 'true');
  });

  test('contact form submits successfully with confirmation message', async ({ page }) => {
    await page.fill('#contact-name', 'Playwright Tester');
    await page.fill('#contact-email', 'tester@example.com');
    await page.fill('#contact-phone', '9735550000');
    await page.fill('#contact-message', 'Testing the secure contact form.');

    const status = page.locator('#form-status');
    await page.getByRole('button', { name: /send secure message/i }).click();
    await expect(status).toHaveAttribute('data-state', 'pending', { timeout: 2000 });
    await expect(status).toHaveAttribute('data-state', 'success', { timeout: 6000 });
    await expect(status).toContainText(/thank you/i);
  });

  test('structured data includes business details', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).not.toBeNull();
    const data = JSON.parse(jsonLd ?? '{}');
    expect(data['@type']).toBe('MedicalBusiness');
    expect(data.name).toMatch(/Woven Self/i);
    expect(data.telephone).toContain('973');
  });
});
