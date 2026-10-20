# HTML-Deck Project Rules

## 1. Slide Styling Constraints
When creating or editing slides using the `html-deck` library:
- **Strict Styling Prohibition**: Do not write custom CSS, `<style>` blocks, or inline `style="..."` attributes unless explicitly requested by the user.
- **Utility and Layout Priority**: Rely entirely on native custom elements (e.g., `<hd-layout>`, `<hd-card>`) and predefined utility classes (e.g., `.hd-highlight`, `.hd-mt-3`).
- **Centering on Blank Slides**: The `center` attribute on `<hd-slide>` natively centers slotted elements vertically and horizontally. Direct child elements in the slide body-area will be centered without needing wrapping utilities.
- **Card & Box Spacing**: Do not apply padding utility classes (e.g. `.hd-p-*`) directly to `<hd-card>` or `<hd-box>` host elements as it overrides container borders. Apply padding utilities on wrapper `div` elements inside their default slots instead.
- **Preventing Image Overflow in Split Layouts**: To prevent large images from overflowing the slide canvas, narrow the image pane by specifying a custom column ratio (e.g. `<hd-layout-split ratio="2:1">`) rather than using default equal widths.

## 2. Theme Creation Constraints
When designing custom themes for `html-deck`:
- **CSS Variable Overrides Only**: All custom themes must be created in a dedicated CSS file (e.g., `theme-custom.css`) containing ONLY variable overrides under the `:root` selector.
- **Direct Selector Prohibition**: Direct styling of HTML element tags (like `hd-slide`, `h1`) or class names (like `.hd-card`) and universal `*` variable reset blocks are strictly prohibited.
- **Relative Color Syntax**: Use CSS Relative Color Syntax (e.g., `rgba(from var(--hd-theme-main-color) r g b / 0.15)` or `hsl(from var(--hd-theme-accent-color) h 90% 82%)`) and `color-mix()` to derive translucent, muted, or high-chroma highlight colors.
- **Explicit Variable Names**: Do not introduce or use abbreviated variable names like `bg` or `color` for backgrounds or text colors. Always use full, explicit names such as `background-color` and `text-color`.
  - ❌ Incorrect: `--hd-layout-heading-bg`, `--hd-card-bg`, `--hd-layout-heading-color`
  -  Correct: `--hd-layout-heading-background-color`, `--hd-card-background-color`, `--hd-layout-heading-text-color`

## 3. Evaluation Fallback (No claude CLI)
When running evaluation cycles via `skill-creator` and the `claude` CLI is unavailable:
- Do not run automated `claude -p` triggers.
- Manually generate test case output assets, `timing.json`, and `grading.json` based on the skill rules, placing them under `<workspace>/iteration-N/eval-ID/...` directories.
- Run `aggregate_benchmark.py` and `generate_review.py` to compile review pages for human inspection.
- **Evaluation Slide Sandbox Standard**: To enable immediate visual previews in the review workspace without local Vite builds, all slide outputs generated inside evaluation test environments must import the module directly from the unpkg CDN (specifically version `1.0.0-alpha.2`):
  - `<script type="module" src="https://unpkg.com/html-deck@1.0.0-alpha.2"></script>`
- **Inline Theme Styling for Evals**: All custom themes produced during evaluations must be embedded directly inside an inline `<style>` element under the `:root` selector inside the slide HTML, rather than external `.css` files. Note that `html-deck` automatically bundles and resolves its internal layout stylesheets via custom components, so you must **never** load external `html-deck.css` files.

## 4. Component Styling Overrides (Core Development)
When writing component styles for `<hd-slide>`, `<hd-card>`, `<hd-box>`, or similar elements:
- **Prefer Pure CSS Over JS**: Handle attribute-based overrides (e.g. `variant`, `surface`) in pure CSS using `:host([attribute="value"])` selectors in the Shadow DOM stylesheet rather than inline JS style updates.
- **Declaration Order & Specificity Precedence**: Since selectors with equal attribute counts (e.g., `:host([variant="main"][surface="soft"])` vs. `:host([heading="accent"][surface="soft"])`) have identical CSS specificity, declare the overriding rules (like `heading` attributes) with compound selectors below the general ones (like `variant` attributes) to ensure the cascade applies correctly.

## 5. Layout Component Spacing Constraints
When designing or modifying layout components (e.g., `<hd-layout>`, `<hd-layout-cover>`, `<hd-layout-split>`, `<hd-layout-grid>`):
- **No Host Padding**: Do not apply padding directly to the `:host` element. Direct host padding can cause slotted elements (like `before` and `after` slots) to overflow or misalign relative to the slide canvas.
- **Inner Content Wrapper**: Wrap all slot containers (including `before`, `after`, and body/main content) in an inner wrapper div (e.g., `.layout-content` or `.cover-content`) and apply layout-specific padding variables (e.g., `--hd-layout-body-padding`, `--hd-layout-cover-padding`) to that wrapper.
- **Slotted Margins**: Explicitly define margins for slotted `before` and `after` elements in the layout stylesheet using `--hd-layout-before-margin` and `--hd-layout-after-margin` to ensure layout consistency.

## 6. 3-Variant × 2-Surface Color Matrix & Composed-Tree Token Bridging

To prevent style leakage across Shadow DOM boundaries and ensure context-specific colors in layouts and containers:
- **48-Color Matrix (`:root`)**: Global theme variables in `variables.css` and `themes/*.css` define the 4-color base palette (`--hd-theme-background-color`, `--hd-theme-text-color`, `--hd-theme-main-color`, `--hd-theme-accent-color`) and the 3-variant (`base`, `main`, `accent`) × 2-surface (`soft`, `solid`) matrix (`--hd-{variant}-{surface}-{heading|body}-{background-color|text-color|text-highlight-color|text-muted-color}` and `--hd-{variant}-{surface}-border`) under `:root` without universal `*` selectors.
- **Shadow DOM `:host` Resolution & Token Bridging**: Inside component stylesheets (`<hd-slide>`, `<hd-card>`, `<hd-box>`, `<hd-callout>`, and layouts), component-scoped variables resolve on `:host` and bridge the 5 active context tokens (`--hd-background-color`, `--hd-text-color`, `--hd-text-highlight-color`, `--hd-text-muted-color`, `--hd-border-color`) to slotted Light DOM children via composed-tree inheritance.
- **Details & Specifications**: Refer to [css_style_guide.md](file:///home/likr/html-deck/.agents/skills/html-deck-developer/references/css_style_guide.md) (for core developers) and [theme_customization.md](file:///home/likr/html-deck/.agents/skills/html-deck/references/theme_customization.md) (for theme creators).

