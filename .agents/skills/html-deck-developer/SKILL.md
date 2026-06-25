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
- **Rule**: All public presentation CSS variables must be declared under the `:root` selector inside `variables.css` (which is imported by `html-deck.css`) with their default fallback values. Inside Shadow DOM stylesheets, components, or other selectors, use direct variable references (e.g. `var(--hd-slide-padding-top)`) and never write inline duplicate fallbacks (e.g. `var(--hd-slide-padding-top, 30px)`) to keep the styling system strictly DRY and maintainable.
- **Rule**: Theme styling must be provided as isolated external CSS files (e.g. `html-deck.theme-dark.css`) that override `--hd-*-color` variables on `:root`.
- **Rule**: Theme stylesheets must **exclusively** override CSS variables under the `:root` selector. They must **never** target HTML tags or class names (like `hd-slide` or `.hd-card`) directly. If a theme requires custom styling for individual elements (such as borders, scrollbars, code blocks, or shadows), those elements/classes in `html-deck.css` or Shadow DOM must reference new parameterized CSS variables (e.g. `--hd-codeblock-bg`, `--hd-scrollbar-thumb-bg`, `--hd-card-shadow-primary`), allowing the theme to configure them cleanly via `:root`. If a theme requires slide-scoped variable overrides (such as heading background colors, custom content spacing, or slide header contrast overrides), these must be parameterized using theme-specific parameter variables (e.g. `--hd-*-header-background-color`, `--hd-*-header-text-color`, `--hd-layout-content-margin-theme`, `--hd-layout-header-color`) declared on `:root` in `variables.css` and mapped to element selectors in `components.css`, rather than targeting elements inside the theme stylesheet.
- **Rule**: To keep theme stylesheets DRY, themes must avoid hardcoding redundant hex or rgba color literals when defining transparency, shadows, opacities, scrollbars, border/background variations, or other derived values. Instead, themes must exclusively use **CSS Relative Color Syntax** (e.g., `rgb(from var(--hd-primary-color) r g b / 0.15)`) to derive all opacity adjustments, channel modifications, or shade shifts from the allowed base variables (`--hd-*-color`, `--hd-*-background-color`, `--hd-*-border-color`, and `--hd-*-accent-text-color`).
- **Rule**: If a layout component (like `hd-layout`) needs to expand its heading area background to cover the top/sides of the slide, it should use negative margins calculated from slide paddings (e.g., `margin-top: calc(-1 * var(--hd-slide-padding-top))`). When `no-padding` is set on the slide, the slide component must locally override those padding variables to `0px` to prevent layout overflow.
- **Rule**: Theme primary, secondary, and other palette variables must use the `-color` suffix (e.g. `--hd-primary-color`, `--hd-secondary-color`). Avoid exposing un-suffixed variable names (like `--hd-primary`) as root variables.
- **Rule**: Code highlights in `hd-codeblock` must map Prism token classes to CSS variables (like `--hd-token-keyword`, `--hd-token-string`) so they dynamically match the active theme.
- **Rule**: Individual slide background, text, and heading overrides must be supported via HTML attributes on `hd-slide` (e.g., `type="X"` and `heading="X"`). These are styled globally inside `components.css` by overriding local slide-scoped variables (`--hd-layout-heading-bg`, `--hd-layout-heading-color`, and `--hd-layout-heading-hr-color`). To ensure layout headings match their themed counterparts, `hd-slide[type="X"]` overrides should override the heading background, text, and divider color, while `hd-slide[heading="X"]` overrides should only override the heading background and text color (leaving the divider unchanged).

### 6. Code Architecture, Entry Points & Monorepo Structure
The project is organized as an **npm workspaces monorepo** under `packages/`:

- **`packages/html-deck/`** — the publishable library package:
  - `src/components/html-deck/`: Core slide elements (`hd-deck.js`, `hd-slide.js`, etc.).
  - `src/components/html-deck-presenter/`: Presenter dashboard elements.
  - `src/html-deck.js`: Main library entry point — imports KaTeX/Prism JS and CSS as bundled strings (`?raw`), registers all core components.
  - `src/html-deck-presenter.js`: Presenter view entry point.
  - `src/html-deck.css`: Main CSS entry point that imports all sub-stylesheets from `src/styles/`.
  - `src/styles/`: Modularized CSS files (e.g. `reset.css`, `variables.css`, `elements.css`, `components.css`, `utilities.css`).
  - `src/themes/`: Re-located theme files override configurations (e.g. `html-deck.theme-dark.css`, `html-deck.theme-neon.css`, etc.).
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


