---
name: html-deck
description: How to create, write, and style new presentations or add slides using the html-deck WebComponents slideshow library. Trigger this skill whenever a user requests to build a presentation, edit slides, write math equations in slides, write code examples in slides, include external code source files, use image components, or configure presenter options.
---

# html-deck Slide Authoring Skill

This skill explains how to build elegant presentation slide decks using the `html-deck` library.

---

## 🚀 Generating a Boilerplate Slide Deck

When the user asks to create a **new** presentation, do not write the HTML manually from scratch. Use the bundled Node.js CLI boilerplate utility:

```bash
node .agents/skills/html-deck/scripts/create-deck.js <output-file.html> [options]
```

**Options**:
- `--aspect <ratio>`: Sets ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--presenter`: Automatically includes `presenter-url="..."` attribute linked to the project presenter dashboard.

---

## 🎨 Page Structuring Guidelines

### 1. Include Global Stylesheet (html-deck.css)
Always link the CSS utility stylesheet `src/html-deck.css` in the HTML document's `<head>`. It resets body margins, ensures proper presentation scrolling, and provides essential text decoration/utility classes.

```html
<link rel="stylesheet" href="src/html-deck.css">
```

### 2. Flat Declarative DOM Tree
Keep the DOM structure completely flat. Do not nest pages inside nested section blocks. Place all `<hd-slide>` tags directly under `<hd-deck>`.

```html
<hd-deck transition="fade" aspect-ratio="16:9" presenter-url="./demo/tutorial/presenter.html">
  <hd-slide layout="title" title="Slide 1" center>...</hd-slide>
  <hd-slide layout="title-body" title="Slide 2">...</hd-slide>
</hd-deck>
```

### 3. Slide Layout presets
Choose the right `layout` attribute value for `<hd-slide>`:
- `title`: Centered alignment, useful for intro/closing slides. Uses `<hd-heading>` (level="1") and `<hd-text>`.
- `title-body`: Standard slides. Slot title into `<hd-heading slot="title">`, and put body contents in the main default slot.
- `split`: Splitted side-by-side content columns. Put left column elements in `slot="left"`, right column elements in `slot="right"`.

### 4. Customizing Themes & CSS Variables
The virtual presentation space defaults to **960x540** (proportional to Google Slides 16:9).
- **Default Theme**: Defaults to a clean, minimal white background (`#ffffff`) and dark slate text (`#1e293b`).
- **Applying Themes**: Load theme CSS stylesheets in the HTML `<head>` after the main stylesheet to instantly change variables:
  ```html
  <link rel="stylesheet" href="src/html-deck.css">
  <link rel="stylesheet" href="src/html-deck.theme-dark.css"> <!-- Example: Dark slate theme -->
  ```
  Available themes: `html-deck.theme-dark.css`, `html-deck.theme-warm.css` (sepia), `html-deck.theme-corporate.css` (navy/teal), `html-deck.theme-serif.css` (academic), and `html-deck.theme-neon.css` (cyberpunk).
- **Use Pixel Units (`px`) for Custom Styles**: When writing custom slide styling (e.g., inside presentation `<style>` tags or inline styles), always use absolute `px` units for font sizes, paddings, and margins. Avoid using `rem` or structural `em` layout units, as they are dependent on the external environment's base font size and will cause text overflow or layout shifting when scaled or embedded.
- **Google Fonts Loading**: When using themes that require custom web typography, load Google Fonts inside your HTML `<head>` for flexibility (avoid importing inside theme CSS):
  ```html
  <!-- Example: Load fonts required by Warm, Corporate, Serif, and Neon themes -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  ```
- **Slide-Specific Background Overrides**: Apply layout/color adjustments per-slide directly via attributes:
  - `<hd-slide invert>`: Swaps background and text colors dynamically based on the current theme.
  - `<hd-slide bg="primary">`: Applies the theme's primary accent color as the background, automatically displaying white text.
  - `<hd-slide bg="secondary">`: Applies the theme's secondary accent color as the background, displaying white text.
