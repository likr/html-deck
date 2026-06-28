# HTML-Deck Project Rules

## 1. Slide Styling Constraints
When creating or editing slides using the `html-deck` library:
- **Strict Styling Prohibition**: Do not write custom CSS, `<style>` blocks, or inline `style="..."` attributes unless explicitly requested by the user.
- **Utility and Layout Priority**: Rely entirely on native custom elements (e.g., `<hd-layout>`, `<hd-card>`) and predefined utility classes (e.g., `.hd-accent`, `.hd-mt-3`).
- **Centering on Blank Slides**: The `center` attribute on `<hd-slide>` natively centers slotted elements vertically and horizontally. Direct child elements in the slide body-area will be centered without needing wrapping utilities.
- **Card & Box Spacing**: Do not apply padding utility classes (e.g. `.hd-p-*`) directly to `<hd-card>` or `<hd-box>` host elements as it overrides container borders. Apply padding utilities on wrapper `div` elements inside their default slots instead.
- **Preventing Image Overflow in Split Layouts**: To prevent large images from overflowing the slide canvas, narrow the image pane by specifying a custom column ratio (e.g. `<hd-layout-split ratio="2:1">`) rather than using default equal widths.

## 2. Theme Creation Constraints
When designing custom themes for `html-deck`:
- **CSS Variable Overrides Only**: All custom themes must be created in a dedicated CSS file (e.g., `theme-custom.css`) containing ONLY variable overrides under the `:root` selector.
- **Direct Selector Prohibition**: Direct styling of HTML element tags (like `hd-slide`, `h1`) or class names (like `.hd-card`) is strictly prohibited.
- **Relative Color Syntax**: Use CSS Relative Color Syntax (e.g., `rgba(from var(--hd-main-color) r g b / 0.15)`) to derive translucent or muted colors.
- **Explicit Variable Names**: Do not introduce or use abbreviated variable names like `bg` or `color` for backgrounds or text colors. Always use full, explicit names such as `background-color` and `text-color`.
  - ❌ Incorrect: `--hd-layout-heading-bg`, `--hd-card-bg`, `--hd-layout-heading-color`
  -  Correct: `--hd-layout-heading-background-color`, `--hd-card-background-color`, `--hd-layout-heading-text-color`

## 3. Evaluation Fallback (No claude CLI)
When running evaluation cycles via `skill-creator` and the `claude` CLI is unavailable:
- Do not run automated `claude -p` triggers.
- Manually generate test case output assets, `timing.json`, and `grading.json` based on the skill rules, placing them under `<workspace>/iteration-N/eval-ID/...` directories.
- Run `aggregate_benchmark.py` and `generate_review.py --static` to compile review pages for human inspection.

## 4. Component Styling Overrides (Core Development)
When writing component styles for `<hd-slide>`, `<hd-card>`, `<hd-box>`, or similar elements:
- **Prefer Pure CSS Over JS**: Handle attribute-based overrides (e.g. `variant`, `surface`) in pure CSS using `:host([attribute="value"])` selectors in the Shadow DOM stylesheet rather than inline JS style updates.
- **Declaration Order Precedence**: Since selectors with equal attribute counts (e.g., `:host([variant="main"][surface="soft"])` vs. `:host([heading="accent"][surface="soft"])`) have identical CSS specificity, declare the overriding rules (like `heading` attributes) below the general ones (like `variant` attributes) to ensure the cascade applies correctly.

## 5. Layout Component Spacing Constraints
When designing or modifying layout components (e.g., `<hd-layout>`, `<hd-layout-cover>`, `<hd-layout-split>`, `<hd-layout-grid>`):
- **No Host Padding**: Do not apply padding directly to the `:host` element. Direct host padding can cause slotted elements (like `before` and `after` slots) to overflow or misalign relative to the slide canvas.
- **Inner Content Wrapper**: Wrap all slot containers (including `before`, `after`, and body/main content) in an inner wrapper div (e.g., `.layout-content` or `.cover-content`) and apply layout-specific padding variables (e.g., `--hd-layout-body-padding`, `--hd-layout-cover-padding`) to that wrapper.
- **Slotted Margins**: Explicitly define margins for slotted `before` and `after` elements in the layout stylesheet using `--hd-layout-before-margin` and `--hd-layout-after-margin` to ensure layout consistency.