### 14. Heading Colors, Title, and Heading Slot Customization Pattern
- Rule: Heading elements `h1` through `h6` should not have default colored styles. They should inherit the slide's text color (`var(--hd-slide-text-color, var(--hd-text-color))`) by default so they cleanly support invert/background colors without hardcoded overrides.
- Rule: Cover slides (`hd-layout-cover`) use `slot="title"`, while standard/split/three slides (`hd-layout`, `hd-layout-split`, `hd-layout-three`) use `slot="heading"`. This prevents slot name clashes.
- Rule: Elements slotted into `slot="heading"` should inherit the slide's text color by default and be customized using `--hd-layout-heading-*` CSS variables (e.g. `--hd-layout-heading-font-size`, `--hd-layout-heading-color`, `--hd-layout-heading-margin`, `--hd-layout-heading-padding-bottom`) and `--hd-layout-heading-hr-*` variables for the separator line.
- Rule: Heading elements `h1` through `h6` do not change size automatically; they all default to `font-size: 1em;` to focus purely on semantic HTML. Sizing must be controlled via layout slot selectors or utility classes.
- Rule: The layout contents (from the `before` to `after` slots) are wrapped in a `.layout-content` element. The spacing between the heading block (heading area + divider) and the layout contents is managed via `--hd-layout-content-margin` on `.layout-content`. To prevent double margins when the divider line is visible, the divider's bottom margin is set to `0` and spacing is entirely delegated to `--hd-layout-content-margin` (which defaults to `var(--hd-layout-heading-margin) 0 0 0`).

