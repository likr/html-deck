---
name: html-deck
description: How to scaffold, write, and structure new presentations or add slides using the html-deck WebComponents library. This skill guides standard presentation authoring. It strictly forbids adding custom CSS, <style> blocks, or inline style="..." attributes unless explicitly requested by the user, forcing standard themes, layouts, and hd- utility classes instead. Make sure to use this skill whenever the user mentions building, presenting, or exporting slideshows.
---

# html-deck Slide Authoring Skill

This skill explains how to build elegant presentation slide decks using the `html-deck` WebComponents slideshow library.

---

## 📚 Detailed References Index
Always read the relevant sub-document using the `view_file` tool to inspect full APIs, themes, variables, and layouts:
- 🧩 **Components API Reference**: Detailed specs of slots, attributes, and variables for all core elements (e.g. `<hd-deck>`, `<hd-slide>`, `<hd-layout-standard>`, `<hd-layout-split>`, `<hd-layout-cover>`).
  - Link: [components.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/components.md)
- 👤 **Presenter View & Notes**: How to set up and style the speaker dashboard (`presenter.html`), write speaker notes (`slot="notes"`), and customize widgets.
  - Link: [presenter.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/presenter.md)
- 🎨 **Themes & Custom Styling**: Global CSS variables, custom preset themes (e.g. Neon, Corporate, Warm), Google Fonts loading, and utility classes (e.g. `.hd-absolute-bottom`).
  - Link: [styling.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/styling.md)
- 📊 **Standard Built-in Themes Parameters**: Detailed variable values, default fonts, background settings, and color mappings for the 6 standard built-in themes.
  - Link: [themes.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/themes.md)
- 🖨️ **PDF Export & Printing**: Viewport calculations, print-specific CSS rules, and browser settings for perfect PDF exports.
  - Link: [printing.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/printing.md)

---

## 🚀 Scaffolding a New Slide Deck

When the user asks to create a **new** presentation, do not write the HTML manually from scratch. Use the `create-html-deck` CLI package via npm workspaces:

```bash
node packages/create-html-deck/bin/create-html-deck.js <project-directory> [options]
```

**Options**:
- `--aspect <ratio>`: Sets ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--presenter`: Automatically includes `presenter-url="presenter.html"` and scaffolds a local presenter view dashboard.

---

## 🧱 Core Presentation Structure

Keep the slide DOM flat inside the deck. Do not nest pages inside nested section blocks. Place all `<hd-slide>` tags directly under `<hd-deck>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Presentation Title</title>
  <script type="module">
    import 'html-deck';
    import 'html-deck/css';
    // Import custom theme CSS here *only* if a custom theme file (e.g. theme-custom.css) is explicitly requested or created.
  </script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    <hd-slide>
      <hd-layout-cover>
        <h1 slot="title">My Title</h1>
      </hd-layout-cover>
    </hd-slide>

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

---

## ⚠️ Critical Coding Guidelines

### 1. HTML Entity Escaping inside Code Blocks
When showing HTML examples (especially containing `hd-` tags) inside a `<pre><code>` block, **always escape the brackets** using `&lt;` and `&gt;`. If you write raw HTML tags inside `<code>` without escaping, the browser will interpret it as active DOM elements, breaking layout constraints and causing slide collapses.

### 2. Loading External Files in Code Blocks (Vite Raw Imports)
To load external code dynamically, use Vite's `?raw` imports and set the `.textContent` property of a nested `<code>` tag.
```html
<pre><code class="language-javascript" id="my-block"></code></pre>
<script type="module">
  import codeText from './sample-code.js?raw';
  const el = document.getElementById('my-block');
  el.textContent = codeText;
  // Trigger Prism highlighting if loaded
  setTimeout(() => window.Prism && window.Prism.highlightElement(el), 0);
</script>
```

### 3. Strict Style Prohibition: No Custom CSS, <style> or style="..."
To ensure presentation consistency, **you MUST NOT write custom CSS styles, `<style>` blocks, or inline `style="..."` attributes** on elements unless the user explicitly requests you to do so. 
- Rely entirely on standard theme stylesheets (e.g., `html-deck.theme-warm.css`), components, and predefined `hd-` utility classes (e.g., `.hd-highlight`, `.hd-mt-3`, `.hd-text-weight-semibold`, `.hd-text-center`).
- If custom CSS is explicitly requested by the user:
  - **Always use absolute `px` units** for font sizes, paddings, and margins. Avoid `rem` or structural `em` layout units as they break scaled resolution.
  - Define custom styles in a separate CSS file and import it **after** `html-deck/css`.

### 4. Never Apply `position: relative` directly to `<hd-slide>`
Applying `position: relative` directly on `<hd-slide>` containers breaks the layout and virtual resolution scaling computations of the slideshow. If you need relative positioning for absolute-positioned child elements, wrap the content in a child `<div>` container and style that wrapper instead.

### 5. Math Rendering with KaTeX
To render mathematical expressions and formulas:
- Load the KaTeX CDN stylesheet and scripts in the HTML `<head>`:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
  ```
- Run KaTeX's `renderMathInElement` on document load:
  ```html
  <script type="module">
    window.addEventListener('load', () => {
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      }
    });
  </script>
  ```
- Use the configured delimiters (e.g., `$$...$$` or `\(...\)`) directly in your text content. Do not use non-standard raw custom tags for math, and make sure KaTeX scripts are properly deferred in the document `<head>`.

### 6. Centering Elements on Blank Slides
Setting the `center` attribute directly on `<hd-slide>` (e.g., `<hd-slide center>`) natively centers all slotted elements vertically and horizontally. This is the recommended way to center content (such as cards, quotes, or key statistics) on a blank slide.

### 7. Card and Box Inner Spacing
Do not place padding classes (like `.hd-p-3`) on host `<hd-card>` or `<hd-box>` tags. Wrap slotted content in a `div` and apply padding utilities to that wrapper.

### 8. Column Widths in Split Layouts
When slotting graphics, large cards, or long lists inside `<hd-layout-split>`, avoid equal `1:1` column layouts if one side is significantly heavier.
- Use unequal ratios (such as `ratio="2:1"` or `ratio="3:2"`) to expand the column space for text/lists and prevent text clipping or height overflows.

### 9. Preventing Content Overflow and Height Collapses
Presentations operate on rigid aspect-ratio canvasses (e.g. `16:9`).
- **Concise Content**: Keep bullet points, list items, and paragraph descriptions brief and punchy.
- **Vertical Spacing**: Ensure you do not stack too many block elements (like a long paragraph, a list, and a large callout/box) on a single slide.
- **Verification**: Always preview slides in both presentation mode and presenter mode to check for overflows.

### 10. Visual Panels for Semantics, Not Decoration
Do not use `<hd-card>`, `<hd-box>`, and `<hd-callout>` (or other visual customization features) simply for visual decoration. Use them only to express information hierarchy/importance (such as highlighting key details, warnings, or distinct content groupings).

### 11. Card vs. Box inside Layouts (Anti-pattern)
Do not use `<hd-card>` as a standalone, single child element inside layout columns/cells (e.g., inside `<hd-layout-split>` or `<hd-layout-grid>`).
- `<hd-card>` is designed to emphasize specific information *within* a larger flow of text/content (e.g., sandwiched between other paragraphs).
- If you need a standalone container that spans the entire height of a column/cell, use `<hd-box>` instead of `<hd-card>`.

### 12. Multi-column and Theme-aware Overflow Safety
Always consider the theme's default fonts, font sizes, margins, and gaps when designing slide contents to avoid text overflowing the aspect-ratio container. Keep layouts breathable and use column scaling to accommodate varying sizes.




