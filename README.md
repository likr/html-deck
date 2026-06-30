# HTML-Deck

An agent-first, lightweight WebComponents slideshow platform designed for humans and AI agents.

## Features

- **Agent-First Design**: Flat DOM tree structures (`<hd-slide>` directly under `<hd-deck>`) and declarative layout components (`<hd-layout>`, `<hd-layout-split>`, etc.) make it straightforward for LLM agents to generate, read, and edit presentations.
- **Built-in Modern Themes**: Includes Corporate, Neon Cyberpunk, Warm Sepia, Serif Academic, and Dark Slate themes built with a carefully curated HSL color palette. Global CSS is automatically injected.
- **Presenter View**: A local speaker dashboard synchronized using `BroadcastChannel`. Features elapsed time tracking, a clock, slide previews (current/next), speaker notes, and navigation controls.
- **PDF Export and Printing**: Landscape-oriented PDF printing via the browser without layout shifts or overlap.
- **Mathematical and Code Blocks**: Easily integrated with Prism.js and KaTeX to support math equation rendering and code syntax highlighting on raw HTML elements.

## Repository Structure

This repository is organized as a monorepo using npm workspaces:

- **packages/html-deck**: Core slideshow library containing WebComponents and CSS presets.
- **packages/create-html-deck**: CLI generator tool to bootstrap new presentation projects.
- **packages/html-deck-demo**: Interactive tutorial and feature demonstration site.
- **packages/slides**: A sample presentation deck.

## Scaffolding a New Presentation

To bootstrap a new presentation project with build setups and template files, use the `create-html-deck` CLI:

```bash
npm create html-deck my-presentation
```

For more advanced setups, you can customize the scaffolding using options:

```bash
npm create html-deck <project-directory> [options]
```

### Options
- `--aspect <ratio>`: Set slide aspect ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--lang <lang>`: Set HTML lang attribute. Examples: `ja`, `en` (default).
- `--presenter`: Scaffold a local presenter view dashboard (`presenter.html`) and link it.

## Developer Skill Integration

If you are developing presentations with an AI agent in a compatible environment, you can install the `html-deck` skill directly into your workspace by running:

```bash
npx skills add likr/html-deck@html-deck
```

This skill provides the agent with structured instructions on markup layouts, styling guides, and theme constraints to ensure code compliance.

## Core Markup Structure

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

## Component Reference Summaries

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

For full properties, attributes, and variables, see the [packages/html-deck README](packages/html-deck/README.md) or the [Components Reference](.agents/skills/html-deck/references/components.md).

## Built-in Themes

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

For utility classes and theme creation constraints, see the [packages/html-deck README](packages/html-deck/README.md).

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `ArrowRight`, `Space`, `Enter` | Next Slide |
| `ArrowLeft`, `Backspace` | Previous Slide |
| `F`, `f` | Toggle Fullscreen |
| `P`, `p` | Open Presenter View (requires `presenter-url`) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