### 15. Unified Sizing Suffixes & Utility Naming System
- Rule: All layouts, margins, gaps, max-widths, and text sizes use a unified numeric suffix (`0`, `1`, `2`...) instead of semantic sizes (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`).
- Rule: For font sizes, `1` is the largest (`--hd-text-size-1: 32px`) and `6` is the smallest (`12px`).
- Rule: For spacing/gaps, `1` is the smallest (`4px`) and `6` is the largest (`48px`). Suffix `0` represents `0px`.
- Rule: Widths are configured using standard 12-column percentages: `.hd-width-1` through `.hd-width-12` setting `width: calc(100% * x / 12) !important;`. The old `.hd-max-w-*` and `.hd-w-full` are fully deprecated.
- Rule: Font weights are named semantically rather than using numbers. They are structured under the `.hd-text-weight-*` namespace: `.hd-text-weight-light`, `.hd-text-weight-normal`, `.hd-text-weight-medium`, `.hd-text-weight-semibold`, `.hd-text-weight-bold`, and `.hd-text-weight-extrabold`.

### 16. Unified Color Utilities, Text Transformations, and Cards
- Rule: All specific element color variables like `--hd-link-color`, `--hd-list-color`, and `--hd-math-color` are discarded. Links, lists, math, and slot="title" elements inherit slide text color by default, and are styled via direct color classes (e.g. `.hd-primary`).
- Rule: Color class utilities use the form `.hd-primary`, `.hd-secondary`, etc. to style text color. The deprecated `.hd-text-*` and `.hd-bg-*` classes are not used.
- Rule: The `.hd-background` helper class is abolished. When color classes (e.g., `.hd-primary`, `.hd-secondary`) are applied directly to background containers like `hd-slide` and `.hd-card`, they automatically change their background and text colors to the corresponding contrast palette values.
- Rule: Card components use `.hd-card` which styles border-radius, background-color, and text-color. Cards do NOT draw borders by default. To add a border, explicitly include the `.hd-border` utility class (e.g., `class="hd-card hd-border"`), which automatically applies themed border colors when combined with color classes (e.g., `class="hd-card hd-primary hd-border"`).
- Rule: Link elements (`<a>`) inside slides default to `text-decoration: none` and inherit color. Underlining must be explicitly added using the `.hd-underlined` utility class. Other text transformations use `.hd-capitalized`, `.hd-lowercase`, and `.hd-uppercase`. The class `.hd-line-through` has been deleted; use the standard HTML `<s>` tag instead.

### 17. Slide-Level Absolute Positioned Margins & Padding Alignment
- Rule: Slide padding is managed at the `hd-slide` level (on `.slide-content`). Layout components like `hd-layout`, `hd-layout-split`, `hd-layout-three`, and `hd-layout-cover` must not apply their own padding to prevent double-padding.
- Rule: When positioning header, footer, and page-number elements absolutely in the margins, use the unified peripheral variables:
  - `--peripheral-font-size` (defaults to `9px`)
  - `--peripheral-line-height` (defaults to `1`)
  - `--peripheral-header-top` (defaults to `12px`)
  - `--peripheral-footer-bottom` (defaults to `12px`)
- Rule: The page number is positioned vertically at `bottom: var(--peripheral-footer-bottom, 12px)` to ensure consistency with the footer.
- Trap (Shadow DOM Slot Querying): In Shadow DOM, calling `shadowRoot.querySelector('slot')` selects the first slot in DOM order. If named slots (like `header` or `footer`) are placed before the default slot in the template, `querySelector('slot')` will incorrectly select the named slot instead of the default slot. Always use `querySelector('slot:not([name])')` to safely target the default slot.

### 18. Directional Alignment Utilities
- Rule: The horizontal block-centering helper `.hd-mx-auto` is fully abolished. Block horizontal and vertical alignments are controlled using directional classes:
  - Horizontal: `.hd-align-left`, `.hd-align-center`, `.hd-align-right`
  - Vertical (for flex containers): `.hd-align-top`, `.hd-align-middle`, `.hd-align-bottom`

### 19. Deprecated Math & Code Helper Classes
- Rule: `.hd-code-scrollable`, `.hd-math-block`, and `.hd-math-inline` are fully deleted. standard math rendering is managed by KaTeX auto-render parsing standard math tags (such as `div` and `span` with math delimiters `$$` or `\(`). Standard overflow-y settings are applied directly to pre or block code elements.

### 20. Margin Resets and Specificity Boundaries
- **Trap (Reset Specificity & !important)**: Declaring `!important` on global margin reset rules (like `*:last-child { margin-bottom: 0 !important; }`) is a trap. It prevents utility classes (like `.hd-align-middle` or `.hd-align-bottom` which use `!important`) from setting `margin-bottom: auto` or custom spacing.
  - **Rule**: Never use `!important` on general margin resets or `*:last-child` selectors in core stylesheets (`html-deck.css`). Base and reset styles must use standard specificity rules so that explicit utility classes (which use `!important`) can override them.
  - **Rule**: To reset the bottom margin of the last contiguous element inside named slots (like `slot="left"` or `slot="right"`), use the `:has` contiguous sibling check in the stylesheet:
    `[slot="left"]:not(:has(+ [slot="left"])) { margin-bottom: 0; }`

### 21. Core Reset Separation
- **Rule**: Standard HTML baseline resets and global resets (such as wildcard `box-sizing` rules, margin/padding overrides, and display blocks for media tags) must be declared in [reset.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/reset.css) and imported at the top of [html-deck.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/html-deck.css) rather than being mixed into utility classes.

### 22. CSS Custom Property Inheritance & Evaluation
- **Trap (Static Variable Inheritance)**: Declaring custom properties on a parent scope (e.g. `:root`) that reference other variables (e.g. `--hd-slide-background-color: var(--hd-base-color);`) will resolve their values statically at the parent scope. When a child element overrides the referenced variable (e.g., `:host([inverted])` overrides `--hd-base-color`), child elements of that child element will still inherit the *resolved static value* of the first variable from the parent scope, not the overridden dynamic reference.
- **Rule**: When using attributes like `[inverted]` or other overrides on a container WebComponent, you must explicitly redefine all semantic variables referencing base variables at the overridden selector scope (e.g. inside `:host([inverted])` in [hd-slide.js](file:///home/likr/work/likr/html-deck/packages/html-deck/src/components/html-deck/hd-slide.js)) to force the browser to compute them locally.

### 23. Shadow DOM Specificity & Slot Style Inheritance
- **Trap (Slotted Selector Specificity)**: Global selectors in the outer document (light DOM) targeting slotted elements (e.g., `[slot="heading"]` or `hd-slide p`) have higher specificity and priority than the component's inner Shadow DOM rules using `::slotted(*)`. This causes outer stylesheet rules to override the component's internal theme/contrast colors.
- **Rule**: Light DOM selectors in global stylesheets (like [elements.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/elements.css)) targeting slotted slot positions (e.g., `[slot="heading"]` or `hd-card p`) should use `color: inherit;` (or `inherit !important;` if necessary) instead of hardcoding slide colors. This allows component shadow DOM styles (like `.heading-area ::slotted(*)`) or layout-specific rules to style the slotted elements correctly.
- **Rule**: For headings or text elements inside container elements with themed variants (like `<hd-card variant="main">`), map their styles using explicit variant selectors in the global stylesheet (e.g., `hd-card[variant="main"] h1`) to use variant-muted colors (`var(--hd-main-text-color-muted)`), ensuring readability.

### 24. Local Development Theme Caching
- **Trap (Stylesheets Caching)**: When dynamically swapping stylesheets using `themeLink.href = window.themeUrls[theme]`, the browser aggressively caches the CSS asset. Local changes made during theme development will not be reflected without a hard page reload or manual cache clearing.
- **Rule**: In development pages (like the demo showcase in [index.html](file:///home/likr/work/likr/html-deck-demo/demo/features/index.html)), append a cache-buster query parameter (such as `+ '?t=' + Date.now()`) to dynamically assigned CSS href properties to guarantee styling updates bypass the browser cache.
