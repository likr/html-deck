# HTML-Deck Test Infrastructure Documentation

## Overview

The `html-deck` test infrastructure provides comprehensive, automated end-to-end (E2E) verification and accessibility auditing for the WebComponents presentation library, themes, scaffolding CLI, and presentation decks.

It fulfills **Requirement R5** of the monorepo redesign, utilizing Playwright with headless Chromium to programmatically evaluate computed styles, Shadow DOM component isolation, CSS cascade layers, and WCAG 2.1 AA accessibility contrast across all 8 built-in themes and presentation layouts.

---

## Architecture & Configuration

```
html-deck/
├── playwright.config.js          # Playwright test runner configuration
├── package.json                  # Root scripts: "test" and "validate"
├── tests/
│   ├── variant-test.spec.js      # 4-tier opaque-box verification test suite
│   ├── validate-all.js           # Multi-deck batch validator runner
│   └── helpers/
│       ├── color-utils.js        # WCAG 2.1 luminance, alpha blending, contrast calculators
│       └── theme-helper.js       # Dynamic theme switching and style isolation
└── packages/
    ├── html-deck-validator/      # Headless Playwright layout and accessibility auditor CLI
    └── html-deck-demo/           # Demo presentation server tested by Playwright
```

### 1. Playwright Configuration (`playwright.config.js`)
- **Test Engine**: `@playwright/test` running headless Chromium (`Desktop Chrome`).
- **Dev Server Lifecycle (`webServer`)**:
  - Automatically launches the Vite development server (`npm run dev -w html-deck-demo -- --port 5173 --strictPort`) on `http://localhost:5173`.
  - Reuses active servers in local development; boots isolated server in CI environments.
  - Monitors `http://localhost:5173` readiness with a 30s timeout before executing test specs.
- **Reporting**: Simultaneous list output in terminal and HTML test report generation in `playwright-report/`.

### 2. Root NPM Scripts (`package.json`)
```json
{
  "scripts": {
    "test": "playwright test",
    "validate": "node tests/validate-all.js"
  }
}
```

- **`npm test`**: Runs the complete automated Playwright verification suite across all 4 tiers.
- **`npm run validate`**: Runs `html-deck-validator` across all presentations (`demo/features`, all 8 themes of `demo/variant-test`, `slides/introduction`, `slides/omega`, `slides/ramen`).
  - Supports single-URL mode: `npm run validate -- <url>` (e.g. `npm run validate -- http://localhost:5173/demo/features/index.html`).

---

## 4-Tier Opaque-Box Test Design Methodology

The test suite in `tests/variant-test.spec.js` is structured into 4 discrete test tiers:

### Tier 1: Feature Coverage
- **Element Registration**: Verifies all core custom elements (`<hd-deck>`, `<hd-slide>`, `<hd-layout>`, `<hd-layout-cover>`, `<hd-layout-split>`, `<hd-layout-grid>`, `<hd-card>`, `<hd-box>`, `<hd-callout>`) are registered in `customElements`.
- **8 Built-in Themes Matrix**: Exhaustively verifies that all 8 themes (`default`, `dark`, `warm`, `corporate`, `neon`, `serif`, `dotted`, `nouveau`) define the complete 3-variant (`base`, `main`, `accent`) × 2-surface (`soft`, `solid`) token matrix under `:root`.
- **Container Heading Attributes**: Tests attribute variations (`heading="base"`, `heading="main"`, `heading="accent"`) on container elements (`<hd-card>`, `<hd-box>`, `<hd-callout>`).

### Tier 2: Boundary & Corner Cases
- **Non-transparent Backgrounds**: Ensures resolved backgrounds for all active variant/surface contexts on `<hd-slide>`, `<hd-card>`, `<hd-box>`, and `<hd-callout>` are non-transparent (alpha > 0).
- **Non-transparent / Defined Borders**: Ensures border tokens (including those derived via CSS Relative Color Syntax) resolve to visible, non-zero colors on both soft and solid surfaces.
- **Distinct Surfaces**: Mathematically verifies that computed background colors on `surface="soft"` are distinct from `surface="solid"` across each variant (`base`, `main`, `accent`).
- **Slot Header & Footer Legibility**: Verifies `<div slot="header">` and `<div slot="footer">` text achieve WCAG AA contrast (>= 4.5:1) both on standard slides and slides featuring `[has-heading]` layout banners.

### Tier 3: Cross-Feature Interactions
- **`:root` Override Precedence Without `html:root`**: Tests that user `:root` overrides in unlayered CSS take precedence over library `@layer hd-variables` styles without requiring `html:root` or `!important`.
- **Dynamic `has-heading` Contrast**: Tests `<hd-layout>` heading banner styling and contrast separation between banner header and body areas.
- **Nested Components Isolation**: Tests deeply nested containers (`<hd-slide>` → `<hd-card>` → `<hd-box>`) to ensure Shadow DOM styling isolation and token bridging down the composed tree without variable leakage.
- **Grid Margin Reset**: Verifies that direct children of `<hd-layout-grid>` reset bottom margin to `0px`.

### Tier 4: Real-World Scenarios (WCAG AA Contrast)
- **Palette WCAG AA Compliance**: Verifies that all 8 themes satisfy WCAG 2.1 AA contrast ratios across all 6 variant × surface contexts:
  - Normal text (< 24px, or < 18.66px bold): Contrast ratio >= 4.5:1.
  - Large text (>= 24px, or >= 18.66px bold): Contrast ratio >= 3.0:1.
  - Highlight text (`.hd-highlight`): Contrast ratio >= 4.5:1 (>= 3.0:1 for large text).
- **Demo Slides Audit**: Evaluates rendered slides on `/demo/variant-test/index.html` to ensure real-world presentation slides render free of contrast violations.

---

## How to Run Tests

### Run Playwright E2E Suite
```bash
# Run all tests headlessly
npm test

# Run tests with UI inspector
npx playwright test --ui

# Run specific tier or test filter
npx playwright test -g "Tier 1"
npx playwright test -g "Tier 2"
npx playwright test -g "Tier 3"
npx playwright test -g "Tier 4"
```

### Run Batch Validator
```bash
# Validate all demos and slide decks
npm run validate

# Validate a specific slideshow URL
npm run validate -- http://localhost:5173/demo/features/index.html
```

---

## Mathematical Specification of Contrast

The test suite and validator follow the W3C WCAG 2.1 specification:
1. **Relative Luminance ($L$)**:
   $$\text{channel} = \frac{C}{255}$$
   $$v = \begin{cases} \frac{\text{channel}}{12.92} & \text{if } \text{channel} \le 0.03928 \\ \left(\frac{\text{channel} + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$
   $$L = 0.2126 \times v_R + 0.7152 \times v_G + 0.0722 \times v_B$$
2. **Contrast Ratio**:
   $$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 \ge L_2)$$
3. **Alpha Compositing**:
   $$C_{\text{composite}} = C_{\text{fg}} \times \alpha + C_{\text{bg}} \times (1 - \alpha)$$
