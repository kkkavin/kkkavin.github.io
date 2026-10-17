import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.describe('Desktop (1200px)', () => {
    test.use({ viewport: { width: 1200, height: 800 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('navigation links should be visible', async ({ page }) => {
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeVisible();
    });

    test('mobile toggle should be hidden', async ({ page }) => {
      const toggle = page.locator('#navToggle');
      await expect(toggle).toBeHidden();
    });

    test('mobile menu should be hidden', async ({ page }) => {
      const menu = page.locator('#mobileMenu');
      await expect(menu).toBeHidden();
    });

    test('hero section should be visible', async ({ page }) => {
      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
    });
  });

  test.describe('Tablet (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('site should be usable', async ({ page }) => {
      const nav = page.locator('#nav');
      await expect(nav).toBeVisible();

      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
    });

    test('about section should be visible', async ({ page }) => {
      await page.evaluate(() => {
        const about = document.getElementById('about');
        if (about) about.scrollIntoView();
      });
      await page.waitForTimeout(500);

      const about = page.locator('#about');
      await expect(about).toBeVisible();
    });
  });

  test.describe('Mobile (375px)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('mobile toggle should be visible', async ({ page }) => {
      const toggle = page.locator('#navToggle');
      await expect(toggle).toBeVisible();
    });

    test('desktop nav links should be hidden', async ({ page }) => {
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeHidden();
    });

    test('hero should be visible', async ({ page }) => {
      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
    });

    test('site should be scrollable', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('contact form should be usable', async ({ page }) => {
      await page.evaluate(() => {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView();
      });
      await page.waitForTimeout(500);

      const nameInput = page.locator('#name');
      await expect(nameInput).toBeVisible();

      await nameInput.fill('Test User');
      await expect(nameInput).toHaveValue('Test User');
    });
  });

  test.describe('Small Mobile (320px)', () => {
    test.use({ viewport: { width: 320, height: 568 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('site should not overflow horizontally', async ({ page }) => {
      const overflowX = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflowX).toBe(false);
    });

    test('site should be usable at small size', async ({ page }) => {
      const nav = page.locator('#nav');
      await expect(nav).toBeVisible();

      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
    });
  });
});
