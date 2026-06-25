# HTML-Deck Project Rules

## 1. Slide Styling Constraints
When creating or editing slides using the `html-deck` library:
- **Strict Styling Prohibition**: Do not write custom CSS, `<style>` blocks, or inline `style="..."` attributes unless explicitly requested by the user.
- **Utility and Layout Priority**: Rely entirely on native custom elements (e.g., `<hd-layout>`, `<hd-card>`) and predefined utility classes (e.g., `.hd-accent`, `.hd-mt-3`).

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

