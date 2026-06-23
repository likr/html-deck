# HTML-Deck

An agent-first, lightweight WebComponents slideshow platform designed for humans and AI agents.

## 🚀 Features

- 🤖 **Agent-First Design**: Flat DOM tree structures (`<hd-slide>` directly under `<hd-deck>`) and declarative slots make it incredibly easy for LLM agents to generate, read, and edit presentations.
- 🎨 **Built-in Modern Themes**: Includes Corporate, Neon Cyberpunk, Warm Sepia, Serif Academic, and Dark Slate themes built with a carefully curated HSL color palette.
- 👥 **Presenter View**: A local speaker dashboard synchronized using `BroadcastChannel`. Features elapsed time tracking, a clock, slide previews (current/next), speaker notes, and navigation controls.
- 🖨️ **PDF Export & Printing**: Perfect, landscape-oriented PDF printing via the browser (`Ctrl+P` / `Cmd+P`) without layout shifts or overlap.
- ⚙️ **Mathematical & Code Blocks**: Syntax highlighting powered by Prism.js (`<hd-codeblock>`) and math equation rendering powered by KaTeX (`<hd-math>`).

## 📁 Repository Structure

This repository is organized as a monorepo using npm workspaces:

- **`packages/html-deck`**: Core slideshow library containing WebComponents and CSS presets.
- **`packages/create-html-deck`**: CLI generator tool to bootstrap new presentation projects.
- **`packages/html-deck-demo`**: Interactive tutorial and feature demonstration site.
- **`packages/slides`**: A sample presentation deck.

---

## 🛠️ Getting Started (Development)

To run the development server or build the monorepo projects locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will run Vite across workspaces to serve the demos and slides.

3. **Build the packages**:
   ```bash
   npm run build
   ```

---

## 📦 Scaffolding a New Presentation

To create a new presentation from scratch, use the `create-html-deck` CLI:

```bash
npm create html-deck <project-directory> [options]
```

### Options
- `--aspect <ratio>`: Set slide aspect ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--presenter`: Scaffold a local presenter view dashboard (`presenter.html`) and link it.

---

## 🧱 Core Markup Structure

A minimal HTML-Deck slideshow looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Presentation Title</title>
  
  <!-- Load HTML-Deck elements & CSS utilities -->
  <script type="module">
    import 'html-deck';
    import 'html-deck/css';
  </script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    
    <!-- Title Slide -->
    <hd-title-slide>
      <div slot="title">My Awesome Presentation</div>
      <div slot="subtitle">Built with WebComponents</div>
    </hd-title-slide>

    <!-- Standard Slide -->
    <hd-slide layout="title-body">
      <hd-heading slot="heading">Slide Title</hd-heading>
      <hd-text>This is body content.</hd-text>
      
      <!-- Speaker Notes -->
      <hd-notes>
        <p>Introduce the topic here.</p>
      </hd-notes>
    </hd-slide>

  </hd-deck>
</body>
</html>
```

---

## 📚 Component Reference Summaries

HTML-Deck includes 15 distinct WebComponents. Here is a brief summary of the key elements:

| Component | Description / Slots |
| :--- | :--- |
| `<hd-deck>` | Root container. Manages transitions, aspect ratio scaling, routing, and presenter sync. |
| `<hd-slide>` | Single slide container. Supports `layout` presets (`title`, `title-body`, `split`, `blank`). |
| `<hd-title-slide>` | Specialized cover slide component with slots for `title`, `subtitle`, `presenter`, `location`, `date`. |
| `<hd-columns>` / `<hd-column>` | Multi-column flex layout components for grouping content. |
| `<hd-heading>` | Renders header text (supports `level="1"`, `"2"`, or `"3"`). |
| `<hd-text>` | Standard block paragraph wrapper. |
| `<hd-list>` | Smart lists showing different bullet/number styles depending on depth. |
| `<hd-image>` | Render images with rounded corners, captions, shadows, and fit modes. |
| `<hd-table>` | Style-enhanced wrapper for standard HTML `<table>` elements. |
| `<hd-callout>` | Highlight boxes for key callouts (`type="primary"`, `"secondary"`, `"danger"`, etc.). |
| `<hd-codeblock>` | Code block with syntax highlighting powered by Prism.js. |
| `<hd-math>` | Inline or block LaTeX equation renderer powered by KaTeX. |
| `<hd-footnote>` | Absolute or static bottom annotations. |
| `<hd-notes>` | Speaker cues hidden in the main deck, visible in presenter view. |

For full properties, attributes, and variables, see the detailed [Components Reference](.agents/skills/html-deck/references/components.md).

---

## 🎨 Built-in Themes

Themes are enabled by loading the CSS preset stylesheet in the HTML `<head>` after the main library styles.

To support all themes, load Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
```

### Presets
1. **Default (Minimalist Clean)**: Slate text on a clean white background.
2. **Dark Slate** (`html-deck.theme-dark.css`): Slate-900 background with light purple/blue highlights.
3. **Corporate** (`html-deck.theme-corporate.css`): White background, trust navy blue titles, Inter font.
4. **Neon Cyberpunk** (`html-deck.theme-neon.css`): Jet black background, glowing cyan codeblocks, Space Grotesk font.
5. **Warm Sepia** (`html-deck.theme-warm.css`): Warm Ivory background, espresso brown text, Outfit font.
6. **Serif Academic** (`html-deck.theme-serif.css`): Paper white, Playfair Display headers, Lora body text.

For utility classes (e.g., margins, alignments, absolute positioning), see the [Themes & Styling Reference](.agents/skills/html-deck/references/styling.md).

---

## 🖨️ PDF Export & Printing

1. Press **Ctrl + P** / **Cmd + P** in Chrome/Chromium.
2. Set layout/orientation to **Landscape**.
3. Set margins to **None**.
4. Check / Enable **Background graphics**.
5. Save as PDF.

For details on viewport calculations, see the [PDF Export & Printing Reference](.agents/skills/html-deck/references/printing.md).

---

## ⚠️ Critical Development Rules

### 1. Escape HTML in `<hd-codeblock>`
If you display HTML example templates inside `<hd-codeblock>`, **always escape brackets** (`&lt;` and `&gt;`). Raw tags inside the block will be parsed as real slides, which breaks slide deck page indexes.

### 2. Loading External Files
Use Vite raw imports to insert file content into codeblocks:
```html
<hd-codeblock language="javascript" id="my-block"></hd-codeblock>
<script type="module">
  import codeText from './sample-code.js?raw';
  document.getElementById('my-block').textContent = codeText;
</script>
```

### 3. Absolute Units (`px`)
When writing custom slide styles (fonts, margins, paddings), **always use absolute `px` units**. Avoid `rem` or structural `em` layout units, as they can cause text overflows or alignment shifts during scaling or printing.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `ArrowRight`, `Space`, `Enter` | Next Slide |
| `ArrowLeft`, `Backspace` | Previous Slide |
| `F`, `f` | Toggle Fullscreen |
| `P`, `p` | Open Presenter View (requires `presenter-url`) |
