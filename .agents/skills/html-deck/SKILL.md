---
name: html-deck
description: How to scaffold, write, structure new presentations, add slides, or customize themes for the html-deck WebComponents library. This skill guides standard presentation authoring, styling, and theme customization. It strictly forbids adding custom CSS, <style> blocks, or inline style="..." attributes unless explicitly requested by the user, forcing standard themes, layouts, and hd- utility classes instead. It also contains rules for creating custom themes using CSS variable overrides. Make sure to use this skill whenever the user mentions building, presenting, exporting slideshows, or creating/modifying slide themes, layouts, or CSS variables.
---

# html-deck Presentation Skill

This skill explains how to build, present, export, and theme elegant slide decks using the `html-deck` WebComponents slideshow library.

Follow the progressive disclosure guidelines below. First, identify what task you are performing, and then read the relevant sub-document in the `references/` directory.

---

## 📚 Table of Contents & References

Always inspect the relevant sub-document using the `view_file` tool to access specific APIs, guidelines, and variables:

### 1. 🚀 Project Setup
How to bootstrap a project from scratch.
- **Topics**: CDN imports, `create-html-deck` CLI scaffolding commands and options.
- **Link**: [project_setup.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/project_setup.md)

### 2. ✍️ Slide Authoring & Design
How to write and structure slide HTML content.
- **Topics**: Flat slide deck DOM structures, layouts (`hd-layout`, `hd-layout-split`, `hd-layout-grid`, `hd-layout-cover`), centering content, card vs. box rules, and vertical spacing constraints to prevent canvas overflows.
- **Link**: [authoring.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/authoring.md)

### 3. 🎨 Theme Customization & Utility Classes
How to customize styles or apply helper utilities.
- **Topics**: Custom theme development principles (dedicated stylesheets, variables overrides only, CSS Relative Color Syntax, 4-color principle, contrast standards, preventing header/footer overlap), compact density templates, and the `hd-` CSS utility classes catalog.
- **Link**: [theme_customization.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/theme_customization.md)

### 4. 🧮 Library Integrations
How to connect with popular third-party tools.
- **Topics**: Rendering equations and formulas with KaTeX, code block syntax highlighting with Prism.js, and importing code files dynamically via Vite raw imports.
- **Link**: [integration.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/integration.md)

### 5. 👥 Presentation Features
How to present and export your deck.
- **Topics**: Setting up speaker dashboards, utilizing presenter components (timers, clocks, slide previews, speaker notes), and exporting slides cleanly to PDF.
- **Link**: [features.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/features.md)

### 6. 🧩 Components API Reference
The detailed technical specification for developers.
- **Topics**: Slots, attributes, events, and shadow DOM configuration details for all custom element tags in the library.
- **Link**: [components.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/components.md)

### 7. 🌈 Theme Parameters Catalog
Built-in preset parameters.
- **Topics**: Variables, colors, and typography settings configured for the 6 standard built-in themes (Default, Dark, Warm, Corporate, Neon, Serif, Dotted).
- **Link**: [themes.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/themes.md)
