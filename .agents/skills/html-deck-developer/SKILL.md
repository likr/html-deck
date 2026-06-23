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
- **Rule**: To prevent vertical scrolling on mobile browsers when address/navigation bars are shown or hidden, the main `<hd-deck>`'s `:host` height must be defined using dynamic viewport units (`height: 100dvh;`) with a standard fallback (`height: 100vh;`).

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
- **Rule**: All public presentation CSS variables must be declared under the `:root` selector inside `html-deck.css` with their default fallback values. Inside Shadow DOM style sheets or other selectors, use direct variable references (e.g. `var(--hd-slide-bg)`) without repeating duplicate fallbacks to keep the code DRY.
- **Rule**: Theme styling must be provided as isolated external CSS files (e.g. `html-deck.theme-dark.css`) that overwrite `--hd-*-color` variables on `:root`.
- **Rule**: Theme primary, secondary, and other palette variables must use the `-color` suffix (e.g. `--hd-primary-color`, `--hd-secondary-color`). Avoid exposing un-suffixed variable names (like `--hd-primary`) as root variables.
- **Rule**: Code highlights in `hd-codeblock` must map Prism token classes to CSS variables (like `--hd-token-keyword`, `--hd-token-string`) so they dynamically match the active theme.
- **Rule**: Individual slide background and text overrides must be supported via attributes on `hd-slide` (e.g. `[invert]`, `[bg="primary"]`, `[bg="secondary"]`) and styled purely within `hd-slide.js` by overriding `--hd-slide-bg` and other variables inside their respective selector blocks.

### 6. Code Architecture, Entry Points & Monorepo Structure
The project is organized as an **npm workspaces monorepo** under `packages/`:

- **`packages/html-deck/`** — the publishable library package:
  - `src/components/html-deck/`: Core slide elements (`hd-deck.js`, `hd-slide.js`, etc.).
  - `src/components/html-deck-presenter/`: Presenter dashboard elements.
  - `src/html-deck.js`: Main library entry point — imports KaTeX/Prism JS and CSS as bundled strings (`?raw`), registers all core components.
  - `src/html-deck-presenter.js`: Presenter view entry point.
  - `src/html-deck.css`: Global CSS resets and utility classes.
  - `vite.config.js`: Builds `dist/html-deck.js`, `dist/html-deck-presenter.js`, `dist/html-deck.css` using Vite library mode.
- **`packages/html-deck-demo/`** — private demo/landing page package:
  - Uses `html-deck` as a workspace dependency.
  - Built as a multi-page Vite app.
  - Slides import `html-deck` via `import 'html-deck'` and `import 'html-deck/css'`.
- **`packages/create-html-deck/`** — publishable CLI scaffolding tool.
- **`packages/slides/`** — private personal slides package.

**Build and Development commands** from the monorepo root:
```bash
npm run build -w html-deck        # Build the library dist/
npm run build -w html-deck-demo   # Build the demo website
npm run dev -w html-deck-demo     # Dev server for the demo
npm run dev -w slides             # Dev server for personal slides
```

**Rule**: During local development, the consumer packages (`html-deck-demo` and `slides`) resolve `html-deck` imports directly from the `src/` directory using **conditional exports** defined in `packages/html-deck/package.json`. Therefore, **you do NOT need to run `npm run build -w html-deck` when testing local changes** in the dev server (even if the `dist/` directory is completely deleted).
- **Conditional Exports Rule**: The library's `package.json` maps `exports` dynamically. The `"development"` condition points to `./src/` files, while the `"default"` condition points to `./dist/` files. This lets Vite resolve source files automatically during development, removing the need for any custom `resolve.alias` configs in consumer workspaces.

**Rule**: You only need to run `npm run build -w html-deck` to update `dist/` when preparing for release or verifying the final production bundle.

### 7. hd-codeblock: No Runtime `src` Fetching (DEPRECATED)
The `src` attribute of `<hd-codeblock>` has been **fully removed**. Runtime fetching was unreliable (path resolution errors in presenter view, network dependency in offline use).
- **New pattern**: Use Vite's `?raw` text import in a `<script type="module">` block and set the `code` attribute directly:
```html
<hd-codeblock language="javascript" id="my-block"></hd-codeblock>
<script type="module">
  import codeText from './file.js?raw';
  document.getElementById('my-block').setAttribute('code', codeText);
</script>
```
- The `code` attribute is now in `observedAttributes` and triggers re-highlighting when changed.


### 7. Encapsulated Table Slot Clone Pattern
Because descendants of `::slotted(table)` (like `th`, `td`, `tr`) cannot be styled from within a component's Shadow DOM, components like `<hd-table>` must use the clone pattern:
- **Pattern**: Hide the primary slot in CSS (`slot { display: none; }`).
- **Pattern**: Listen for the `slotchange` event on the slot. Extract the assigned table element, clone it via `table.cloneNode(true)`, and append it into a container within the Shadow DOM. This enables full Shadow DOM styling boundaries on standard table elements.

### 8. Slide Overflow & Container Scrolling (Scrollable Decommissioned)
Slide-level `scrollable` and `height` attributes on `<hd-slide>` are fully decommissioned.
- **Pattern**: If contents inside a slide exceed standard 960x540 canvas boundaries, use standard CSS properties on local content containers (such as cards or divs) to restrict height and enable scrolling:
  `style="max-height: 250px; overflow-y: auto;"`

