import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should default to dark when system preference is dark', async ({ page }) => {
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should cycle through themes: dark -> light -> sunset -> dark', async ({ page }) => {
    const toggle = page.locator('#themeToggle');

    // dark -> light
    await toggle.click();
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');

    // light -> sunset
    await toggle.click();
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('sunset');

    // sunset -> dark
    await toggle.click();
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('should persist theme in localStorage', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    await toggle.click();

    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe('light');
  });

  test('should restore theme from localStorage on reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('theme', 'sunset'));
    await page.reload();

    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('sunset');
  });

  test('should update aria-label on theme change', async ({ page }) => {
    const toggle = page.locator('#themeToggle');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to sunset theme');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');
  });

  test('should have aria-pressed attribute', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toHaveAttribute('aria-pressed');
  });

  test('should show correct theme icon', async ({ page }) => {
    // In dark theme, moon icon should be visible
    const moonIcon = page.locator('.icon-moon');
    await expect(moonIcon).toBeVisible();
  });
});
