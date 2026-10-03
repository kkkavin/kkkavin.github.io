import { test, expect } from '@playwright/test';

test.describe('Under Refinement landing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show UNDER REFINEMENT block letters, not construction', async ({ page }) => {
    const wall = page.locator('.block-wall');
    await expect(wall).toBeVisible();
    await expect(wall).toHaveAttribute('aria-label', 'Under refinement');
    const blocks = page.locator('.block');
    await expect(blocks).toHaveCount(15); // 5 + 10 letters
    await expect(blocks.first()).toHaveText('U');
    await expect(page.locator('.eyebrow')).toContainText('being refined');
  });

  test('should offer archived portfolio, LinkedIn, and GitHub buttons', async ({ page }) => {
    const actions = page.locator('.game-actions');
    const portfolio = actions.locator('a[href="portfolio.html"]');
    await expect(portfolio).toBeVisible();
    await expect(portfolio).toHaveText('Archived Portfolio');
    const linkedin = actions.locator('a[href*="linkedin.com/in/kkkavin"]');
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute('target', '_blank');
    const github = actions.locator('a[href="https://github.com/kkkavin"]');
    await expect(github).toBeVisible();
    await expect(github).toHaveText('GitHub');
    await expect(actions.locator('.btn.magnetic')).toHaveCount(3);
  });

  test('should run the game from the shared widget', async ({ page }) => {
    await expect(page.locator('#game')).toBeVisible();
    await page.keyboard.press('Space');
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');
    await expect(page.locator('#themeToggle')).toBeVisible();
  });

  test('should contain no portfolio content', async ({ page }) => {
    await expect(page.locator('#about')).toHaveCount(0);
    await expect(page.locator('.p-card')).toHaveCount(0);
    await expect(page.locator('#contactForm')).toHaveCount(0);
  });
});