### 9. Keyboard Shortcut Modifier Checks
To avoid overriding default browser actions (such as `Ctrl + P` / `Cmd + P` for printing, or page refreshes), keydown event handlers must ignore events accompanied by modifier keys.
- **Rule**: At the start of the `handleKeyDown` callback, return early if any modifier key flag is present:
```javascript
  if (event.ctrlKey || event.metaKey || event.altKey) return;
}
```

### 10. Custom Element Naming & Prefixing (Zero Pollution)
### 10. CSS Class & Slot Naming & Prefixing (Zero Pollution)
- **Rule**: All library-specific styling classes and slots must be prefixed with `hd-` or matching conventions (e.g. `.hd-callout`, `slot="footnote"`, `.hd-mt-md`) to ensure they do not pollute the global namespace or clash with standard HTML elements and presentation author styles.

### 11. Footnote Positioning Constraints
- **Pattern**: By default, slotted elements with `slot="footnote"` (e.g., `<div slot="footnote">`) use absolute positioning (`bottom: 12px; left: 16px;`) relative to the slide canvas, placing them in the bottom-left margin (analogous to the page number on the right). Styled via `::slotted([slot="footnote"])` inside `hd-slide.js`.

### 12. Presenter View Synchronization and Preview Styling
- **Trap (Asset Resolution)**: Slides cloned and sent to the presenter view (which has a different URL directory) will fail to resolve relative assets (like `<hd-codeblock src="...">` or `<img>` tags).
  - **Pattern**: Before broadcasting the HTML string via `BroadcastChannel`, rewrite relative `src` and `href` attributes to absolute URLs (e.g. via `new URL(val, window.location.href).href`).
- **Trap (Dynamic Styles timing)**: Inserting `<style>` elements dynamically into a preview container's `innerHTML` causes browser styling computation delays. Synchronous dimension queries (`clientWidth`/`clientHeight`) immediately after will return `0`, breaking scale computations.
  - **Pattern**: Declare preview styling statically inside the WebComponent's constructor. Additionally, defer scale calculations using `requestAnimationFrame` to ensure the layout engine has updated.

### 13. Box-Sizing and Global Reset Inheritance
- **Trap (Box-Sizing Inheritance)**: Using global box-sizing inheritance (`* { box-sizing: inherit; }`) in library stylesheets is fragile. If the host page or outer document wrapper has `box-sizing: content-box` (default), custom elements and light-DOM children inside them will inherit `content-box`. This overrides any `:host { box-sizing: border-box; }` rules defined inside Web Components, causing padding and borders to enlarge the layouts beyond the virtual canvas and break alignment.
  - **Rule**: Always use direct global resets (`* { box-sizing: border-box; }`) rather than inherited ones in global stylesheets (`html-deck.css`).
  - **Rule**: Define explicit box-sizing rules inside Shadow DOM stylesheets for layout components to keep their layout boundaries safe.


### 14. Heading Colors and Title Slot Color Override Pattern
- Rule: Heading elements `h1` through `h6` should not have default colored styles. They should inherit the slide's text color (`var(--hd-slide-text-color, var(--hd-text-color))`) by default so they cleanly support invert/background colors without hardcoded overrides.
- Rule: Elements slotted into `slot="title"` should inherit the slide's text color by default. Custom colors must be applied via specific classes or custom styles.
- Rule: Heading elements `h1` through `h6` do not change size automatically; they all default to `font-size: 1em;` to focus purely on semantic HTML. Sizing must be controlled via layout slot selectors or utility classes.

### 15. Unified Sizing Suffixes & Utility Naming System
- Rule: All layouts, margins, gaps, max-widths, and text sizes use a unified numeric suffix (`0`, `1`, `2`...) instead of semantic sizes (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`).
- Rule: For font sizes, `1` is the largest (`--hd-text-size-1: 32px`) and `6` is the smallest (`12px`).
- Rule: For spacing/gaps, `1` is the smallest (`4px`) and `6` is the largest (`48px`). Suffix `0` represents `0px`.
- Rule: Font weights are named semantically rather than using numbers. They are structured under the `.hd-text-weight-*` namespace: `.hd-text-weight-light`, `.hd-text-weight-normal`, `.hd-text-weight-medium`, `.hd-text-weight-semibold`, `.hd-text-weight-bold`, and `.hd-text-weight-extrabold`.

### 16. Unified Color Utilities, Text Transformations, and Cards
- Rule: All specific element color variables like `--hd-link-color`, `--hd-list-color`, and `--hd-math-color` are discarded. Links, lists, math, and slot="title" elements inherit slide text color by default, and are styled via direct color classes (e.g. `.hd-primary`).
- Rule: Color class utilities use the form `.hd-primary`, `.hd-secondary`, etc. to style text color. The deprecated `.hd-text-*` and `.hd-bg-*` classes are not used.
- Rule: Background highlights are configured using the helper class `.hd-background` combined with a color class (e.g., `class="hd-primary hd-background"`). When combined, this sets the background color and automatically sets the text color to a theme-defined contrast variable (e.g., `--hd-primary-contrast-color`).
- Rule: Card components use `.hd-card` which styles border-radius, background-color, and text-color. Cards do NOT draw borders by default. To add a border, explicitly include the `.hd-border` utility class (e.g., `class="hd-card hd-border"`), which automatically applies themed border colors when combined with color classes (e.g., `class="hd-card hd-primary hd-border"`).
- Rule: Link elements (`<a>`) inside slides default to `text-decoration: none` and inherit color. Underlining must be explicitly added using the `.hd-underlined` utility class. Other text transformations use `.hd-capitalized`, `.hd-lowercase`, and `.hd-uppercase`. The class `.hd-line-through` has been deleted; use the standard HTML `<s>` tag instead.

