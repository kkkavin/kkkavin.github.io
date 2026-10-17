import { test, expect } from '@playwright/test';

// Guards the no-repetition rule on raw HTML (no JS executed):
// each page ships only its own content; shared markup comes from js/game-widget.js.
test.describe('No content duplication across pages', () => {
  test('portfolio page should contain no game markup', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('id="about"');
    for (const marker of ['block-wall', 'id="game"', 'game-widget.js']) {
      expect(html, `portfolio must not contain ${marker}`).not.toContain(marker);
    }
  });

  // Content change ⇒ stamp bump: pins the current asset versions so a
  // stale phone cache can never silently run pre-fix game code again.
  test('game assets should carry the current version stamp', async ({ request }) => {
    for (const path of ['/404.html']) {
      const res = await request.get(path);
      expect(res.ok()).toBeTruthy();
      const html = await res.text();
      for (const asset of ['js/game.js?v=20261017', 'js/game-widget.js?v=20261017', 'css/game.css?v=20261017']) {
        expect(html, `${path} must reference ${asset}`).toContain(asset);
      }
    }
  });

  test('404 page should contain no portfolio or refinement markup', async ({ request }) => {
    const res = await request.get('/404.html');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('File not found');
    expect(html).toContain('href="/"');
    for (const marker of ['id="about"', 'p-card', 'Under refinement']) {
      expect(html, `404 must not contain ${marker}`).not.toContain(marker);
    }
  });
});
