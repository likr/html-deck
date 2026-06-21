---
name: html-deck-developer
description: Guidelines and workflows for modifying, extending, debugging, or refactoring the html-deck WebComponents presentation library core code. Trigger this skill whenever you need to edit src/ html-deck.js, components, dynamic loaders, or when repairing slideshow scaling and printing bugs.
---

# html-deck-developer Skill

This skill is designed for coding agents that are tasking with refactoring, extending, or fixing the core code of the `html-deck` library. It documents crucial architectural assumptions, bugs we've resolved, and the self-update reflection protocol.

---

## 🔁 Self-Reflection & Skill Update Protocol

At the end of **every** development task you complete on the `html-deck` library:
1. **Analyze your work**: Did you fix a scaling bug? Did you encounter a layout collapse or a timing race condition?
2. **Review this SKILL.md file**: Are there parts of this file that could be improved, or new traps that should be documented to protect future agents from making the same mistake?
3. **Self-Update**: Modify this `SKILL.md` file immediately before closing the task to keep the developer skill alive and updated. Explain what you added in your task summary.

---

## 🛠️ Architectural Guidelines

### 1. WebComponents Lifecycle Timing (Crucial)
When `<hd-deck>` is mounted, its `connectedCallback()` runs **before** its Light DOM child elements (like `<hd-slide>`) are fully parsed by the browser HTML engine.
- **Rule**: Never call `this.querySelectorAll('hd-slide')` or try to access child attributes directly inside `connectedCallback` synchronously.
- **Pattern**: Wrap the child detection, transition property assignment, and initial slide updates inside a `setTimeout(..., 0)` block to allow the HTML parser to finish.
```javascript
connectedCallback() {
  // Bind events synchronously
  window.addEventListener('keydown', this.handleKeyDown);

  // Wait for children to be parsed in the DOM
  setTimeout(() => {
    this.slides = Array.from(this.querySelectorAll('hd-slide'));
    this.updateSlides();
    this.handleResize();
  }, 0);
}
```

### 2. Sizing & Scaling (Aspect Ratio)
`html-deck` maintains custom aspect ratios (like 16:9 or 4:3) by holding virtual slide dimensions.
- **Rule**: The default virtual dimension base is **960x540** (proportional to Google Slides 16:9). All component layout sizes, font sizes, gaps, and paddings must be defined in absolute pixels (`px`) proportioned to this 540p virtual canvas (typically font sizes around `12px` - `32px`). Avoid using `rem` or structural `em` values, as these are dependent on the embedding page's root font-size or browser accessibility options and will cause text overflow or layout shifting relative to the fixed 540p container.
- **Rule**: Do not apply responsive layout media queries (like `@media (max-width: 768px)`) inside slide contents or columns. Viewport-based media queries trigger layout collapsing even when the slide is scaled down, breaking the aspect ratio.
- **Rule**: Ensure the layout container (`#layout-root` inside `<hd-slide>`) is always set to `display: flex; flex-direction: column; height: 100%; width: 100%;` so that content elements (like columns) do not collapse to height 0.
- **Rule**: Ensure `.deck-container` has `flex-shrink: 0;` (or `flex: none;`) to prevent the browser from shrinking the virtual layout size (e.g. `960px`) inside the parent flex wrapper before the scale transform is applied.

### 3. Slide Padding & Overflow Bug (Critical)
Applying `padding` directly to `:host` on `<hd-slide>` (which has `width: 100%` / `height: 100%`) causes layout overflow because `:host` box-sizing rules (`border-box`) are inconsistently honored across browsers when scaled. This causes slides to exceed the 960x540 boundaries and break layout alignment.
- **Rule**: **NEVER** set padding on `:host` in `hd-slide.js`.
- **Pattern**: Define padding on the wrapper element inside Shadow DOM (e.g. `.slide-content`). Set `:host` layout to `box-sizing: border-box; width: 100%; height: 100%; overflow: hidden;` and `.slide-content` to `box-sizing: border-box; width: 100%; height: 100%; padding: 2rem;`.

