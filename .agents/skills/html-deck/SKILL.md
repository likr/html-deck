---
name: html-deck
description: How to create, write, and style new presentations or add slides using the html-deck WebComponents slideshow library. Trigger this skill whenever a user requests to build a presentation, edit slides, write math equations in slides, write code examples in slides, include external code source files, use image components, configure presenter options, customize themes or printing rules. Make sure to use this skill whenever the user mentions building, styling, presenting, or exporting slideshows.
---

# html-deck Slide Authoring Skill

This skill explains how to build elegant presentation slide decks using the `html-deck` WebComponents slideshow library.

---

## 📚 Detailed References Index
Always read the relevant sub-document using the `view_file` tool to inspect full APIs, themes, variables, and layouts:
- 🧩 **Components API Reference**: Detailed specs of slots, attributes, and variables for all 15 elements (e.g. `<hd-deck>`, `<hd-slide>`, `<hd-title-slide>`, `<hd-columns>`).
  - Link: [components.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/components.md)
- 👤 **Presenter View & Notes**: How to set up and style the speaker dashboard (`presenter.html`), write speaker notes (`<hd-notes>`), and customize widgets.
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
  </script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    <hd-title-slide>
      <div slot="title">My Title</div>
    </hd-title-slide>

    <hd-slide layout="title-body">
      <hd-heading slot="title">Slide Title</hd-heading>
      <hd-text>Body content here.</hd-text>
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

### 3. Absolute Units (`px`) for Custom Styles
When writing custom slide styling (e.g. inside presentation `<style>` tags or inline styles), **always use absolute `px` units** for font sizes, paddings, and margins. Avoid using `rem` or structural `em` layout units, as they are dependent on the external environment's base font size and will cause text overflow or layout shifting when scaled or printed.
