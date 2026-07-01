# html-deck Slide Authoring Reference

This document outlines how to structure presentation slide decks and write slide contents using the `html-deck` WebComponents library, including layout design and overflow prevention best practices.

---

## 🧱 1. Core Presentation Structure

Keep the slide DOM flat inside the deck. Do not nest pages inside nested section blocks. Place all `<hd-slide>` tags directly under `<hd-deck>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Presentation Title</title>
  <script type="module">
    import 'html-deck';
  </script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    <!-- Cover Slide -->
    <hd-slide>
      <hd-layout-cover>
        <h1 slot="title">Presentation Title</h1>
        <p slot="subtitle">A brief description</p>
      </hd-layout-cover>
    </hd-slide>

    <!-- Standard Slide -->
    <hd-slide>
      <hd-layout>
        <h2 slot="heading">Slide Title</h2>
        <p class="hd-text">Body content here.</p>
      </hd-layout>
    </hd-slide>
  </hd-deck>
</body>
</html>
```

### 👥 Optional Presenter Notes & Script Slots

- **`slot="notes"`**: Contains speaker notes displayed on the presenter view dashboard.
- **`slot="script"`**: Contains the Text-To-Speech (TTS) reading script text.

> [!IMPORTANT]
> **`slot="notes"` and `slot="script"` MUST ONLY be created or added if the user explicitly requests them.** Do not proactively add them to slides.

---

## 🧱 2. Layout Components

Slide structures are controlled using standard layout custom elements. Place these elements inside `<hd-slide>`.

### Standard Layout (`<hd-layout>`)
Standard slide format with top heading, middle body, and before/after slots.
- **Slots**: `heading` (title), `before` (top area), `after` (bottom area), and default slot (main body).

### Split Layout (`<hd-layout-split>`)
Provides a two-column view, commonly used for text on one side and an image/card on the other.
- **Attributes**: `ratio` (e.g., `1:1`, `2:1`, `1:2`). Default: `1:1`.
- **Slots**: `heading`, `before`, `left`, `right`, `after`.
- **Preventing Image Overflow**: To prevent large images or text blocks from overflowing the slide canvas, narrow the image pane by specifying a custom column ratio (e.g. `ratio="2:1"`) rather than using default equal widths.

### Grid Layout (`<hd-layout-grid>`)
Arranges direct child elements sequentially in a grid.
- **Attributes**: `cols` (number, default: `1`), `rows` (number, default: `auto`).
- **Slots**: `heading`, `before`, `after`, and default slot (accepts children laid out in cells).

### Cover Layout (`<hd-layout-cover>`)
Used for cover/title slides or section dividers. Centers elements horizontally and vertically and hides slide page numbers.
- **Slots**: `title`, `subtitle`, `meta`, `before`, `after`.

---

## ⚠️ 3. Layout and Spacing Constraints

### Strict Styling Prohibition
**Do not write custom CSS, `<style>` blocks, or inline `style="..."` attributes** on elements unless explicitly requested by the user. Rely entirely on standard theme variables, component structures, and predefined `hd-` utility classes (e.g., `.hd-highlight`, `.hd-mt-3`).

### Never Apply `position: relative` directly to `<hd-slide>`
Applying `position: relative` directly to `<hd-slide>` containers breaks the layout and virtual resolution scaling computations of the slideshow. If you need relative positioning for absolute-positioned child elements, wrap the content in a child `<div>` container and style that wrapper instead.

### Centering on Blank Slides
Setting the `center` attribute on `<hd-slide>` (e.g. `<hd-slide center>`) natively centers slotted elements vertically and horizontally. Direct child elements in the slide body-area will be centered without needing wrapping utilities.

### Layout Component Spacing
When designing or modifying layout components:
- **No Host Padding**: Do not apply padding directly to the `:host` element of layout components. Direct host padding causes slotted elements (like `before` and `after` slots) to overflow or misalign relative to the slide canvas.
- **Inner Content Wrapper**: Wrap all slot containers (including `before`, `after`, and body/main content) in an inner wrapper div (e.g., `.layout-content` or `.cover-content`) and apply layout-specific padding variables (e.g., `--hd-layout-body-padding`, `--hd-layout-cover-padding`) to that wrapper.
- **Slotted Margins**: Explicitly define margins for slotted `before` and `after` elements in the layout stylesheet using `--hd-layout-before-margin` and `--hd-layout-after-margin` to ensure layout consistency.

### Card and Box Inner Spacing
- Do not apply padding utility classes (e.g. `.hd-p-*`) directly to `<hd-card>` or `<hd-box>` host elements as it overrides container borders. Apply padding utilities on wrapper `div` elements inside their default slots instead.

---

## 🎨 4. Semantic Panels (Card, Box, and Callout)

### Visual Panels for Semantics, Not Decoration
Do not use `<hd-card>`, `<hd-box>`, and `<hd-callout>` simply for visual decoration. Use them only to express information hierarchy/importance (such as highlighting key details, warnings, or distinct content groupings).

### Card vs. Box inside Layouts (Anti-pattern)
Do not use `<hd-card>` as a standalone, single child element inside layout columns/cells (e.g., inside `<hd-layout-split>` or `<hd-layout-grid>`).
- `<hd-card>` is designed to emphasize specific information *within* a larger flow of text/content (e.g., sandwiched between other paragraphs). It has `align-self: flex-start` to fit its content height.
- If you need a standalone container that spans the entire height of a column/cell, use `<hd-box>` instead of `<hd-card>`. `<hd-box>` defaults to `height: 100%` to fill the available layout height.
- **No Div Wrapper for Box inside Split Layouts**: When placing `<hd-box>` inside `<hd-layout-split>` slots (`left` or `right`), do not wrap it inside a container `div`. Assign the slot attribute directly onto `<hd-box>` (e.g., `<hd-box slot="left">...`). This prevents style leakage and ensures that the box spans the full column height correctly.

---

## 🗜️ 5. Slide Content Sizing and Overflow Prevention

Presentations operate on rigid aspect-ratio canvasses (e.g., `16:9`). Use the following practices to prevent content overflow:

1. **Concise Content**: Keep bullet points, list items, and paragraph descriptions brief and punchy.
2. **Vertical Stack Limits**: Do not stack too many block elements (like a long paragraph, a list, and a large callout/box) on a single slide.
3. **Multi-column and Theme-aware Overflow Safety**: Always consider the theme's default fonts, font sizes, margins, and gaps when designing slide contents. Keep layouts breathable and use column scaling to accommodate varying sizes.
4. **Compact Sizing Theme**: If the slide contains high-density content that cannot be made shorter, use the compact variables mapping (detailed in the Theme Customization reference).

---

## 🔍 6. Slide Layout & Accessibility Validation

To ensure slide decks conform to spacing guidelines and are accessible, authors can run the automated validation tool via `npx` against their running slideshow server:

```bash
npx html-deck-audit <url>
```

This tool audits all slides inside the presentation for three categories of issues:
1. **Color Contrast**: Verifies compliance with WCAG AA standards (4.5:1 for regular text, 3.0:1 for large/bold text).
2. **Boundary Overflow**: Identifies elements spilling outside the physical canvas boundaries of `<hd-slide>`.
3. **Element Overlap**: Flags elements colliding or overlaying on top of each other (excluding parent-child groups and background/decor elements styled with `pointer-events: none`).