### 4. Printing & PDF Exporting (`@media print`)
When printing, we must disable JavaScript scaling and let the browser format slides sequentially into paper pages.
- **Rule**: Inside `handleResize()`, skip scale calculations when printing:
```javascript
if (window.matchMedia('print').matches) return;
```
- **Rule**: Dynamically calculate the aspect ratio and inject global `@page` rules to `document.head` (since Shadow DOM ignores `@page` rules). Specify the size in proportional physical units (e.g. `16in 9in` or `4in 3in`) to match the user-defined `aspect-ratio` without margins.
- **Rule**: Within `<hd-slide>`, set slide dimensions to match the printing page box viewport exactly using relative viewport units. Avoid hardcoding A4 sizes (`297mm x 210mm`) to prevent aspect-ratio breakage.
```css
@media print {
  :host {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
    position: relative !important;
    width: 100vw !important; /* Fit the computed print page width */
    height: 100vh !important; /* Fit the computed print page height */
    page-break-after: always !important;
    break-inside: avoid !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### 5. Flat CSS & Skeleton Principle & Theming
`html-deck` is a skeleton library by default (white background, minimal decoration), but supports modular themes.
- **Rule**: Always use fallback CSS custom properties inside shadow roots, using the default light theme values as final fallback (e.g., `background-color: var(--hd-slide-bg, var(--hd-bg, #ffffff))` and `color: var(--hd-slide-text-color, var(--hd-text-color, #1e293b))`).
- **Rule**: Theme styling must be provided as isolated external CSS files (e.g. `html-deck.theme-dark.css`) that overwrite `--hd-*` variables on `:root`.
- **Rule**: Code highlights in `hd-codeblock` must map Prism token classes to CSS variables (like `--hd-token-keyword`, `--hd-token-string`) so they dynamically match the active theme.
- **Rule**: Individual slide background and text overrides must be supported via attributes on `hd-slide` (e.g. `[invert]`, `[bg="primary"]`, `[bg="secondary"]`) and styled purely within `hd-slide.js` by overriding `--hd-slide-bg` and other variables inside their respective selector blocks.

### 6. Code Architecture & Entry Points
`src/index.js` has been deprecated. The codebase uses separate entry points:
- `src/html-deck.js`: The main library file that loads dependencies (KaTeX, Prism) and registers core components.
- `src/html-deck-presenter.js`: The entry point for the presenter dashboard view.
- `src/html-deck.css`: Holds global CSS resets, body margins, and user text-decoration utilities.
Ensure any developer changes targeting library loading or presenter view update these respective files rather than single bundles.

### 7. Encapsulated Table Slot Clone Pattern
Because descendants of `::slotted(table)` (like `th`, `td`, `tr`) cannot be styled from within a component's Shadow DOM, components like `<hd-table>` must use the clone pattern:
- **Pattern**: Hide the primary slot in CSS (`slot { display: none; }`).
- **Pattern**: Listen for the `slotchange` event on the slot. Extract the assigned table element, clone it via `table.cloneNode(true)`, and append it into a container within the Shadow DOM. This enables full Shadow DOM styling boundaries on standard table elements.

### 8. Scrollable Containment and Custom Height Styling
When slide content exceeds the standard 960x540 canvas boundaries, use `scrollable` containment:
- **Pattern**: Declare a `scrollable` attribute that accepts a boolean or custom height value (e.g. `scrollable="300px"`).
- **Pattern**: In `attributeChangedCallback`, parse the attribute value. If a value is provided, dynamically set a CSS variable (like `--scroll-height`) on the host element. In CSS, use `:host([scrollable]) pre { max-height: var(--scroll-height, 250px); overflow-y: auto; }` to restrict height and activate standard scrollbars.

### 9. Keyboard Shortcut Modifier Checks
To avoid overriding default browser actions (such as `Ctrl + P` / `Cmd + P` for printing, or page refreshes), keydown event handlers must ignore events accompanied by modifier keys.
- **Rule**: At the start of the `handleKeyDown` callback, return early if any modifier key flag is present:
```javascript
  if (event.ctrlKey || event.metaKey || event.altKey) return;
}
```

### 10. Custom Element Naming & Prefixing (Zero Pollution)
- **Rule**: All custom components and utility styling classes added to the library must be prefixed with `hd-` (e.g. `<hd-footnote>`, `<hd-callout>`, `.hd-mt-md`) to ensure they do not pollute the global namespace or clash with standard HTML elements and presentation author styles.

### 11. Footnote Positioning Constraints
- **Pattern**: By default, `<hd-footnote>` uses absolute positioning (`bottom: 12px; left: 16px;`) relative to the slide canvas, placing it in the bottom-left margin (analogous to the page number on the right).
- **Pattern**: When footnotes are needed in-flow (e.g., inside column splits, grid cards, or table cells), the `inline` attribute must be specified on `<hd-footnote>` to swap its layout from absolute to static block flow.
