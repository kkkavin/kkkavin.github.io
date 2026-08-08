import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);
  });

  test('form should be visible', async ({ page }) => {
    const form = page.locator('#contactForm');
    await expect(form).toBeVisible();
  });

  test('should have all form fields', async ({ page }) => {
    const name = page.locator('#name');
    const email = page.locator('#email');
    const message = page.locator('#message');

    await expect(name).toBeVisible();
    await expect(email).toBeVisible();
    await expect(message).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submit = page.locator('#contactForm button[type="submit"]');
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Send Message/);
  });

  test('fields should have correct placeholders', async ({ page }) => {
    await expect(page.locator('#name')).toHaveAttribute('placeholder', 'Jane Doe');
    await expect(page.locator('#email')).toHaveAttribute('placeholder', 'jane@example.com');
    await expect(page.locator('#message')).toHaveAttribute('placeholder', /Tell me about/);
  });

  test('fields should have labels', async ({ page }) => {
    await expect(page.locator('label[for="name"]')).toHaveText('Your name');
    await expect(page.locator('label[for="email"]')).toHaveText('Your email');
    await expect(page.locator('label[for="message"]')).toHaveText('Your message');
  });

  test('fields should be required', async ({ page }) => {
    await expect(page.locator('#name')).toHaveAttribute('required');
    await expect(page.locator('#email')).toHaveAttribute('required');
    await expect(page.locator('#message')).toHaveAttribute('required');
  });

  test('should show success message on valid submission', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Hello, this is a test message.');

    await page.click('#contactForm button[type="submit"]');

    const success = page.locator('#formSuccess');
    await expect(success).toHaveClass(/show/);
    await expect(success).toBeVisible();
  });

  test('success message should hide after timeout', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Hello, this is a test message.');

    await page.click('#contactForm button[type="submit"]');

    const success = page.locator('#formSuccess');
    await expect(success).toHaveClass(/show/);

    // Wait for 4200ms timeout + buffer
    await page.waitForTimeout(5000);
    await expect(success).not.toHaveClass(/show/);
  });

  test('form should reset after submission', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Hello, this is a test message.');

    await page.click('#contactForm button[type="submit"]');

    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');
  });

  test('contact info should show email', async ({ page }) => {
    const emailLink = page.locator('.contact-mail');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:kavinkathiravan6787@gmail.com');
  });

  test('contact info should show location', async ({ page }) => {
    const location = page.locator('.contact-loc');
    await expect(location).toBeVisible();
    await expect(location).toContainText('Chennai');
  });
});