## 6. CSS Variable Propagation via Intermediate State Variables

When styling layouts or container contexts with distinct background/foreground areas (like layout heading areas vs layout bodies):
- **Intermediate State Variables**: We use two sets of intermediate state variables: `--hd-heading-*` (for headings/header areas) and `--hd-body-*` (for bodies).
- **Universal Selector Definition**: In `variables.css` and themes, we define default mappings globally on the `*` selector:
  ```css
  * {
    --hd-heading-background-color: var(--hd-solid-background-color);
    --hd-heading-text-color: var(--hd-solid-text-color);
    --hd-heading-text-highlight-color: var(--hd-solid-text-highlight-color);
    --hd-heading-text-muted-color: var(--hd-solid-text-muted-color);
    --hd-body-background-color: var(--hd-soft-background-color);
    --hd-body-text-color: var(--hd-soft-text-color);
    --hd-body-text-highlight-color: var(--hd-soft-text-highlight-color);
    --hd-body-text-muted-color: var(--hd-soft-text-muted-color);
  }
  ```
- **Component Local Mapping in Shadow DOM**:
  - In `hd-slide.js`, the standard variables on the slide `:host` map to the body variables:
    ```css
    :host {
      --hd-background-color: var(--hd-body-background-color);
      --hd-text-color: var(--hd-body-text-color);
      --hd-text-highlight-color: var(--hd-body-text-highlight-color);
      --hd-text-muted-color: var(--hd-body-text-muted-color);
    }
    ```
  - In layout components (`hd-layout.js` etc.), the heading wrapper class `.heading-area` maps them to the heading variables:
    ```css
    .heading-area {
      --hd-background-color: var(--hd-heading-background-color);
      --hd-text-color: var(--hd-heading-text-color);
      --hd-text-highlight-color: var(--hd-heading-text-highlight-color);
      --hd-text-muted-color: var(--hd-heading-text-muted-color);
      
      background: var(--hd-background-color);
      color: var(--hd-text-color);
    }
    .heading-divider {
      background: var(--hd-border-color);
    }
    .heading-area ::slotted(*) {
      color: var(--hd-heading-text-color);
    }
    ```
- **Container Surfaces**: Containers (like `<hd-card>`, `<hd-box>`, `<hd-callout>`) override the `--hd-heading-*` and `--hd-body-*` variables inside `variables.css` depending on their surface attribute (`soft` vs `solid`). The standard variables (`--hd-background-color` etc.) will dynamically resolve to these overridden variables for their entire subtree, preventing any leakage.
- **Unified Border Variables**:
  - We define two border state variables globally on the `*` selector: `--hd-border-color-default` (defaults to `var(--hd-heading-background-color)`) and `--hd-border-color-surfaced` (defaults to `var(--hd-heading-text-color)`).
  - In default component `:host` styling, we map `--hd-border-color: var(--hd-border-color-default);`.
  - When `surface` is `soft` or `solid` on slides or container components, we override `--hd-border-color: var(--hd-border-color-surfaced);` in their component stylesheets.
- **Theme Border Customization**:
  - Themes can customize default and surfaced border behaviors globally by overriding `--hd-border-color-default` and `--hd-border-color-surfaced` under the `*` selector.
  - To keep color settings contextual, themes should derive these border colors from active contextual variables (like `--hd-body-text-color`) using relative color syntax rather than hardcoding static color values.
    - Example: `--hd-border-color-default: rgba(from var(--hd-body-text-color) r g b / 0.15);`
    - Example: `--hd-border-color-surfaced: rgba(from var(--hd-body-text-color) r g b / 0.3);`

