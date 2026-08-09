import { test, expect } from '@playwright/test';

test.describe('Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/K K Kavin/);
  });

  test('page should have meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /K K Kavin/);
  });

  test('page should have viewport meta tag', async ({ page }) => {
    const meta = page.locator('meta[name="viewport"]');
    await expect(meta).toHaveAttribute('content', /width=device-width/);
  });

  test('should have favicon', async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toBeAttached();
    await expect(favicon).toHaveAttribute('type', 'image/svg+xml');
  });

  test('should load Google Fonts', async ({ page }) => {
    const fonts = page.locator('link[href*="fonts.googleapis.com"][rel="stylesheet"]');
    await expect(fonts).toBeAttached();
  });

  test('should load CSS stylesheet', async ({ page }) => {
    const css = page.locator('link[rel="stylesheet"][href*="style.css"]');
    await expect(css).toBeAttached();
  });

  test('should load JavaScript files', async ({ page }) => {
    const lenis = page.locator('script[src*="lenis.min.js"]');
    const script = page.locator('script[src*="script.js"]');

    await expect(lenis).toBeAttached();
    await expect(script).toBeAttached();
  });

  test('About section should have bio content', async ({ page }) => {
    const bio = page.locator('.about-bio');
    await expect(bio).toBeVisible();
    const text = await bio.textContent();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('About section should have stats', async ({ page }) => {
    const stats = page.locator('.stat');
    await expect(stats).toHaveCount(3);

    const statLabels = page.locator('.stat-label');
    await expect(statLabels.nth(0)).toHaveText('Languages');
    await expect(statLabels.nth(1)).toHaveText('Flagship builds');
    await expect(statLabels.nth(2)).toHaveText('Day streak');
  });

  test('Skills section should have 3 skill cards', async ({ page }) => {
    const cards = page.locator('.skill-card');
    await expect(cards).toHaveCount(3);
  });

  test('Skills section should have skill bars', async ({ page }) => {
    const bars = page.locator('.bar-fill');
    const count = await bars.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('Journey section should have timeline items', async ({ page }) => {
    const items = page.locator('.tl-item');
    await expect(items).toHaveCount(3);
  });

  test('Certifications section should have cert cards', async ({ page }) => {
    const cards = page.locator('.cert-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('Achievements section should have achievement items', async ({ page }) => {
    const items = page.locator('.ach-item');
    await expect(items).toHaveCount(4);
  });

  test('Footer should have copyright text', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toContainText('2026 K K Kavin');
  });

  test('All section IDs should exist', async ({ page }) => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'journey', 'certifications', 'achievements', 'contact'];
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test('email links should be correct', async ({ page }) => {
    const emailLinks = page.locator('a[href="mailto:kavinkathiravan6787@gmail.com"]');
    const count = await emailLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
