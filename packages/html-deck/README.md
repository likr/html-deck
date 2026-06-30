# html-deck

An agent-first, lightweight WebComponents slideshow library designed for humans and AI agents.

## Installation

### Via CDN

You can load HTML-Deck directly from a CDN (such as unpkg) in the `<head>` of your HTML file:

```html
<script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2/dist/html-deck.js"></script>
```

### Via npm

You can also install the package locally:

```bash
npm install html-deck
```

And import it in your JavaScript entry point:

```javascript
import 'html-deck';
```

## Basic Markup Structure

A minimal presentation setup looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Presentation Title</title>
  <script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2/dist/html-deck.js"></script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    
    <hd-slide>
      <hd-layout-cover>
        <h1 slot="title">Presentation Title</h1>
        <p slot="subtitle">Subtitle goes here</p>
      </hd-layout-cover>
      <div slot="notes">
        <p>Speaker notes</p>
      </div>
    </hd-slide>

    <hd-slide>
      <hd-layout>
        <h2 slot="heading">Slide Title</h2>
        <p>Body content</p>
      </hd-layout>
    </hd-slide>

  </hd-deck>
</body>
</html>
```

## Component Reference

HTML-Deck includes 9 distinct WebComponents:

| Component | Description / Slots |
| :--- | :--- |
| `<hd-deck>` | Root container. Manages transitions, aspect ratio scaling, routing, and presenter sync. |
| `<hd-slide>` | Slide container. Supports active state, inverted theme, centering, and theme variants. |
| `<hd-layout>` | Standard slide layout component (slots: `heading`, `before`, default, `after`). |
| `<hd-layout-split>` | Two-column layout component with customizable column ratio (attributes: `ratio`, slots: `heading`, `before`, `left`, `right`, `after`). |
| `<hd-layout-grid>` | Grid layout component that arranges child elements into columns and rows (attributes: `cols`, `rows`, slots: `heading`, `before`, default, `after`). |
| `<hd-layout-cover>` | Cover or section divider layout component (slots: `before`, `title`, `subtitle`, `meta`, `after`). |
| `<hd-card>` | Styled card container with borders and headers (attributes: `variant`, `surface`, slots: `heading`, default). |
| `<hd-box>` | Box container similar to `<hd-card>` but stretches to 100% height of its grid cell/parent container (attributes: `variant`, `surface`, slots: `heading`, default). |
| `<hd-callout>` | Highlighted blockquote-like container with a left border marker (attributes: `variant`, slot: default). |

## Themes

To use the built-in themes, link the CSS file after loading the main script:

```html
<link rel="stylesheet" href="https://unpkg.com/html-deck@1.0.0-alpha.2/dist/themes/html-deck.theme-[theme-name].css">
```

It is recommended to load Google Fonts in the `<head>` to ensure all themes render correctly:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
```

### Available Theme Presets

- **Default (Minimalist Clean)**: Slate text on a white background.
- **Dark Slate** (`html-deck.theme-dark.css`): Slate-900 background with light purple/blue highlights.
- **Corporate** (`html-deck.theme-corporate.css`): White background, navy blue titles, Inter font.
- **Neon Cyberpunk** (`html-deck.theme-neon.css`): Jet black background, glowing cyan outlines, Space Grotesk font.
- **Warm Sepia** (`html-deck.theme-warm.css`): Warm Ivory background, espresso brown text, Outfit font.
- **Serif Academic** (`html-deck.theme-serif.css`): Paper white, Playfair Display headers, Lora body text.

### Theme Creation Constraints

When designing custom themes for HTML-Deck, you must adhere to the following rules:
- **CSS Variable Overrides Only**: All custom themes must be created in a dedicated CSS file containing only variable overrides under the `:root` selector.
- **Direct Selector Prohibition**: Direct styling of HTML element tags (like `hd-slide`, `h1`) or class names (like `.hd-card`) is prohibited.
- **Relative Color Syntax**: Use CSS Relative Color Syntax (e.g., `rgba(from var(--hd-main-color) r g b / 0.15)`) to derive translucent or muted colors.
- **Explicit Variable Names**: Do not introduce or use abbreviated variable names. Always use full, explicit names such as `background-color` and `text-color` (e.g., `--hd-card-background-color` instead of `--hd-card-bg`).

## PDF Export and Printing

1. Open the slides in Chrome/Chromium and trigger print (Ctrl + P / Cmd + P).
2. Set layout/orientation to Landscape.
3. Set margins to None.
4. Enable Background graphics.
5. Save as PDF.

## Slide Authoring Guidelines

### Escape HTML in Code Blocks

When displaying HTML code blocks inside `<pre><code>` tags, escape brackets (`&lt;` and `&gt;`) if they are evaluated by the browser in the DOM, or set text via JavaScript `.textContent` to prevent them from being parsed as live presentation slides.

### Absolute Units (px)

When styling slides (margins, paddings, fonts), use absolute `px` units. Avoid using relative units like `rem` or `em` for structure, as they can cause text overflows or layout alignment shifts when scaling or printing.

## Keyboard Shortcuts

- `ArrowRight`, `Space`, `Enter`: Next Slide
- `ArrowLeft`, `Backspace`: Previous Slide
- `F`, `f`: Toggle Fullscreen
- `P`, `p`: Open Presenter View (requires `presenter-url` configuration)
