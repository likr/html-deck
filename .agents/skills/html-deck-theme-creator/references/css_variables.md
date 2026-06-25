# html-deck CSS Variables Reference

This document serves as a comprehensive reference of all customizable CSS variables defined in `html-deck`. Use this variables list to create custom themes under the `:root` selector. Do not style element selectors or class selectors directly.

---

## 1. Typography Fonts & Sizes

### Fonts
- `--hd-font-family`: Global body text font stack. (Default: `system-ui, -apple-system, sans-serif`)
- `--hd-font-family-serif`: Serif font stack for quotes. (Default: `Georgia, 'Times New Roman', Times, serif`)
- `--hd-body-font`: Target body font, maps to `--hd-font-family`.
- `--hd-heading-font`: Target heading font, maps to `--hd-font-family`.

### 6-Level Sizing Scale
Used across various font sizes and spacing parameters:
- `--hd-size-1`: `48px` (Largest heading)
- `--hd-size-2`: `32px` (Standard slide headings)
- `--hd-size-3`: `24px` (Default body text)
- `--hd-size-4`: `18px` (Default card/box text)
- `--hd-size-5`: `14px` (Captions/micro text)
- `--hd-size-6`: `12px` (Peripheral headers/footers)

---

## 2. 48-Color Matrix

Theme configurations define these colors to align branding across standard, muted, and inverted slides. The naming convention is `--hd-{theme}-{surface}-{element}` (and `--hd-{theme}-{surface}-{element}-inverted` for inverted variants).

No abbreviated names (like `bg` or `color`) should be introduced. Use `background-color` and `text-color` explicitly.

### Base (Neutral/Standard) Theme
- **Soft (Light bg / Dark text)**:
  - `--hd-base-soft-background-color`: Standard slide background. (Default: `#ffffff`)
  - `--hd-base-soft-text-color`: Standard slide text. (Default: `#111827`)
  - `--hd-base-soft-text-highlight-color`: Slide highlight text. (Default: `#c2410c`)
  - `--hd-base-soft-text-muted-color`: Slide muted text. (Default: `#4b5563`)
- **Solid (Medium bg / Dark text)**:
  - `--hd-base-solid-background-color`: Standard card header/border fill. (Default: `#f3f4f6`)
  - `--hd-base-solid-text-color`: Standard card header text. (Default: `#111827`)
  - `--hd-base-solid-text-highlight-color`: Solid highlight text. (Default: `#9a3412`)
  - `--hd-base-solid-text-muted-color`: Solid muted text. (Default: `#4b5563`)
- **Soft Inverted (Dark bg / Light text)**:
  - `--hd-base-soft-background-color-inverted` (Default: `#111827`)
  - `--hd-base-soft-text-color-inverted` (Default: `#ffffff`)
  - `--hd-base-soft-text-highlight-color-inverted` (Default: `#fdba74`)
  - `--hd-base-soft-text-muted-color-inverted` (Default: `#9ca3af`)
- **Solid Inverted (Dark bg / Light text)**:
  - `--hd-base-solid-background-color-inverted` (Default: `#111827`)
  - `--hd-base-solid-text-color-inverted` (Default: `#f3f4f6`)
  - `--hd-base-solid-text-highlight-color-inverted` (Default: `#fdba74`)
  - `--hd-base-solid-text-muted-color-inverted` (Default: `#9ca3af`)

### Main (Brand/Indigo) Theme
- **Soft**:
  - `--hd-main-soft-background-color` (Default: `#eef2ff`)
  - `--hd-main-soft-text-color` (Default: `#312e81`)
  - `--hd-main-soft-text-highlight-color` (Default: `#c2410c`)
  - `--hd-main-soft-text-muted-color` (Default: `#4338ca`)
- **Solid**:
  - `--hd-main-solid-background-color` (Default: `#4f46e5`)
  - `--hd-main-solid-text-color` (Default: `#ffffff`)
  - `--hd-main-solid-text-highlight-color` (Default: `#fdba74`)
  - `--hd-main-solid-text-muted-color` (Default: `#e0e7ff`)
