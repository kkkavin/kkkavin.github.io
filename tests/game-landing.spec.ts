import { test, expect } from '@playwright/test';

test.describe('KK Cube Run landing (direct /404.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/404.html');
  });

  test('should show the game landing, not the 404 face', async ({ page }) => {
    await expect(page.locator('#modeLanding')).toBeVisible();
    await expect(page.locator('#modeNotFound')).toBeHidden();
    await expect(page.locator('#modeLanding .eyebrow')).toContainText('runner');
    await expect(page.locator('.landing-title')).toHaveText('KK Cube Run');
  });

  test('should offer portfolio, LinkedIn, and GitHub buttons', async ({ page }) => {
    const actions = page.locator('.game-actions');
    const portfolio = actions.locator('a[href="/"]');
    await expect(portfolio).toBeVisible();
    await expect(portfolio).toHaveText('Portfolio');
    const linkedin = actions.locator('a[href*="linkedin.com/in/kkkavin"]');
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute('target', '_blank');
    const github = actions.locator('a[href="https://github.com/kkkavin"]');
    await expect(github).toBeVisible();
    await expect(github).toHaveText('GitHub');
    await expect(actions.locator('.btn.magnetic')).toHaveCount(3);
  });

  test('should run the game', async ({ page }) => {
    await expect(page.locator('#game')).toBeVisible();
    await page.keyboard.press('Space');
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');
    await expect(page.locator('#themeToggle')).toBeVisible();
  });

  test('should set the game page title', async ({ page }) => {
    await expect(page).toHaveTitle(/KK Cube Run/);
  });
});
