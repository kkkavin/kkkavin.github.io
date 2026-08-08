# Issues Found During Testing

**Test Date:** August 8, 2026
**Test Framework:** Playwright + @axe-core/playwright
**Tests Run:** 102 (102 passed, 0 failed)
**Browsers Tested:** Chromium (headless)
**Viewports Tested:** 1200x800, 768x1024, 375x812, 320x568

---

## Critical Issues

### 1. Contact Form Has No Backend Submission
- **File:** `js/script.js:678-689`
- **Severity:** High
- **Description:** The contact form only shows a success message and resets the form. No data is actually sent to a server. Users who submit the form believe their message was sent, but it was not.
- **Impact:** Users cannot actually contact the portfolio owner through the form.
- **Recommendation:** Integrate with a form service (Formspree, Netlify Forms, EmailJS) or add a `mailto:` fallback.

### 2. Mobile Menu Overlay Blocks Hamburger Button
- **File:** `index.html:104-121`, `css/style.css`
- **Severity:** Medium
- **Description:** When the mobile menu is open, the `.mobile-menu` overlay covers the hamburger toggle button, preventing users from clicking it to close the menu. Users must use the Escape key or tap a navigation link to close.
- **Impact:** Poor UX on mobile - users expect to toggle the menu with the same button.
- **Recommendation:** Ensure the hamburger button has a higher z-index than the mobile menu overlay, or add a close button inside the mobile menu.

---

## Accessibility Issues

### 3. No Skip-to-Content Link
- **File:** `index.html`
- **Severity:** Medium
- **Description:** There is no skip navigation link for keyboard users to bypass the navigation and go directly to the main content.
- **Impact:** Keyboard and screen reader users must tab through all navigation links before reaching content.
- **Recommendation:** Add a visually hidden skip link: `<a href="#hero" class="skip-link">Skip to content</a>`.

### 4. Theme Toggle `aria-pressed` Semantics
- **File:** `js/script.js:625`
- **Severity:** Low
- **Description:** The `aria-pressed` attribute is only set to `true` when the dark theme is active. For a three-state toggle, `aria-pressed` is not the correct pattern - it's designed for binary on/off states.
- **Impact:** Screen readers may not correctly convey the current theme state.
- **Recommendation:** Either use `aria-pressed` consistently for all three states or switch to `aria-label` only (which is already being used correctly).

### 5. Typing Effect Not Announced to Screen Readers
- **File:** `js/script.js:50-72`
- **Severity:** Low
- **Description:** The typing animation changes the text content of `#typed` but doesn't use `aria-live` to announce changes. When `prefers-reduced-motion` is set, the text is static, which is correct.
- **Impact:** Screen reader users don't experience the typing animation (acceptable), but the final text should be reliably read.
- **Recommendation:** The current implementation is acceptable since the text is set immediately when `prefers-reduced-motion` is active.

### 6. Missing `role` on Scroll Progress Bar
- **File:** `index.html:29`
- **Severity:** Low
- **Description:** The scroll progress bar has `aria-hidden="true"` which is correct since it's decorative. No issue here - this is correctly implemented.

---

## Functional Issues

### 7. Theme Detection Depends on System Preference
- **File:** `js/script.js:13-24`
- **Severity:** Low
- **Description:** When localStorage is cleared, the theme defaults to the system's `prefers-color-scheme` preference. This means users on light-mode systems will see light theme by default, while the site appears to be designed primarily for dark mode.
- **Impact:** Minor inconsistency in first-visit experience.
- **Recommendation:** Consider defaulting to dark theme regardless of system preference, or ensure all three themes look equally polished.

### 8. Stat Counters Don't Re-trigger on Re-scroll
- **File:** `js/script.js:436-463`
- **Severity:** Low
- **Description:** The stat counter animation uses `IntersectionObserver` with `unobserve()` after first trigger. Once animated, the counters won't re-animate if the user scrolls away and back.
- **Impact:** Minor - counters show correct final values, just no re-animation.
- **Recommendation:** This is intentional behavior to avoid re-triggering. No fix needed.

### 9. Horizontal Gallery Not Testable on Mobile
- **File:** `js/script.js:196-220`
- **Severity:** Low
- **Description:** The horizontal project gallery only works on viewports >= 861px wide. On mobile, projects stack vertically. This is intentional responsive behavior.
- **Impact:** None - this is correct responsive design.

---

## Performance Issues

### 10. Google Fonts CDN Dependency
- **File:** `index.html:8-10`
- **Severity:** Low
- **Description:** Fonts are loaded from Google Fonts CDN. If the CDN is unavailable, the site falls back to system fonts (Georgia, system sans-serif). No font-display swap is specified.
- **Impact:** Potential FOUT (Flash of Unstyled Text) or invisible text during font loading.
- **Recommendation:** Add `font-display: swap` to the Google Fonts URL: `&display=swap`.

### 11. Vendored Lenis Library
- **File:** `js/lenis.min.js`
- **Severity:** Low
- **Description:** The Lenis smooth scroll library is vendored as a minified JS file (v1.1.14). No version management or update path exists.
- **Impact:** Security and maintenance - no easy way to update to newer versions.
- **Recommendation:** Consider using a package manager or CDN with version pinning.

### 12. No `.ico` Favicon Fallback
- **File:** `index.html:11`
- **Severity:** Low
- **Description:** Only an SVG favicon is provided. Some older browsers and tools don't support SVG favicons.
- **Impact:** Missing favicon in older browsers/tools.
- **Recommendation:** Add a `.ico` fallback: `<link rel="icon" type="image/x-icon" href="favicon.ico">`.

---

## Testing Infrastructure Issues

### 13. No CI/CD Pipeline
- **Severity:** Medium
- **Description:** No GitHub Actions workflow exists for automated testing. Tests must be run manually.
- **Impact:** Regressions can be introduced without detection.
- **Recommendation:** Add `.github/workflows/playwright.yml` to run tests on push/PR.

### 14. No HTML Validation
- **Severity:** Low
- **Description:** No HTML validation tests are included. The HTML may contain minor validation issues.
- **Impact:** Potential rendering issues in edge-case browsers.
- **Recommendation:** Add HTML validation using `html-validate` or W3C validator API.

---

## Summary

| Category | Count |
|----------|-------|
| Critical | 2 |
| Accessibility | 3 |
| Functional | 3 |
| Performance | 3 |
| Testing Infrastructure | 2 |
| **Total** | **13** |

### Test Coverage

| Test Suite | Tests | Status |
|------------|-------|--------|
| Navigation | 9 | All passing |
| Theme Toggle | 7 | All passing |
| Mobile Menu | 8 | All passing |
| Typing Effect | 5 | All passing |
| Contact Form | 11 | All passing |
| Project Gallery | 8 | All passing |
| Scroll Effects | 9 | All passing |
| Content | 16 | All passing |
| Accessibility | 13 | All passing |
| Responsive | 13 | All passing |
| **Total** | **102** | **All passing** |

### Performance Metrics (Chromium Headless)
- DOM Interactive: ~500ms
- DOM Content Loaded: ~500ms
- Load Complete: ~786ms
- Console Errors: 0
- Broken Links: 0
