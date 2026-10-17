import { test, expect } from '@playwright/test';

test.describe('Playwright MCP Exploration', () => {
  test('capture screenshots of all themes', async ({ page }) => {
    await page.goto('/');

    // Dark theme (default with dark colorScheme)
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/theme-dark.png', fullPage: false });

    // Light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/theme-light.png', fullPage: false });

    // Sunset theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'sunset');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/theme-sunset.png', fullPage: false });
  });

  test('capture console messages', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        messages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      messages.push(`[pageerror] ${error.message}`);
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Scroll through the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    console.log('Console messages found:', messages.length);
    for (const msg of messages) {
      console.log(msg);
    }
  });

  test('check for broken links', async ({ page }) => {
    const brokenLinks: string[] = [];

    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('github.com')) {
        brokenLinks.push(`${response.status()}: ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    console.log('Broken external links:', brokenLinks.length);
    for (const link of brokenLinks) {
      console.log(link);
    }
  });

  test('inspect accessibility tree structure', async ({ page }) => {
    await page.goto('/');

    // Check for missing landmarks
    const landmarks = await page.evaluate(() => {
      const results: string[] = [];

      // Check for main landmark
      if (!document.querySelector('main')) results.push('Missing <main> landmark');

      // Check for nav landmarks
      const navs = document.querySelectorAll('nav');
      let hasPrimaryNav = false;
      navs.forEach(nav => {
        if (nav.getAttribute('aria-label') === 'Primary') hasPrimaryNav = true;
      });
      if (!hasPrimaryNav) results.push('Missing primary nav with aria-label');

      // Check for header/footer
      if (!document.querySelector('header')) results.push('Missing <header> element');
      if (!document.querySelector('footer')) results.push('Missing <footer> element');

      // Check for skip link
      if (!document.querySelector('a[href="#main"], a.skip-link, [class*="skip"]')) {
        results.push('No skip-to-content link found');
      }

      // Check heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let prevLevel = 0;
      headings.forEach(h => {
        const level = parseInt(h.tagName[1]);
        if (level > prevLevel + 1 && prevLevel > 0) {
          results.push(`Heading skip: h${prevLevel} to h${level} (${h.textContent?.trim()})`);
        }
        prevLevel = level;
      });

      return results;
    });

    console.log('Accessibility findings:', landmarks.length);
    for (const item of landmarks) {
      console.log(item);
    }
  });

  test('check for performance issues', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
        loadComplete: perf.loadEventEnd - perf.startTime,
        domInteractive: perf.domInteractive - perf.startTime,
      };
    });

    console.log('Performance metrics:');
    console.log(`  DOM Interactive: ${metrics.domInteractive.toFixed(0)}ms`);
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(0)}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete.toFixed(0)}ms`);
  });

  test('check form validation behavior', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);

    // Try submitting empty form
    await page.click('#contactForm button[type="submit"]');
    await page.waitForTimeout(500);

    // Check if browser's native validation is triggered
    const nameValid = await page.evaluate(() => {
      const name = document.getElementById('name') as HTMLInputElement;
      return name.validity.valid;
    });

    console.log('Empty name field valid:', nameValid);

    // Fill and check
    await page.fill('#name', 'Test');
    await page.fill('#email', 'invalid-email');
    await page.click('#contactForm button[type="submit"]');
    await page.waitForTimeout(500);

    const emailValid = await page.evaluate(() => {
      const email = document.getElementById('email') as HTMLInputElement;
      return email.validity.valid;
    });

    console.log('Invalid email field valid:', emailValid);
  });
});