- **Soft Inverted**:
  - `--hd-main-soft-background-color-inverted` (Default: `#312e81`)
  - `--hd-main-soft-text-color-inverted` (Default: `#eef2ff`)
  - `--hd-main-soft-text-highlight-color-inverted` (Default: `#fdba74`)
  - `--hd-main-soft-text-muted-color-inverted` (Default: `#a5b4fc`)
- **Solid Inverted**:
  - `--hd-main-solid-background-color-inverted` (Default: `#ffffff`)
  - `--hd-main-solid-text-color-inverted` (Default: `#4f46e5`)
  - `--hd-main-solid-text-highlight-color-inverted` (Default: `#c2410c`)
  - `--hd-main-solid-text-muted-color-inverted` (Default: `#4338ca`)

### Accent (Orange) Theme
- **Soft**:
  - `--hd-accent-soft-background-color` (Default: `#fff7ed`)
  - `--hd-accent-soft-text-color` (Default: `#7c2d12`)
  - `--hd-accent-soft-text-highlight-color` (Default: `#4338ca`)
  - `--hd-accent-soft-text-muted-color` (Default: `#c2410c`)
- **Solid**:
  - `--hd-accent-solid-background-color` (Default: `#ea580c`)
  - `--hd-accent-solid-text-color` (Default: `#ffffff`)
  - `--hd-accent-solid-text-highlight-color` (Default: `#c7d2fe`)
  - `--hd-accent-solid-text-muted-color` (Default: `#fed7aa`)
- **Soft Inverted**:
  - `--hd-accent-soft-background-color-inverted` (Default: `#7c2d12`)
  - `--hd-accent-soft-text-color-inverted` (Default: `#fff7ed`)
  - `--hd-accent-soft-text-highlight-color-inverted` (Default: `#a5b4fc`)
  - `--hd-accent-soft-text-muted-color-inverted` (Default: `#fdba74`)
- **Solid Inverted**:
  - `--hd-accent-solid-background-color-inverted` (Default: `#ffffff`)
  - `--hd-accent-solid-text-color-inverted` (Default: `#ea580c`)
  - `--hd-accent-solid-text-highlight-color-inverted` (Default: `#4338ca`)
  - `--hd-accent-solid-text-muted-color-inverted` (Default: `#c2410c`)

---

## 3. Semantic Slide Colors & Borders

These resolve dynamically to control slide borders, heading areas, and backgrounds. They are defined on `:root` to map to base defaults but are overridden on `<hd-slide>` based on the `variant`, `heading`, `surface`, and `inverted` attributes:
- `--hd-slide-background-color`: Mapped from the soft/solid background color of the active body theme.
- `--hd-slide-text-color`: Mapped from the soft/solid text color of the active body theme.
- `--hd-slide-text-highlight-color`: Mapped from the soft/solid highlight color of the active body theme.
- `--hd-slide-text-muted-color`: Mapped from the soft/solid muted color of the active body theme.
- `--hd-layout-divider-color`: Mapped from the text color of the active heading theme.
- `--hd-layout-heading-background-color`: Mapped from the soft/solid background color of the active heading theme.
- `--hd-layout-heading-text-color`: Mapped from the soft/solid text color of the active heading theme.
- `--hd-slide-border-width`: Slide border thickness. (Default: `0px` - hidden by default)
- `--hd-slide-border-style`: Slide border pattern style. (Default: `solid`)
- `--hd-slide-border-color`: Slide border outline color. (Default: `var(--hd-layout-heading-text-color)`)

---

## 4. Spacing Scale & Slide Margins

### Spacing Scale (Gap Scale)
- `--hd-gap-0`: `0px`
- `--hd-gap-1`: `4px`
- `--hd-gap-2`: `8px`
- `--hd-gap-3`: `16px`
- `--hd-gap-4`: `24px`
- `--hd-gap-5`: `32px`
- `--hd-gap-6`: `48px`

### Slide Margins & Offsets
- `--hd-slide-margin-top`: Vertical margin offset from the top. (Default: `var(--hd-gap-5)`)
- `--hd-slide-margin-right`: Horizontal margin offset from the right. (Default: `var(--hd-gap-6)`)
- `--hd-slide-margin-bottom`: Vertical margin offset from the bottom. (Default: `var(--hd-gap-5)`)
- `--hd-slide-margin-left`: Horizontal margin offset from the left. (Default: `var(--hd-gap-6)`)
- `--hd-peripheral-offset`: Absolute position padding for footer/header annotations. (Default: `var(--hd-gap-3)`)

