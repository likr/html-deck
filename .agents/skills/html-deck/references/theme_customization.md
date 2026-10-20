# html-deck Theme Customization Reference

This document covers how to create custom themes, design color palettes using CSS variables, and apply built-in utility classes to style presentations.

---

## 🎨 1. Theme Customization Core Principles

Custom themes for `html-deck` must be defined strictly by overriding CSS variables under the `:root` selector.

### Principle 1: Dedicated Stylesheet
Define your custom theme overrides in a dedicated CSS file (e.g., `theme-custom.css`). Simply define overrides under the `:root` selector, and import it **after** the core library in your module script block.

> [!IMPORTANT]
> **Vite Environment Imports**: Never use `@import "html-deck/css"` or load `html-deck.css` inside your theme stylesheet, as doing so will cause duplication and Vite/PostCSS compilation errors.
>
> **Evaluation Sandbox Exception**: For evaluation test sandboxes, all custom themes must be embedded directly inside an inline `<style>` element under the `:root` selector inside the slide HTML, rather than external `.css` files.

- **Theme Stylesheet (`theme-custom.css`)**:
  ```css
  :root {
    --hd-theme-background-color: #fffcf5;
    --hd-theme-text-color: #2b251f;
    ...
  }
  ```
- **Entry HTML (`index.html`)**:
  ```html
  <script type="module">
    import 'html-deck';
    import './theme-custom.css';
  </script>
  ```

### Principle 2: Variable Overrides ONLY
Direct styling of HTML element tags (like `hd-slide`, `h1`, `p`) or class names (like `.hd-card`, `.hd-callout`) is strictly prohibited.
- ❌ **Incorrect**:
  ```css
  .hd-card { background-color: #ff0000; }
  ```
-  **Correct**:
  ```css
  :root { --hd-card-background-color: #ff0000; }
  ```

### Principle 3: CSS Relative Color Syntax
When defining translucent borders, shadows, or secondary tones derived from primary theme colors, do not write raw `rgba(...)` or hex literals. Instead, use CSS Relative Color Syntax to dynamically derive them:
```css
:root {
  --hd-theme-main-color: #3b82f6;
  /* Derive a muted main color with 15% opacity */
  --hd-theme-main-color-muted: rgba(from var(--hd-theme-main-color) r g b / 0.15);
}
```

### Principle 4: The 4-Color Palette & 48-Color Matrix Principle
To maintain visual harmony, define 4 base palette variables under the `:root` selector:
1. **Background Color** (`--hd-theme-background-color` — default `#ffffff`)
2. **Text Color** (`--hd-theme-text-color` — default `#0f172a`)
3. **Main Color** (`--hd-theme-main-color` — default `#3730a3`)
4. **Accent Color** (`--hd-theme-accent-color` — default `#9a3412`)

From these 4 base tokens, the library derives the **3-variant (`base`, `main`, `accent`) × 2-surface (`soft`, `solid`) × 2-region (`heading`, `body`) × 4-role (`background-color`, `text-color`, `text-highlight-color`, `text-muted-color`)** 48-color matrix plus 6 border tokens (`--hd-{variant}-{surface}-border`):
- **Soft Backgrounds**: `color-mix(in srgb, var(--hd-theme-main-color) 6%, var(--hd-theme-background-color))`
- **Solid Surfaces**: Derived from `--hd-theme-main-color`, `--hd-theme-accent-color`, or `--hd-theme-text-color`.
- **High-Chroma Solid/Banner Highlights**: On dark headers and `solid` surfaces, use HSL Relative Color Syntax (e.g., `hsl(from var(--hd-theme-accent-color) h 92% 80%)`) rather than `color-mix(..., 5%, white)` so highlights retain vivid saturation while meeting WCAG AA contrast (`>= 4.5:1`).
- **Distinct Muted Text**: Ensure `body-text-muted-color` has both WCAG AA contrast (`>= 4.5:1`) against the surface background and sufficient visual separation (`RGB Δ >= 30`) from primary `body-text-color`.

### Principle 5: Color Contrast and Readability
- **WCAG AA Compliance**: Ensure a contrast ratio of at least **4.5:1** for standard text and **3:1** for large heading text against the background.
- **Opacity Threshold**: When using relative color syntax to derive text colors, keep the alpha channel at **0.85 or higher** to prevent text from blending with the background.

