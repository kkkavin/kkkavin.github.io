/* Shared templates for the game pages (index.html, 404.html).
 * Single source of truth for the mini nav, footer, and arcade section —
 * pages contain only their unique content plus <div data-widget="..."> slots.
 * Runs synchronously before js/game.js so the engine finds its nodes.
 */
(function () {
  'use strict';

  var htmlEl = document.documentElement;

  /* ===== Theme toggle (3-state order, same as portfolio) ===== */

  var themeOrder = ['dark', 'light', 'sunset'];
  var themeAria = {
    dark: 'Switch to light theme',
    light: 'Switch to sunset theme',
    sunset: 'Switch to dark theme'
  };

  function currentTheme() {
    return htmlEl.getAttribute('data-theme') || 'dark';
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) { /* storage unavailable */ }
  }

  function initThemeToggle(scope) {
    var toggle = scope.querySelector
      ? scope.querySelector('#themeToggle')
      : document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var cur = themeOrder.indexOf(currentTheme());
      var next = themeOrder[(cur + 1) % themeOrder.length];
      htmlEl.setAttribute('data-theme', next);
      toggle.setAttribute('aria-label', themeAria[next]);
      toggle.setAttribute('aria-pressed', String(next === 'dark'));
      saveTheme(next);
    });
    var initial = currentTheme();
    toggle.setAttribute('aria-label', themeAria[initial] || themeAria.dark);
    toggle.setAttribute('aria-pressed', String(initial === 'dark'));
  }

  /* ===== Templates ===== */

  var SUN_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var MOON_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SPARK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z"/><path d="M19 15c.2 2 1.2 3 3 3.2-1.8.2-2.8 1.2-3 3.2-.2-2-1.2-3-3-3.2 1.8-.2 2.8-1.2 3-3.2z"/></svg>';

  function navHTML(logoHref, logoLabel) {
    return (
      '<a class="skip-link" href="#game">Skip to game</a>' +
      '<header class="nav" id="nav">' +
        '<a class="nav-logo" href="' + logoHref + '" aria-label="' + logoLabel + '">' +
          '<span class="nav-logo-badge">KK</span>' +
          '<span class="nav-logo-text">K K Kavin</span>' +
        '</a>' +
        '<button class="theme-toggle" id="themeToggle" aria-label="Switch theme" aria-pressed="false">' +
          '<span class="theme-icon icon-moon">' + MOON_SVG + '</span>' +
          '<span class="theme-icon icon-sun">' + SUN_SVG + '</span>' +
          '<span class="theme-icon icon-spark">' + SPARK_SVG + '</span>' +
        '</button>' +
      '</header>'
    );
  }

  function footerHTML(logoHref) {
    return (
      '<footer class="footer">' +
        '<div class="footer-inner">' +
          '<a class="footer-logo" href="' + logoHref + '">K K Kavin</a>' +
          '<p>\u00A9 2026 K K Kavin \u2014 Built with HTML, CSS &amp; JavaScript.</p>' +
        '</div>' +
      '</footer>'
    );
  }

  var ARCADE_HTML =
    '<section class="arcade glass" aria-label="KK cube endless runner game">' +
      '<div class="hud">' +
        '<p class="hud-score">SCORE <span id="score" aria-live="polite">00000</span></p>' +
        '<p class="hud-score dim">HI <span id="hi">00000</span></p>' +
        '<button class="mute-btn" id="muteBtn" aria-pressed="false" aria-label="Mute sound">\uD83D\uDD0A</button>' +
      '</div>' +
      '<canvas id="game" role="img" aria-label="Endless runner game. Press space to make the KK cube jump over bugs."></canvas>' +
      '<p class="fallback-msg">Canvas is required to play. Your browser does not support it, but the links below still work.</p>' +
      '<p class="hint" id="hint"><kbd>Space</kbd> / <kbd>\u2191</kbd> / tap to jump \u2014 hold for higher</p>' +
      '<div class="gameover" id="gameOver" hidden>' +
        '<p class="gameover-title">Ouch! Bugs got you.</p>' +
        '<p class="gameover-score">Scored <span id="finalScore">0</span> \u00B7 Best <span id="finalHi">0</span></p>' +
        '<button class="btn btn-primary" id="retryBtn" type="button">Run again \u21BB</button>' +
      '</div>' +
    '</section>';

  /* ===== Inject into slots ===== */

  function inject() {
    var slots = document.querySelectorAll('[data-widget]');
    for (var i = 0; i < slots.length; i += 1) {
      var el = slots[i];
      var kind = el.getAttribute('data-widget');
      var html = '';
      if (kind === 'nav') {
        html = navHTML(el.getAttribute('data-logo-href') || '/', el.getAttribute('data-logo-label') || 'Back');
      } else if (kind === 'footer') {
        html = footerHTML(el.getAttribute('data-logo-href') || '/');
      } else if (kind === 'arcade') {
        html = ARCADE_HTML;
      }
      if (html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var parent = el.parentNode;
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, el);
        }
        parent.removeChild(el);
      }
    }
    initThemeToggle(document);
  }

  // This script loads synchronously at the end of <body>, after all slots
  // are parsed — inject immediately so js/game.js (next script) finds its nodes.
  inject();
})();