---

## 5. Text Configurations

Customize font sizing, weight, line-height, letter-spacing, and shadows for different text semantic roles:

### Title Text Type
- `--hd-text-title-font` / `--hd-text-title-color` / `--hd-text-title-font-size` / `--hd-text-title-font-weight` / `--hd-text-title-line-height` / `--hd-text-title-letter-spacing` / `--hd-text-title-text-transform` / `--hd-text-title-text-shadow`

### Heading Text Type
- `--hd-text-heading-font` / `--hd-text-heading-color` / `--hd-text-heading-font-size` / `--hd-text-heading-font-weight` / `--hd-text-heading-line-height` / `--hd-text-heading-letter-spacing` / `--hd-text-heading-text-transform` / `--hd-text-heading-text-shadow`

### Subheading Text Type
- `--hd-text-subheading-font` / `--hd-text-subheading-color` / `--hd-text-subheading-font-size` / `--hd-text-subheading-font-weight` / `--hd-text-subheading-line-height` / `--hd-text-subheading-letter-spacing` / `--hd-text-subheading-text-transform` / `--hd-text-subheading-text-shadow`

### Body Text Type
- `--hd-text-body-font` / `--hd-text-body-color` / `--hd-text-body-font-size` / `--hd-text-body-font-weight` / `--hd-text-body-line-height` / `--hd-text-body-letter-spacing` / `--hd-text-body-text-transform` / `--hd-text-body-text-shadow`

### Quote Text Type
- `--hd-text-quote-font` / `--hd-text-quote-color` / `--hd-text-quote-font-size` / `--hd-text-quote-font-weight` / `--hd-text-quote-line-height` / `--hd-text-quote-letter-spacing` / `--hd-text-quote-text-transform` / `--hd-text-quote-text-shadow`

### Caption Text Type
- `--hd-text-caption-font` / `--hd-text-caption-color` / `--hd-text-caption-font-size` / `--hd-text-caption-font-weight` / `--hd-text-caption-line-height` / `--hd-text-caption-letter-spacing` / `--hd-text-caption-text-transform` / `--hd-text-caption-text-shadow`

### Peripheral Text Type
- `--hd-text-peripheral-font` / `--hd-text-peripheral-color` / `--hd-text-peripheral-font-size` / `--hd-text-peripheral-font-weight` / `--hd-text-peripheral-line-height` / `--hd-text-peripheral-letter-spacing` / `--hd-text-peripheral-text-transform` / `--hd-text-peripheral-text-shadow`

---

## 6. Component Styling

Each UI component has specific CSS variables mapping its styles to standard theme behaviors. These are defined on `:root` to map to base defaults but are overridden on `<hd-card>` and `<hd-box>` based on their `variant` (`base`, `main`, `accent`) and `surface` (`soft`, `solid`) attributes.
Note: Card, Box, Callout, and Layout Heading elements use the CSS `background` shorthand property instead of `background-color`, meaning theme creators can assign linear or radial gradients directly to their background variables (e.g. `--hd-card-background-color: linear-gradient(...);`).

### Card (`.hd-card`)
- `--hd-card-border-radius`: Border radius. (Default: `12px`)
- `--hd-card-padding`: Padding. (Default: `var(--hd-gap-3)`)
- `--hd-card-margin-bottom`: Margin bottom. (Default: `var(--hd-gap-3)`)
- `--hd-card-font-size`: Inner text size. (Default: `var(--hd-size-4)`)
- `--hd-card-background-color`: Card fill color. (Default: `var(--hd-base-soft-background-color)`)
- `--hd-card-text-color`: Card text. (Default: `var(--hd-base-soft-text-color)`)
- `--hd-card-border-width`: Card border width. (Default: `1px`)
- `--hd-card-border-style`: Card border style. (Default: `solid`)
- `--hd-card-border-color`: Card border outline. (Default: `var(--hd-base-solid-background-color)`)
- `--hd-card-box-shadow`: Card outer drop shadow. (Default: `0 4px 12px rgba(from var(--hd-base-soft-text-color) r g b / 0.03), 0 1px 2px rgba(from var(--hd-base-soft-text-color) r g b / 0.02)`)
- `--hd-card-heading-background-color` / `--hd-card-heading-text-color` / `--hd-card-heading-border-color`: Style mappings for card title headers.