### Principle 6: Prevent Header/Footer Overlaps
To prevent absolute-positioned `header` and `footer` slots from overlapping main content, enforce top/bottom padding rules mathematically:
- **Heading Top Padding**: Enforce that the top padding of the heading area (`--hd-layout-heading-padding` top value) satisfies:
  $$\text{Heading Top Padding} \ge \text{Peripheral Offset} + (\text{Peripheral Font Size} \times \text{Peripheral Line Height}) + \text{Safety Margin (Gap-1 or Gap-2)}$$
- **Body Bottom Padding**: Enforce that the bottom padding of the body area (`--hd-layout-body-padding` bottom value) satisfies:
  $$\text{Body Bottom Padding} \ge \text{Peripheral Offset} + (\text{Peripheral Font Size} \times \text{Peripheral Line Height}) + \text{Safety Margin (Gap-1 or Gap-2)}$$
- **Symmetry**: Keep heading top padding and body bottom padding symmetrical using the shared `--hd-peripheral-offset`.

### Principle 7: Content-Density-Aware Spacing & Typography
- **Low-Density Slides**: Leverage large typography scales (`--hd-size-1: 64px`, `--hd-size-2: 40px`) and spacious margins.
- **High-Density Slides**: If slides contain heavy content, override to a compact template:
  ```css
  :root {
    /* Scaled down typography */
    --hd-size-1: 44px; /* Title */
    --hd-size-2: 30px; /* Heading */
    --hd-size-3: 18px; /* Body text */
    --hd-size-4: 15px; /* Card/Box text */
    
    /* Scaled down spacing gaps */
    --hd-gap-2: 12px;
    --hd-gap-3: 16px;
    --hd-gap-4: 20px;
    --hd-gap-5: 24px;
    --hd-gap-6: 32px;
    
    /* Reduced slide margins */
    --hd-slide-margin-top: var(--hd-gap-4);
    --hd-slide-margin-bottom: var(--hd-gap-4);
    --hd-slide-margin-left: var(--hd-gap-5);
    --hd-slide-margin-right: var(--hd-gap-5);
  }
  ```

---

## 🛠️ 2. CSS Utility Classes (Prefix: `hd-`)

Instead of inline `style="..."` attributes, apply the following classes included in `html-deck.css`:

### Typography
- **Weights**: `.hd-text-weight-light` (300), `.hd-text-weight-normal` (400), `.hd-text-weight-medium` (500), `.hd-text-weight-semibold` (600), `.hd-text-weight-bold` (700), `.hd-text-weight-extrabold` (800).
- **Styles**: `.hd-italic` (italic), `.hd-underlined` (underline).
- **Transformations**: `.hd-capitalized`, `.hd-lowercase`, `.hd-uppercase`.
- **Absolute Typography Scale**: `.hd-size-1` (48px) to `.hd-size-6` (12px).
- **Theme Colors**: `.hd-highlight` (`var(--hd-text-highlight-color)`), `.hd-default` (`var(--hd-text-color)`), `.hd-muted` (`var(--hd-text-muted-color)`).
- **Text Alignment**: `.hd-text-left`, `.hd-text-center`, `.hd-text-right`, `.hd-text-justified`.

### Layout & Margins
- **Margins**: `.hd-m-*`, `.hd-mt-*`, `.hd-mb-*`, `.hd-ml-*`, `.hd-mr-*`, `.hd-mx-*`, `.hd-my-*` (where `*` ranges from `0` to `6`, mapping to 0px, 8px, 16px, 24px, 32px, 40px, and 48px).
- **Paddings**: `.hd-p-*`, `.hd-pt-*`, `.hd-pb-*`, `.hd-pl-*`, `.hd-pr-*`, `.hd-px-*`, `.hd-py-*` (where `*` is `0` to `6`).
- **Gaps**: `.hd-gap-0` to `.hd-gap-6`.
- **Widths (1/12 scale)**: `.hd-width-1` to `.hd-width-12` (e.g., `.hd-width-6` fills exactly `50%` width).
- **Layout Alignment**: `.hd-align-left` (margin-right: auto), `.hd-align-center` (margin-inline: auto), `.hd-align-right` (margin-left: auto), `.hd-align-top` (margin-bottom: auto), `.hd-align-middle` (margin-block: auto), `.hd-align-bottom` (margin-top: auto).
- **Absolute Positioning**: `.hd-absolute-bottom` (places footer annotations absolute at the bottom).
- **Printing Helper**: `.hd-no-print` (hides elements during printing/PDF export).