- **Text Decoration Utilities**: Decorate text inside slides using utility span classes from `html-deck.css` (always prefixed with `hd-`):
  - Font weights & styles: `.hd-bold`, `.hd-semibold`, `.hd-normal`, `.hd-italic`, `.hd-underline`, `.hd-line-through`
  - Font sizes: `.hd-text-xs` (0.7em), `.hd-text-sm` (0.85em), `.hd-text-lg` (1.15em), `.hd-text-xl` (1.3em), `.hd-text-2xl` (1.6em)
  - Theme colors: `.hd-text-primary`, `.hd-text-secondary`, `.hd-text-accent`, `.hd-text-muted`, `.hd-text-danger`
  - Highlights: `.hd-bg-primary`, `.hd-bg-secondary`

```html
<hd-text>
  This is a <span class="hd-text-primary hd-bold">highlighted</span> word in a paragraph.
</hd-text>
```

### 5. Nested Lists
Lists (`<hd-list>`) can be nested inside another `<hd-list>` component. The nested list will automatically detect its depth level and adjust indentation spacing and bullet types (disc, circle, square).
```html
<hd-list>
  <li>First item</li>
  <li>Second item with nested list
    <hd-list>
      <li>Nested item A</li>
      <li>Nested item B
        <hd-list>
          <li>Deeply nested item</li>
        </hd-list>
      </li>
    </hd-list>
  </li>
</hd-list>
```

### 6. Image Component (<hd-image>)
Use `<hd-image>` for showing images with caption and shadow box decorators.
- **Attributes**:
  - `src`: Path to image
  - `alt`: Alt text
  - `fit`: Size mode (`cover` or `contain`, defaults to `cover`)
  - `caption`: Caption text shown at bottom-right
  - `shadow`: Set to `"true"` to add shadow effect
  - `rounded`: Set to `"true"` to add rounded corners
```html
<hd-image src="./assets/chart.png" caption="Sales Q4" shadow="true" rounded="true"></hd-image>
```

### 7. Table Component (<hd-table>)
Wraps standard HTML `<table>` elements to apply clean, premium, and fully encapsulated styles (zebra striping, header columns, hover states).
```html
<hd-table>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HTML-Deck</td>
        <td>$0 (MIT)</td>
      </tr>
    </tbody>
  </table>
</hd-table>
```

### 8. Title Slide Component (<hd-title-slide>)
A specialized slide component specifically designed for cover slides.
- It features dedicated slots for: `title`, `subtitle`, `presenter`, `location`, and `date`.
- By default, it uses a plain layout (left-aligned, vertically stacked content, no labels).
- You can fully customize its positioning and layout (e.g. centering it, horizontal lists, divider lines) via CSS variables.
```html
<hd-title-slide>
  <div slot="title"><span class="hd-text-primary">My Slide Title</span></div>
  <div slot="subtitle">Subtitle details go here</div>
  <div slot="presenter">Presenter Name</div>
  <div slot="location">Hall B</div>
  <div slot="date">2026-06-22</div>
</hd-title-slide>
```

### 9. Page Numbers
Slides display a "Current / Total" page number indicator at the bottom right corner by default.
- **Global Control**: Disable page numbers globally by setting the `page-number` attribute to `false` on the deck element: `<hd-deck page-number="false">`.
- **Slide Override**: Disable page numbers on individual slides by adding the `no-page-number` attribute: `<hd-slide no-page-number>`.
- Note: Page numbers are automatically hidden on slides using the `title` layout or on `<hd-title-slide>`.

### 10. Callout Component (<hd-callout>)
Wraps block text inside a cleanly styled box with a left accent border.
- **Attributes**:
  - `type`: Color variant. Can be `"primary"`, `"secondary"`, `"accent"`, `"danger"`, or `"warning"`.
