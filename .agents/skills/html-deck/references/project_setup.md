# html-deck Project Setup Reference

This document explains how to set up and initialize a new `html-deck` presentation.

---

## 🚀 1. Scaffolding a New Slide Deck (CLI)

When the user asks to create a **new** presentation, do not write the HTML manually from scratch. Use the `create-html-deck` CLI package to scaffold the project structure.

### Workspace-Specific Local Command
If you are developing inside this monorepo/workspace, run the local CLI binary:
```bash
node packages/create-html-deck/bin/create-html-deck.js <project-directory> [options]
```

### Global/NPM Command
For external users or clean initializations outside the monorepo:
```bash
npm create html-deck <project-directory> [options]
```
*(Alternatively, `npm init html-deck <project-directory>` or `npx create-html-deck <project-directory>`)*

### Options
- `--aspect <ratio>`: Sets the slide aspect ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--presenter`: Automatically includes `presenter-url="presenter.html"` and scaffolds a local presenter view dashboard.

---

## 🌐 2. CDN Loading (Simple / Sandbox Setup)

For sandbox testing, quick previews, or single-file slide decks without NPM setup, load the library directly from unpkg CDN.

### Direct Import
Add this script block to the HTML `<head>`:
```html
<script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2"></script>
```

> [!IMPORTANT]
> **Evaluation Slide Sandbox Standard**: To enable immediate visual previews in the review workspace without local Vite builds, all slide outputs generated inside evaluation test environments must import the module directly from the unpkg CDN (specifically version `1.0.0-alpha.2`):
> `<script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2"></script>`
> Also, never load external `html-deck.css` files, as the library bundles its internal styles dynamically at runtime.
