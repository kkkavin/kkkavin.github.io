import { test, expect } from '@playwright/test';

// Guards the no-repetition rule on raw HTML (no JS executed):
// each page ships only its own content; shared markup comes from js/game-widget.js.
test.describe('No content duplication across pages', () => {
  test('landing page should contain no portfolio markup', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('block-wall');
    for (const marker of ['id="about"', 'p-card', 'contactForm', 'nav-links']) {
      expect(html, `landing must not contain ${marker}`).not.toContain(marker);
    }
  });

  test('portfolio page should contain no game markup', async ({ request }) => {
    const res = await request.get('/portfolio.html');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('id="about"');
    for (const marker of ['block-wall', 'id="game"', 'game-widget.js', '404.html']) {
      expect(html, `portfolio must not contain ${marker}`).not.toContain(marker);
    }
  });

  test('404 page should contain no refinement or portfolio markup', async ({ request }) => {
    const res = await request.get('/404.html');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('File not found');
    expect(html).toContain('href="portfolio.html"');
    for (const marker of ['id="about"', 'p-card', 'Under refinement']) {
      expect(html, `404 must not contain ${marker}`).not.toContain(marker);
    }
  });
});
