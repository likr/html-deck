# HTML-Deck

An agent-first, lightweight WebComponents slideshow platform designed for humans and AI agents.

## 🚀 Features

- 🤖 **Agent-First Design**: Flat DOM tree structures (`<hd-slide>` directly under `<hd-deck>`) and declarative layout components (`<hd-layout>`, `<hd-layout-split>`, etc.) make it incredibly easy for LLM agents to generate, read, and edit presentations.
- 🎨 **Built-in Modern Themes**: Includes Corporate, Neon Cyberpunk, Warm Sepia, Serif Academic, and Dark Slate themes built with a carefully curated HSL color palette. Global CSS is automatically injected.
- 👥 **Presenter View**: A local speaker dashboard synchronized using `BroadcastChannel`. Features elapsed time tracking, a clock, slide previews (current/next), speaker notes, and navigation controls.
- 🖨️ **PDF Export & Printing**: Perfect, landscape-oriented PDF printing via the browser (`Ctrl+P` / `Cmd+P`) without layout shifts or overlap.
- ⚙️ **Mathematical & Code Blocks**: Easily integrated with Prism.js and KaTeX to support math equation rendering and code syntax highlighting on raw HTML elements.

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

To quickly bootstrap a new presentation project with build setups and template files, use the `create-html-deck` CLI:

```bash
# 1. Create a new presentation project
npm create html-deck my-presentation

# 2. Navigate to the project directory
cd my-presentation

# 3. Install dependencies and start development server
npm install
npm run dev
```

For more advanced setups, you can customize the scaffolding using options:

```bash
npm create html-deck <project-directory> [options]
```

### Options
- `--aspect <ratio>`: Set slide aspect ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--lang <lang>`: Set HTML lang attribute. Examples: `ja`, `en` (default).
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
  
  <!-- Load HTML-Deck (automatically injects CSS) -->
  <script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2/dist/html-deck.js"></script>
</head>
<body>
  <hd-deck aspect-ratio="16:9">
    
    <!-- Title Slide -->
    <hd-slide>
      <hd-layout-cover>
        <h1 slot="title">My Awesome Presentation</h1>
        <p slot="subtitle">Built with WebComponents</p>
      </hd-layout-cover>
      <div slot="notes">
        <p>Introduce the topic here.</p>
      </div>
    </hd-slide>

    <!-- Standard Slide -->
    <hd-slide>
      <hd-layout>
        <h2 slot="heading">Slide Title</h2>
        <p class="hd-text">This is body content.</p>
        <ul>
          <li>Bullet point A</li>
          <li>Bullet point B</li>
        </ul>
      </hd-layout>
      <div slot="notes">
        <p>Notes visible in presenter view.</p>
      </div>
    </hd-slide>

  </hd-deck>
</body>
</html>
```

---

## 📚 Component Reference Summaries

HTML-Deck includes 9 distinct core WebComponents. Here is a brief summary of the key elements:

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

For full properties, attributes, and variables, see the detailed [Components Reference](.agents/skills/html-deck/references/components.md).

---

## 🎨 Built-in Themes

Themes are enabled by loading the corresponding CSS preset stylesheet in the HTML `<head>` after the main library script:

```html
<link rel="stylesheet" href="https://unpkg.com/html-deck@1.0.0-alpha.2/dist/themes/html-deck.theme-[theme-name].css">
```

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
4. **Neon Cyberpunk** (`html-deck.theme-neon.css`): Jet black background, glowing cyan outlines, Space Grotesk font.
5. **Warm Sepia** (`html-deck.theme-warm.css`): Warm Ivory background, espresso brown text, Outfit font.
6. **Serif Academic** (`html-deck.theme-serif.css`): Paper white, Playfair Display headers, Lora body text.

For utility classes (e.g., margins, alignments, absolute positioning), see the [Themes & Styling Reference](.agents/skills/html-deck/references/styling.md).

### 🛠️ Theme Creation Constraints

When designing custom themes for `html-deck`, you must adhere to the following rules:
- **CSS Variable Overrides Only**: All custom themes must be created in a dedicated CSS file containing ONLY variable overrides under the `:root` selector.
- **Direct Selector Prohibition**: Direct styling of HTML element tags (like `hd-slide`, `h1`) or class names (like `.hd-card`) is strictly prohibited.
- **Relative Color Syntax**: Use CSS Relative Color Syntax (e.g., `rgba(from var(--hd-main-color) r g b / 0.15)`) to derive translucent or muted colors.
- **Explicit Variable Names**: Do not introduce or use abbreviated variable names like `bg` or `color` for backgrounds or text colors. Always use full, explicit names such as `background-color` and `text-color` (e.g., `--hd-card-background-color` instead of `--hd-card-bg`).

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

### 1. Escape HTML in Code Blocks
If you display HTML example templates inside `<pre><code>` blocks, **always escape brackets** (`&lt;` and `&gt;`) if they are evaluated by the browser in the DOM, or set text via JavaScript `.textContent` to prevent them from being parsed as real slides.

### 2. Absolute Units (`px`)
When writing custom slide styles (fonts, margins, paddings), **always use absolute `px` units**. Avoid `rem` or structural `em` layout units, as they can cause text overflows or alignment shifts during scaling or printing.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `ArrowRight`, `Space`, `Enter` | Next Slide |
| `ArrowLeft`, `Backspace` | Previous Slide |
| `F`, `f` | Toggle Fullscreen |
| `P`, `p` | Open Presenter View (requires `presenter-url`) |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
