import { test, expect } from '@playwright/test';

test.describe('Scroll Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('scroll progress bar should exist', async ({ page }) => {
    const progress = page.locator('.scroll-progress');
    await expect(progress).toBeAttached();
    await expect(progress).toHaveAttribute('aria-hidden', 'true');
  });

  test('scroll progress should update on scroll', async ({ page }) => {
    const progress = page.locator('.scroll-progress');

    // At top, progress should be 0
    let transform = await progress.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toContain('matrix');

    // Scroll to middle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    transform = await progress.evaluate((el) => el.style.transform);
    expect(transform).toContain('scaleX');
  });

  test('hero section should be visible at top', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
  });

  test('hero should have typing element', async ({ page }) => {
    const typed = page.locator('#typed');
    await expect(typed).toBeAttached();
  });

  test('hero should have action buttons', async ({ page }) => {
    const viewWork = page.locator('.hero-actions .btn-primary');
    const viewResume = page.locator('.hero-actions .btn-ghost');

    await expect(viewWork).toBeVisible();
    await expect(viewWork).toHaveText(/View My Work/);
    await expect(viewResume).toBeVisible();
    await expect(viewResume).toHaveText(/View Resume/);
  });

  test('hero socials should have GitHub and LinkedIn', async ({ page }) => {
    const github = page.locator('.hero-socials a[aria-label="GitHub"]');
    const linkedin = page.locator('.hero-socials a[aria-label="LinkedIn"]');

    await expect(github).toBeVisible();
    await expect(linkedin).toBeVisible();
    await expect(github).toHaveAttribute('href', 'https://github.com/kkkavin');
    await expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/kkkavin');
  });

  test('scroll cue should exist', async ({ page }) => {
    const scrollCue = page.locator('.scroll-cue');
    await expect(scrollCue).toBeAttached();
    await expect(scrollCue).toHaveAttribute('aria-label', 'Scroll to about section');
  });

  test('nav should update active link on scroll', async ({ page }) => {
    // Scroll to about section
    await page.evaluate(() => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const aboutLink = page.locator('.nav-links a[href="#about"]');
    await expect(aboutLink).toHaveClass(/active/);
  });

  test('custom cursor elements should exist', async ({ page }) => {
    const ring = page.locator('.cursor-ring');
    const dot = page.locator('.cursor-dot');
    const pointer = page.locator('.cursor-pointer');

    await expect(ring).toBeAttached();
    await expect(dot).toBeAttached();
    await expect(pointer).toBeAttached();
  });
});