---

## ⚙️ 3. CSS Variables Catalog

Use this list to override specific properties in your custom stylesheets. Always refer to `packages/html-deck/src/styles/variables.css` for source styles.

### Typography Scales
- `--hd-font-family`: Global body text font stack. (Default: `system-ui, sans-serif`)
- `--hd-font-family-serif`: Serif font stack for quotes. (Default: `Georgia, serif`)
- `--hd-size-1` to `--hd-size-6`: Sizing scale (Sizes: `48px`, `32px`, `24px`, `18px`, `14px`, `12px`).

### Semantic Color propagation
- `--hd-background-color`: Local background.
- `--hd-text-color`: Local text.
- `--hd-text-highlight-color`: Local highlight color.
- `--hd-text-muted-color`: Local muted color.
- `--hd-border-color`: Local border outline.

### Spacing Scale
- `--hd-gap-0` (0px) to `--hd-gap-6` (48px) in increments of 8px (except Gap-2 is 16px, Gap-3 is 24px).
- `--hd-slide-margin-top` / `--hd-slide-margin-right` / `--hd-slide-margin-bottom` / `--hd-slide-margin-left`: Slide margin margins.
- `--hd-peripheral-offset`: Padding for headers/footers (Default: `var(--hd-gap-3)`).

### Component Styles
- **Card (`<hd-card>`)**: `--hd-card-border-radius`, `--hd-card-padding`, `--hd-card-margin-bottom`, `--hd-card-font-size`, `--hd-card-border-width`, `--hd-card-border-style`, `--hd-card-box-shadow`.
- **Box (`<hd-box>`)**: `--hd-box-border-radius`, `--hd-box-padding`, `--hd-box-margin-bottom`, `--hd-box-font-size`, `--hd-box-border-width`, `--hd-box-border-style`, `--hd-box-box-shadow`.
- **Callout (`<hd-callout>`)**: `--hd-callout-border-radius`, `--hd-callout-padding`, `--hd-callout-margin-bottom`, `--hd-callout-font-size`, `--hd-callout-border-width` (default `0 0 0 4px`), `--hd-callout-border-style`, `--hd-callout-box-shadow`.
- **Codeblock (`pre`)**: `--hd-codeblock-border-radius`, `--hd-codeblock-background-color`, `--hd-codeblock-border-width`, `--hd-codeblock-border-style`, `--hd-codeblock-border-color`, `--hd-codeblock-box-shadow`.
- **Inline Code (`code`)**: `--hd-code-background-color`, `--hd-code-text-color`, `--hd-code-padding`, `--hd-code-border-radius`, `--hd-code-font-family`, `--hd-code-font-size`, `--hd-code-border-width`, `--hd-code-border-style`, `--hd-code-border-color`.
- **Highlight Mark (`mark`)**: `--hd-mark-background-color`, `--hd-mark-text-color`, `--hd-mark-padding`, `--hd-mark-border-radius`.
- **Table (`table`)**: `--hd-table-border-color`, `--hd-table-cell-padding`, `--hd-table-margin-bottom`, `--hd-table-font-size`.
- **Lists (`ul`, `ol`)**: `--hd-list-margin-bottom`, `--hd-list-padding-left`, `--hd-list-item-margin-bottom`, `--hd-list-font-family`, `--hd-list-font-size`, `--hd-list-color`, `--hd-list-line-height`.
- **Blockquote (`blockquote`)**: `--hd-blockquote-font-family`, `--hd-blockquote-color`, `--hd-blockquote-font-size`, etc.
- **Image (`img`)**: `--hd-img-max-width`, `--hd-img-height`, `--hd-img-border-radius`, `--hd-img-border-width`, `--hd-img-border-style`, `--hd-img-border-color`, `--hd-img-box-shadow`.