### Box (`.hd-box`)
- `--hd-box-border-radius` / `--hd-box-padding` / `--hd-box-margin-bottom` / `--hd-box-font-size` / `--hd-box-background-color` / `--hd-box-text-color` / `--hd-box-border-width` / `--hd-box-border-style` / `--hd-box-border-color` / `--hd-box-box-shadow` / `--hd-box-heading-background-color` / `--hd-box-heading-text-color` / `--hd-box-heading-border-color`

### Callout (`.hd-callout`)
- `--hd-callout-border-radius` / `--hd-callout-padding` / `--hd-callout-margin-bottom` / `--hd-callout-font-size` / `--hd-callout-background-color` / `--hd-callout-text-color` / `--hd-callout-border-width` / `--hd-callout-border-style` / `--hd-callout-border-color` / `--hd-callout-box-shadow`

### Codeblock (`<hd-codeblock>`)
- `--hd-codeblock-border-radius`: Border radius. (Default: `8px`)
- `--hd-codeblock-background-color`: Fill background color. (Default: `transparent` - inherits from parent container)
- `--hd-codeblock-border-width`: Border line width. (Default: `1px`)
- `--hd-codeblock-border-style`: Border pattern. (Default: `solid`)
- `--hd-codeblock-border-color`: Border frame color. (Default: `var(--hd-layout-divider-color)`)
- `--hd-codeblock-box-shadow`: Outer drop shadow. (Default: `none`)

### Table (`table`)
- `--hd-table-border-color`: Cell border divider. (Default: `var(--hd-layout-divider-color)`)
- `--hd-table-cell-padding`: Cell margins. (Default: `6px 10px`)
- `--hd-table-margin-bottom`: Table bottom spacing. (Default: `var(--hd-gap-3)`)
- `--hd-table-font-size`: Inner cell text size. (Default: `var(--hd-size-4)`)

### Lists (`ul`, `ol` class="hd-list")
- `--hd-list-margin-bottom` / `--hd-list-padding-left` / `--hd-list-item-margin-bottom` / `--hd-list-font-family` / `--hd-list-font-size` / `--hd-list-color` / `--hd-list-line-height`

### Blockquote (`blockquote`)
- `--hd-blockquote-font-family` / `--hd-blockquote-color` / `--hd-blockquote-font-size` / `--hd-blockquote-font-weight` / `--hd-blockquote-line-height` / `--hd-blockquote-letter-spacing` / `--hd-blockquote-text-transform` / `--hd-blockquote-text-shadow` / `--hd-blockquote-border-color` / `--hd-blockquote-border-width` / `--hd-blockquote-border-style` / `--hd-blockquote-padding-top` / `--hd-blockquote-padding-right` / `--hd-blockquote-padding-bottom` / `--hd-blockquote-padding-left` / `--hd-blockquote-margin-bottom`

### Image (`img`)
- `--hd-img-max-width`: Max-width bounds. (Default: `100%`)
- `--hd-img-height`: Sizing calculation. (Default: `auto`)
- `--hd-img-border-radius`: Border rounding. (Default: `8px`)
- `--hd-img-border-width`: Border line width. (Default: `1px`)
- `--hd-img-border-style`: Border pattern. (Default: `solid`)
- `--hd-img-border-color`: Border color. (Default: `var(--hd-layout-divider-color)`)
- `--hd-img-box-shadow`: Box drop shadow. (Default: `0 4px 6px -1px rgba(0, 0, 0, 0.2)`)

---

## 7. Layout Specific Gaps

- `--hd-layout-split-gap`: Row/column gap spacing inside split layouts. (Default: `var(--hd-gap-5)`)
- `--hd-layout-grid-gap`: Row/column gap spacing inside grid layouts. (Default: `var(--hd-gap-5)`)
- `--hd-layout-split-ratio`: Column sizing template for split layouts. (Default: `minmax(0, 1fr) minmax(0, 1fr)`)
