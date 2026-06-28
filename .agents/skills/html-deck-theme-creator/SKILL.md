---
name: html-deck-theme-creator
description: How to create and customize themes for html-deck presentations. The custom theme MUST be created only by overriding CSS variables under the :root selector in a dedicated CSS file (e.g., theme-custom.css). Direct element or class targeting is strictly prohibited unless explicitly requested. Make sure to use this skill whenever the user mentions creating, modifying, or customizing a slide theme or changing CSS variables.
---

# html-deck Theme Creator Skill

This skill explains how to design and apply custom themes for the `html-deck` library. Theme customization is restricted to overriding CSS variables.

---

## 📚 Detailed References Index
Always read the relevant sub-document using the `view_file` tool to inspect customizable variable sets:
- 🎨 **CSS Variables Reference**: Detailed specifications and default values of all customizable variables (colors, typography, margins, gaps, components).
  - Link: [css_variables.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck-theme-creator/references/css_variables.md)

---

## 🎨 Theme Customization Core Principles

### 1. Dedicated CSS File for Theme Overrides & Bundle Cascade Order
Create a dedicated CSS file (e.g., `style.css`) to define the custom theme. Do not write CSS variable overrides directly in `<style>` blocks.

To guarantee correct cascade ordering during production builds (preventing the core library variables from overriding your custom rules), **always import the library CSS at the top of your custom theme file using `@import`** instead of importing them separately in the script block:

- **Correct Theme Stylesheet (`style.css`)**:
  ```css
  @import "html-deck/css";

  :root {
    --hd-base-soft-background-color: #fffcf5;
    ...
  }
  ```

- **Correct Presentation Entry Point (`index.html`)**:
  ```html
  <script type="module">
    import 'html-deck';
    import './style.css'; // Only import the stylesheet that imports the core styles
  </script>
  ```


### 2. Variable Overrides ONLY
Theme CSS stylesheets **MUST** only contain rules under the `:root` selector. You are **strictly prohibited** from targeting HTML element tags (like `hd-slide`, `h1`, `p`) or class names (like `.hd-card`, `.hd-callout`) directly to change their visual properties.
- ❌ **Incorrect**:
  ```css
  .hd-card {
    background-color: #ff0000;
  }
  ```
-  **Correct**:
  ```css
  :root {
    --hd-card-background-color: #ff0000;
  }
  ```

### 3. Use CSS Relative Color Syntax
When defining translucent borders, shadows, or secondary tones derived from primary theme colors, do not write raw `rgba(...)` or hex literals. Instead, use the **CSS Relative Color Syntax** to dynamically derive them:
-  **Example**:
  ```css
  :root {
    --hd-main-color: #3b82f6;
    /* Derive a muted main color with 15% opacity */
    --hd-main-color-muted: rgba(from var(--hd-main-color) r g b / 0.15);
  }
  ```

### 4. The 4-Color Principle (4色の原則)
When designing or modifying a theme, define exactly 4 base variables under the `:root` selector representing the core color palette:
1. **Background Color** (e.g. `--custom-theme-background-color`)
2. **Text Color** (e.g. `--custom-theme-text-color`)
3. **Main Color** (e.g. `--custom-theme-main-color`)
4. **Accent Color** (e.g. `--custom-theme-accent-color`)

ALL other colors in the 48-color matrix (including muted states, highlights, secondary background shades, and dark/inverted variants) **MUST** be derived from these 4 base colors using CSS Relative Color Syntax (`rgba(from var(...) r g b / opacity)`) or color mixing (`color-mix(in srgb, ...)`). Do not hardcode raw hex, rgb, or hsl values for matrix elements. This ensures visual harmony and guarantees that changing the 4 base variables will cleanly propagate through the entire presentation theme.

### 5. Consult the Variables Reference
Whenever you need to override colors, font sizes, padding, margins, or individual component properties, **you MUST read the [css_variables.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck-theme-creator/references/css_variables.md) reference file** using the `view_file` tool to locate the exact variable name and its default behavior.


---

## ⚙️ Key Customizable CSS Variables

For a complete list of variables, refer to the library's [variables.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/variables.css). The most common variables to override include:

### 1. 48-Color Matrix Variables
Colors are organized by theme (`base`, `main`, `accent`), surface (`soft`, `solid`), and element type (`background-color`, `text-color`, `text-highlight-color`, `text-muted-color`).
- **Normal Layouts**: `--hd-{theme}-{surface}-{element}` (e.g. `--hd-base-soft-background-color`, `--hd-main-solid-background-color`)
- **Inverted Layouts**: `--hd-{theme}-{surface}-{element}-inverted` (e.g. `--hd-base-soft-background-color-inverted`, `--hd-main-solid-background-color-inverted`)

No abbreviated names (like `bg` or `color`) should be introduced. Use `background-color` and `text-color` explicitly.

### 2. Slide Layout Margins & Gaps
- `--hd-slide-margin-top` / `--hd-slide-margin-right` / `--hd-slide-margin-bottom` / `--hd-slide-margin-left`
- `--hd-gap-1` to `--hd-gap-6` (Spacing scale)

### 4. Typography Sizes
- `--hd-font-family`: Body text font-family.
- `--hd-font-family-serif`: Serif text font-family.
- `--hd-size-1` (largest heading) to `--hd-size-6` (smallest footnote).

### 5. Component Styling
- `--hd-card-border-radius` / `--hd-card-padding` / `--hd-card-border-width` / `--hd-card-border-style` / `--hd-card-box-shadow`
- `--hd-box-border-radius` / `--hd-box-padding` / `--hd-box-border-width` / `--hd-box-border-style` / `--hd-box-box-shadow`
- `--hd-callout-border-radius` / `--hd-callout-padding` / `--hd-callout-border-width` / `--hd-callout-border-style` / `--hd-callout-box-shadow`
- `--hd-codeblock-border-radius` / `--hd-codeblock-border-width` / `--hd-codeblock-border-style` / `--hd-codeblock-border-color` / `--hd-codeblock-background-color` / `--hd-codeblock-box-shadow` (for `pre` code block elements)
