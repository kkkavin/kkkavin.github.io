import { test, expect } from '@playwright/test';

test.describe('Typing Effect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('typing element should exist', async ({ page }) => {
    const typed = page.locator('#typed');
    await expect(typed).toBeAttached();
  });

  test('should display a role after typing starts', async ({ page }) => {
    const typed = page.locator('#typed');
    // Wait for typing to start (600ms initial delay + some typing time)
    await page.waitForTimeout(1500);
    const text = await typed.textContent();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should cycle through different roles', async ({ page }) => {
    const typed = page.locator('#typed');
    const roles = new Set<string>();

    // Collect typed roles over several seconds
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(500);
      const text = await typed.textContent();
      if (text && text.length > 3) {
        roles.add(text);
      }
    }

    // Should have seen at least 2 different roles
    expect(roles.size).toBeGreaterThanOrEqual(2);
  });

  test('should have caret element', async ({ page }) => {
    const caret = page.locator('.caret');
    await expect(caret).toBeAttached();
    await expect(caret).toHaveAttribute('aria-hidden', 'true');
  });

  test('caret should be visible', async ({ page }) => {
    const caret = page.locator('.caret');
    await expect(caret).toBeVisible();
  });
});
