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

## 2. 24-Color Matrix

Theme configurations define these colors to align branding across standard, muted, and inverted slides:

### Normal (Standard Contrast)
- `--hd-base-color`: Standard slide background. (Default: `#ffffff`)
- `--hd-base-text-color`: Standard slide foreground text. (Default: `#0f172a`)
- `--hd-main-color`: Primary branding color. (Default: `#3b82f6` - Blue)
- `--hd-main-text-color`: Foreground text color on top of primary color backgrounds. (Default: `#ffffff`)
- `--hd-accent-color`: Secondary branding/accent color. (Default: `#10b981` - Emerald)
- `--hd-accent-text-color`: Foreground text color on top of accent color backgrounds. (Default: `#ffffff`)

### Muted (Soft Contrast)
- `--hd-base-color-muted`: Card backgrounds or subtle boxes. (Default: `#f8fafc`)
- `--hd-base-text-color-muted`: Secondary metadata or secondary notes. (Default: `#64748b`)
- `--hd-main-color-muted`: Soft background highlight for primary items. (Default: `#eff6ff`)
- `--hd-main-text-color-muted`: Darker text color on top of soft primary highlights. (Default: `#1d4ed8`)
- `--hd-accent-color-muted`: Soft background highlight for accent items. (Default: `#ecfdf5`)
- `--hd-accent-text-color-muted`: Darker text color on top of soft accent highlights. (Default: `#047857`)

### Inverted (Dark Contrast - Used on Inverted Slides)
- `--hd-base-color-inverted`: Dark slide background. (Default: `#0f172a`)
- `--hd-base-text-color-inverted`: Light text color. (Default: `#f8fafc`)
- `--hd-main-color-inverted`: Primary branding color on dark mode. (Default: `#3b82f6`)
- `--hd-main-text-color-inverted`: Text on top of inverted primary background. (Default: `#ffffff`)
- `--hd-accent-color-inverted`: Accent color on dark mode. (Default: `#10b981`)
- `--hd-accent-text-color-inverted`: Text on top of inverted accent background. (Default: `#ffffff`)

### Muted Inverted
- `--hd-base-color-muted-inverted`: Card backgrounds on dark mode. (Default: `#1e293b`)
- `--hd-base-text-color-muted-inverted`: Secondary text color on dark mode. (Default: `#94a3b8`)
- `--hd-main-color-muted-inverted`: Soft primary highlight on dark mode. (Default: `#1e3a8a`)
- `--hd-main-text-color-muted-inverted`: Text on top of soft primary highlight in dark mode. (Default: `#93c5fd`)
- `--hd-accent-color-muted-inverted`: Soft accent highlight on dark mode. (Default: `#064e3b`)
- `--hd-accent-text-color-muted-inverted`: Text on top of soft accent highlight in dark mode. (Default: `#a7f3d0`)

---

## 3. Semantic Slide Colors

These resolve directly to the base colors and control slide layout borders and backgrounds:
- `--hd-slide-background-color`: Mapped from `--hd-base-color`.
- `--hd-slide-text-color`: Mapped from `--hd-base-text-color`.
- `--hd-slide-border-color`: Mapped from `--hd-base-text-color-muted`.

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

Each UI component has specific CSS variables mapping its styles to standard theme behaviors:

### Card (`.hd-card`)
- `--hd-card-border-radius`: Border radius. (Default: `12px`)
- `--hd-card-padding`: Padding. (Default: `var(--hd-gap-3)`)
- `--hd-card-margin-bottom`: Margin bottom. (Default: `var(--hd-gap-3)`)
- `--hd-card-font-size`: Inner text size. (Default: `var(--hd-size-4)`)
- `--hd-card-background-color`: Card fill color. (Default: `var(--hd-base-color-muted)`)
- `--hd-card-text-color`: Card text. (Default: `var(--hd-base-text-color)`)
- `--hd-card-border-width`: Card border width. (Default: `1px`)
- `--hd-card-border-style`: Card border style. (Default: `solid`)
- `--hd-card-border-color`: Card border outline. (Default: `rgba(from var(--hd-base-text-color) r g b / 0.08)`)
- `--hd-card-box-shadow`: Card outer drop shadow. (Default: `0 4px 12px rgba(from var(--hd-base-text-color) r g b / 0.03), 0 1px 2px rgba(from var(--hd-base-text-color) r g b / 0.02)`)
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
- `--hd-codeblock-border-color`: Border frame color. (Default: `var(--hd-slide-border-color)`)
- `--hd-codeblock-box-shadow`: Outer drop shadow. (Default: `none`)

### Table (`table`)
- `--hd-table-border-color`: Cell border divider. (Default: `var(--hd-slide-border-color)`)
- `--hd-table-cell-padding`: Cell margins. (Default: `6px 10px`)
- `--hd-table-margin-bottom`: Table bottom spacing. (Default: `var(--hd-gap-3)`)
- `--hd-table-font-size`: Inner cell text size. (Default: `var(--hd-size-4)`)

### Lists (`ul`, `ol` class="hd-list")
- `--hd-list-margin-bottom` / `--hd-list-padding-left` / `--hd-list-item-margin-bottom` / `--hd-list-font-family` / `--hd-list-font-size` / `--hd-list-color` / `--hd-list-line-height`

### Blockquote (`blockquote`)
- `--hd-blockquote-font-family` / `--hd-blockquote-color` / `--hd-blockquote-font-size` / `--hd-blockquote-font-weight` / `--hd-blockquote-line-height` / `--hd-blockquote-letter-spacing` / `--hd-blockquote-text-transform` / `--hd-blockquote-text-shadow` / `--hd-blockquote-border-color` / `--hd-blockquote-border-width` / `--hd-blockquote-padding-left` / `--hd-blockquote-margin-bottom`

### Image (`img`)
- `--hd-img-max-width`: Max-width bounds. (Default: `100%`)
- `--hd-img-height`: Sizing calculation. (Default: `auto`)
- `--hd-img-border-radius`: Border rounding. (Default: `8px`)
- `--hd-img-border-width`: Border line width. (Default: `1px`)
- `--hd-img-border-style`: Border pattern. (Default: `solid`)
- `--hd-img-border-color`: Border color. (Default: `var(--hd-slide-border-color)`)
- `--hd-img-box-shadow`: Box drop shadow. (Default: `0 4px 6px -1px rgba(0, 0, 0, 0.2)`)

---

## 7. Layout Specific Gaps

- `--hd-layout-split-gap`: Row/column gap spacing inside split layouts. (Default: `var(--hd-gap-5)`)
- `--hd-layout-three-gap`: Row/column gap spacing inside three-column layouts. (Default: `var(--hd-gap-5)`)
- `--hd-layout-split-ratio`: Column sizing template for split layouts. (Default: `minmax(0, 1fr) minmax(0, 1fr)`)
