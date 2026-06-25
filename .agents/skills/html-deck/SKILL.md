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
When showing HTML examples (especially containing `hd-` tags) inside `<hd-codeblock>`, **always escape the brackets** using `&lt;` and `&gt;`. If you write raw HTML tags inside `<hd-codeblock>`, the browser will interpret it as a real slide, breaking layout constraints and causing page collapses.

### 2. Loading External Files in Code Blocks (Vite Raw Imports)
To load external code dynamically without compiling HTML files manually, **modify the `.textContent` property** rather than using attributes. Direct imports using a `src` attribute on `<hd-codeblock>` are deprecated.
```html
<hd-codeblock language="javascript" id="my-block"></hd-codeblock>
<script type="module">
  import codeText from './sample-code.js?raw';
  document.getElementById('my-block').textContent = codeText;
</script>
```

### 3. Strict Style Prohibition: No Custom CSS, <style> or style="..."
To ensure presentation consistency, **you MUST NOT write custom CSS styles, `<style>` blocks, or inline `style="..."` attributes** on elements unless the user explicitly requests you to do so. 
- Rely entirely on standard theme stylesheets (e.g., `html-deck.theme-warm.css`), components, and predefined `hd-` utility classes (e.g., `.hd-accent`, `.hd-mt-3`, `.hd-text-weight-semibold`, `.hd-text-center`).
- If custom CSS is explicitly requested by the user:
  - **Always use absolute `px` units** for font sizes, paddings, and margins. Avoid `rem` or structural `em` layout units as they break scaled resolution.
  - Define custom styles in a separate CSS file and import it **after** `html-deck/css`.

### 4. Never Apply `position: relative` directly to `<hd-slide>`
Applying `position: relative` directly on `<hd-slide>` containers breaks the layout and virtual resolution scaling computations of the slideshow. If you need relative positioning for absolute-positioned child elements, wrap the content in a child `<div>` container and style that wrapper instead.

### 5. Math Rendering with `<hd-math>`
Always wrap mathematical expressions and formulas inside `<hd-math>` Web Components. Do not use standard raw delimiters like `$$...$$` or `$...$` directly in raw text nodes, as they will not be formatted and styled correctly. Use the `block` attribute on `<hd-math>` to render centered block-level equations.

