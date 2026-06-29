---
name: html-deck-developer
description: Guidelines and workflows for modifying, extending, debugging, or refactoring the html-deck WebComponents presentation library core code. Trigger this skill whenever you need to edit src/ html-deck.js, components, dynamic loaders, or when repairing slideshow scaling and printing bugs.
---

# html-deck-developer Skill

This skill is designed for coding agents that are tasked with refactoring, extending, or fixing the core code of the `html-deck` library. It documents crucial architectural assumptions, styling guidelines, and the self-update reflection protocol.

---

## 🔁 Self-Reflection & Skill Update Protocol

At the end of **every** development task you complete on the `html-deck` library:
1. **Analyze your work**: Did you fix a scaling bug? Did you encounter a layout collapse or a timing race condition?
2. **Review the guidelines**: Are there parts of the guidelines (including references) that could be improved, or new traps that should be documented to protect future agents from making the same mistake?
3. **Self-Update**: Modify the appropriate guideline files (e.g., this `SKILL.md` or files under `references/`) immediately before closing the task to keep the developer skill alive and updated. Explain what you added in your task summary.

---

## 🛠️ Developer Reference Files (Progressive Disclosure)

To keep the developer skill concise and maintainable, guidelines are organized into specific reference files. **Before performing any development task, you MUST read the relevant reference files using the `view_file` tool:**

1. **CSS Design & Coding Styles**
   - **File**: [css_style_guide.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck-developer/references/css_style_guide.md)
   - **When to read**: Whenever you are modifying, refactoring, or creating any CSS stylesheets, CSS variables, utility classes, themes, or inline component styles.
   - **Key contents**: Strict CSS rules (custom properties fallbacks, pixel units principle, styling assignment via configuration variables only, styling definitions locations, and themes rules).

2. **Architectural Decisions & Traps**
   - **File**: [architectural_decisions.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck-developer/references/architectural_decisions.md)
   - **When to read**: Whenever you are refactoring components logic, layout scripts, event handling, printing styles, presenter view sync, or resolving scaling and rendering bugs.
   - **Key contents**: Lifecycle timing traps (`connectedCallback`, dynamic rendering), sizing & scaling, padding limitations, printing configurations, presenter synchronization, and custom component patterns.

---

## 📦 Code Architecture, Entry Points & Monorepo Structure

The project is organized as an **npm workspaces monorepo** under `packages/`:

- **`packages/html-deck/`** — the publishable library package:
  - `src/components/html-deck/`: Core slide elements (`hd-deck.js`, `hd-slide.js`, etc.).
  - `src/components/html-deck-presenter/`: Presenter dashboard elements.
  - `src/html-deck.js`: Main library entry point — imports and dynamically injects core CSS styles as an inline string (`?inline`), and registers all core components.
  - `src/html-deck-presenter.js`: Presenter view entry point.
  - `src/html-deck.css`: Main CSS entry point that imports all sub-stylesheets from `src/styles/`.
  - `src/styles/`: Modularized CSS files (e.g., `reset.css`, `variables.css`, `elements.css`, `components.css`, `utilities.css`).
  - `src/themes/`: Re-located theme files override configurations (e.g., `html-deck.theme-dark.css`, `html-deck.theme-neon.css`, etc.).
  - `vite.config.js`: Builds `dist/html-deck.js`, `dist/html-deck-presenter.js`, `dist/html-deck.css` using Vite library mode.
- **`packages/html-deck-demo/`** — private demo/landing page package:
  - Uses `html-deck` as a workspace dependency.
  - Built as a multi-page Vite app.
  - Slides import `html-deck` via `import 'html-deck'` and `import 'html-deck/css'`.
- **`packages/create-html-deck/`** — publishable CLI scaffolding tool.
- **`packages/slides/`** — private personal slides package.

### Build and Development Commands (from the monorepo root):
```bash
npm run build -w html-deck        # Build the library dist/
npm run build -w html-deck-demo   # Build the demo website
npm run dev -w html-deck-demo     # Dev server for the demo
npm run dev -w slides             # Dev server for personal slides
```

- **Conditional Exports Rule**: The library's `package.json` maps `exports` dynamically. The `"development"` condition points to `./src/` files, while the `"default"` condition points to `./dist/` files. This lets Vite resolve source files automatically during development, removing the need for any custom `resolve.alias` configs in consumer workspaces.
- **Rule**: During local development, the consumer packages (`html-deck-demo` and `slides`) resolve `html-deck` imports directly from the `src/` directory. Therefore, **you do NOT need to run `npm run build -w html-deck` when testing local changes** in the dev server (even if the `dist/` directory is completely deleted).
- **Rule**: You only need to run `npm run build -w html-deck` to update `dist/` when preparing for release or verifying the final production bundle.

---

## 🧪 Evaluation Test Standards

When developing or executing evaluation tests (e.g. for theme-creation, slide structure validation) inside evaluation workspaces:
- **CDN Loading Syntax**: Always use direct unpkg CDN module imports inside slide HTML files, specifying the target version to ensure hermetic and reproducible execution:
  - `<script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2"></script>`
- **No Bundle/External CSS Requirement**: Since `html-deck` encapsulates its styles, never import external `html-deck.css` or similar stylesheets.
- **Inline Custom Theme Blocks**: Inline all CSS variable theme definitions in a `<style>` element under the `:root` selector in the slide HTML. Do not output standalone `.css` theme files inside evaluation workspaces.