```html
<hd-callout type="primary">
  <hd-text class="hd-bold">Key Point</hd-text>
  <hd-text class="hd-text-sm">This is a primary callout box.</hd-text>
</hd-callout>
```

### 11. Footnote Component (<hd-footnote>)
Used to write slide annotations or references.
- **Default Position**: Absolutely positioned at the bottom-left corner of the slide (mirroring page numbers on the right).
- **Inline Flow**: Add the `inline` attribute to render the footnote in-flow (static position, block layout) inside grid cards, column blocks, or standard flows.
```html
<!-- Absolutely positioned at the bottom-left -->
<hd-footnote>* Reference: Research Team 2026</hd-footnote>

<!-- In-flow footnote -->
<div class="grid-card">
  <hd-text>Card Content</hd-text>
  <hd-footnote inline>* Card footnote annotation</hd-footnote>
</div>
```

### 12. Spacing and Alignment Utility Classes
To avoid using raw inline style attributes, use the built-in utility classes from `html-deck.css`:
- **Vertical Spacing (Margin Top)**:
  - `.hd-mt-xs` / `.hd-mt-1` (4px)
  - `.hd-mt-sm` / `.hd-mt-2` (8px)
  - `.hd-mt-md` / `.hd-mt-3` (16px)
  - `.hd-mt-lg` / `.hd-mt-4` (24px)
  - `.hd-mt-xl` / `.hd-mt-5` (32px)
  - `.hd-mt-2xl` / `.hd-mt-6` (48px)
- **Width Limiters**:
  - `.hd-max-w-sm` (max-width: 400px)
  - `.hd-max-w-md` (max-width: 600px)
  - `.hd-max-w-lg` (max-width: 800px)
  - `.hd-w-full` (width: 100%)
- **Block Centering**:
  - `.hd-mx-auto` (applies `margin-left: auto; margin-right: auto; display: block;`)
- **Text Alignment**:
  - `.hd-text-left`, `.hd-text-center`, `.hd-text-right`

---

## ⚠️ Important Coding Guidelines

### 1. HTML Entity Escaping inside Code Blocks (Critical)
When showing HTML examples (especially containing `hd-` tags) inside `<hd-codeblock>`, **always escape the brackets** using `&lt;` and `&gt;`.
If you write raw `<hd-slide>` inside `<hd-codeblock>`, the browser will interpret it as a real slide, breaking layout constraints and causing page collapses.

- **Incorrect**:
```html
<hd-codeblock language="html">
  <hd-slide layout="split">...</hd-slide>
</hd-codeblock>
```
- **Correct**:
```html
<hd-codeblock language="html">
  &lt;hd-slide layout="split"&gt;...&lt;/hd-slide&gt;
</hd-codeblock>
```

### 2. Loading External Files in Code Blocks
You can render external files directly inside `<hd-codeblock>` by setting the `src` attribute. This is cleaner than inlining massive snippets.
```html
<hd-codeblock language="javascript" src="./demo/sample-code.js"></hd-codeblock>
```

### 3. Math LaTeX Syntax
Use `<hd-math>` for LaTeX equations. Keep LaTeX notation clean and decode characters like `<` or `>` properly. Use the `block` attribute to center and scale equations.
```html
<hd-math block>
  f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx
</hd-math>
```

### 4. Scrollable Containment for Large Content
When code blocks (`<hd-codeblock>`) or tables (`<hd-table>`) contain large sets of content that might overflow slide dimensions, add the `scrollable` attribute to enable vertical scrollbars.
- If set as a boolean attribute, the height limits to a default `250px`.
- You can also pass a custom CSS height value to set specific limits.
```html
<!-- Default height scrollable codeblock -->
<hd-codeblock language="javascript" src="large-file.js" scrollable></hd-codeblock>

<!-- Custom height scrollable table -->
<hd-table scrollable="200px">
  <table>...</table>
</hd-table>
```

