import { test, expect } from '@playwright/test';

test.describe('Project Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have project section', async ({ page }) => {
    const section = page.locator('#projects');
    await expect(section).toBeAttached();
  });

  test('should display 5 project cards', async ({ page }) => {
    const cards = page.locator('.p-card');
    await expect(cards).toHaveCount(5);
  });

  test('project cards should have titles', async ({ page }) => {
    const titles = ['Study Sync', 'Portfolio Builder', 'FixRide', 'MetaWell', 'AR Treasure Hunt'];
    const cards = page.locator('.p-card h3');

    for (let i = 0; i < titles.length; i++) {
      await expect(cards.nth(i)).toHaveText(titles[i]);
    }
  });

  test('project cards should have descriptions', async ({ page }) => {
    const descriptions = page.locator('.p-card .p-body p');
    const count = await descriptions.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      const text = await descriptions.nth(i).textContent();
      expect(text!.length).toBeGreaterThan(10);
    }
  });

  test('project cards should have technology tags', async ({ page }) => {
    const tags = page.locator('.p-card .p-tags');
    const count = await tags.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      const tagCount = await tags.nth(i).locator('span').count();
      expect(tagCount).toBeGreaterThanOrEqual(3);
    }
  });

  test('project thumbnails should link to GitHub', async ({ page }) => {
    const thumbs = page.locator('.p-thumb');
    const count = await thumbs.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      await expect(thumbs.nth(i)).toHaveAttribute('href', /github\.com/);
      await expect(thumbs.nth(i)).toHaveAttribute('target', '_blank');
    }
  });

  test('project thumbnails should have glyphs', async ({ page }) => {
    const glyphs = page.locator('.thumb-glyph');
    const count = await glyphs.count();
    expect(count).toBe(5);

    const expectedGlyphs = ['SS', 'PB', 'FR', 'MW', 'AR'];
    for (let i = 0; i < count; i++) {
      await expect(glyphs.nth(i)).toHaveText(expectedGlyphs[i]);
    }
  });

  test('project counter should be visible', async ({ page }) => {
    const counter = page.locator('.projects-count');
    await expect(counter).toBeVisible();
    await expect(counter).toContainText('/ 05');
  });

  test('projects lead text should be visible', async ({ page }) => {
    const lead = page.locator('.projects-lead-text');
    await expect(lead).toBeVisible();
  });
});
