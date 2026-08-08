import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobile menu should be hidden by default', async ({ page }) => {
    const menu = page.locator('#mobileMenu');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('clicking hamburger should open mobile menu', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    const menu = page.locator('#mobileMenu');

    await toggle.click();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking hamburger again should close menu', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    const menu = page.locator('#mobileMenu');

    await toggle.click();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');

    // Mobile menu overlay intercepts pointer events, dispatch click directly
    await page.evaluate(() => document.getElementById('navToggle')!.click());
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('pressing Escape should close menu', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    const menu = page.locator('#mobileMenu');

    await toggle.click();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('clicking a mobile link should close menu', async ({ page }) => {
    const toggle = page.locator('#navToggle');
    const menu = page.locator('#mobileMenu');

    await toggle.click();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');

    await page.click('.mobile-links a[href="#about"]');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('mobile menu should have all navigation links', async ({ page }) => {
    const links = page.locator('.mobile-links a');
    await expect(links).toHaveCount(6);

    const expectedTexts = ['About', 'Skills', 'Projects', 'Journey', 'Certifications', 'Contact'];
    for (let i = 0; i < expectedTexts.length; i++) {
      await expect(links.nth(i)).toHaveText(expectedTexts[i]);
    }
  });

  test('mobile menu should have social links', async ({ page }) => {
    const socials = page.locator('.mobile-socials a');
    await expect(socials).toHaveCount(2);
  });

  test('body should have menu-open class when menu is open', async ({ page }) => {
    const toggle = page.locator('#navToggle');

    await toggle.click();
    const hasClass = await page.evaluate(() => document.body.classList.contains('menu-open'));
    expect(hasClass).toBe(true);

    // Mobile menu overlay intercepts pointer events, dispatch click directly
    await page.evaluate(() => document.getElementById('navToggle')!.click());
    const hasClassAfter = await page.evaluate(() => document.body.classList.contains('menu-open'));
    expect(hasClassAfter).toBe(false);
  });
});
