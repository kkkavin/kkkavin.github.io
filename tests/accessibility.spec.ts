import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have no critical axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should have lang attribute on html', async ({ page }) => {
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(/K K Kavin/);
  });

  test('all images should have alt text or be decorative', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('navigation should have aria-label', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Primary"]');
    await expect(nav).toBeAttached();
  });

  test('theme toggle should have accessible name', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    const label = await toggle.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label!.length).toBeGreaterThan(0);
  });

  test('mobile menu toggle should have aria attributes', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle menu');
    await expect(toggle).toHaveAttribute('aria-expanded');
    await expect(toggle).toHaveAttribute('aria-controls', 'mobileMenu');
  });

  test('mobile menu should have aria-hidden', async ({ page }) => {
    const menu = page.locator('#mobileMenu');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('decorative elements should have aria-hidden', async ({ page }) => {
    const decorativeElements = [
      '.scroll-progress',
      '.cursor-ring',
      '.cursor-dot',
      '.cursor-pointer',
      '.grain',
      '.bg',
    ];

    for (const selector of decorativeElements) {
      const el = page.locator(selector);
      const count = await el.count();
      if (count > 0) {
        await expect(el.first()).toHaveAttribute('aria-hidden', 'true');
      }
    }
  });

  test('form inputs should have labels', async ({ page }) => {
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const messageInput = page.locator('#message');

    await expect(page.locator('label[for="name"]')).toBeAttached();
    await expect(page.locator('label[for="email"]')).toBeAttached();
    await expect(page.locator('label[for="message"]')).toBeAttached();
  });

  test('external links should have rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('success message should have role="status"', async ({ page }) => {
    const success = page.locator('#formSuccess');
    await expect(success).toHaveAttribute('role', 'status');
    await expect(success).toHaveAttribute('aria-live', 'polite');
  });

  test('skip to content or landmark regions should exist', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeAttached();

    const header = page.locator('header');
    await expect(header).toBeAttached();

    const footer = page.locator('footer');
    await expect(footer).toBeAttached();
  });
});
