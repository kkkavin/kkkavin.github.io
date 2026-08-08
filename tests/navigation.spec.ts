import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a visible navigation bar', async ({ page }) => {
    const nav = page.locator('#nav');
    await expect(nav).toBeVisible();
  });

  test('should display logo linking to hero', async ({ page }) => {
    const logo = page.locator('.nav-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '#hero');
  });

  test('should have all navigation links', async ({ page }) => {
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(6);

    const expectedTexts = ['About', 'Skills', 'Projects', 'Journey', 'Certifications', 'Contact'];
    for (let i = 0; i < expectedTexts.length; i++) {
      await expect(links.nth(i)).toHaveText(expectedTexts[i]);
    }
  });

  test('navigation links should point to correct sections', async ({ page }) => {
    const expectedHrefs = ['#about', '#skills', '#projects', '#journey', '#certifications', '#contact'];
    const links = page.locator('.nav-links a');

    for (let i = 0; i < expectedHrefs.length; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', expectedHrefs[i]);
    }
  });

  test('clicking nav link should scroll to section', async ({ page }) => {
    await page.click('.nav-links a[href="#about"]');
    await page.waitForTimeout(500);
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('nav should have scrolled class after scrolling', async ({ page }) => {
    const nav = page.locator('#nav');
    await expect(nav).not.toHaveClass(/scrolled/);
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(200);
    await expect(nav).toHaveClass(/scrolled/);
  });

  test('should have theme toggle button', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-label', /Switch to/);
  });

  test('mobile menu toggle should exist in DOM', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    await expect(toggle).toBeAttached();
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('footer should have back to top link', async ({ page }) => {
    const backTop = page.locator('.back-top');
    await expect(backTop).toBeVisible();
    await expect(backTop).toHaveAttribute('href', '#hero');
  });
});
