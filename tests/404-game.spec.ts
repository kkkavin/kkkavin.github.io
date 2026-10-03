import { test, expect } from '@playwright/test';

test.describe('404 File Not Found + KK Cube Run', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/404.html');
  });

  test('should show a classic file-not-found error', async ({ page }) => {
    const wall = page.locator('.block-wall');
    await expect(wall).toBeVisible();
    await expect(wall).toHaveAttribute('aria-label', '404: page not found');
    const blocks = page.locator('.block');
    await expect(blocks).toHaveCount(3); // "404"
    await expect(blocks.first()).toHaveText('4');
    await expect(page.locator('.notfound-sub')).toContainText("doesn't exist");
    await expect(page.locator('.eyebrow')).toContainText('File not found');
  });

  test('should show game canvas, score HUD, and hint', async ({ page }) => {
    await expect(page.locator('#game')).toBeVisible();
    await expect(page.locator('#score')).toBeVisible();
    await expect(page.locator('#hi')).toBeVisible();
    await expect(page.locator('#hint')).toContainText('Space');
    await expect(page.locator('#muteBtn')).toBeVisible();
  });

  test('pressing Space should start the game and increase score', async ({ page }) => {
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('idle');

    await page.keyboard.press('Space');
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');

    await page.waitForTimeout(1200);
    const score = await page.evaluate(() => (window as any).__cubeGame.getScore());
    expect(score).toBeGreaterThan(0);
    await expect(page.locator('#score')).not.toHaveText('00000');
  });

  test('tapping canvas should start the game (touch parity)', async ({ page }) => {
    await page.locator('#game').click();
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');
  });

  test('forced collision should show game over with restart guard', async ({ page }) => {
    await page.keyboard.press('Space');
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');

    // Drop an obstacle directly on the player to force a crash.
    await page.evaluate(() => {
      const g = (window as any).__cubeGame;
      g.state.obstacles.push({
        x: g.player.x + 5,
        y: g.player.y + 5,
        w: 20,
        h: 20,
        color: '#fff',
      });
    });

    await expect(page.locator('#gameOver')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#finalScore')).toBeVisible();

    // Immediate Space within the 750ms mercy window should NOT restart.
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await expect(page.locator('#gameOver')).toBeVisible();

    // After the guard elapses (game-time, not wall-clock), retry restarts.
    await page.waitForFunction(() => {
      const g = (window as any).__cubeGame;
      return g.state.now - g.state.deadAt >= 0.9;
    });
    await page.locator('#retryBtn').click();
    await expect(page.locator('#gameOver')).toBeHidden();
    await expect.poll(async () =>
      page.evaluate(() => (window as any).__cubeGame?.getMode()),
    ).toBe('running');
  });

  test('mute toggle should flip state and persist', async ({ page }) => {
    const mute = page.locator('#muteBtn');
    await expect(mute).toHaveAttribute('aria-pressed', 'false');
    await mute.click();
    await expect(mute).toHaveAttribute('aria-pressed', 'true');
    const stored = await page.evaluate(() => localStorage.getItem('kk-cube-muted'));
    expect(stored).toBe('1');
    await mute.click();
    await expect(mute).toHaveAttribute('aria-pressed', 'false');
  });

  test('high score should persist across reloads', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kk-cube-hi', '123'));
    await page.reload();
    await expect(page.locator('#hi')).toHaveText('00123');
  });

  test('jump should not throw and audio path should be safe', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

  test('canvas should be accessible with label and skip link', async ({ page }) => {
    await expect(page.locator('#game')).toHaveAttribute('role', 'img');
    await expect(page.locator('.skip-link')).toHaveAttribute('href', '#game');
  });

  test('theme toggle should cycle on 404 page', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toBeVisible();
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await toggle.click();
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).not.toBe(before);
  });

  test('actions row should match the landing page links', async ({ page }) => {
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
    await expect(github).toHaveAttribute('target', '_blank');
  });

  test('action buttons should be magnetic with hover styles', async ({ page }) => {
    const buttons = page.locator('.game-actions .btn.magnetic');
    await expect(buttons).toHaveCount(3);
  });
});
