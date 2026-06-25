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

### 1. Dedicated CSS File for Theme Overrides
Create a dedicated CSS file (e.g., `theme-custom.css`) to define the custom theme. Do not write CSS variable overrides directly in `<style>` blocks or general utility sheets.
Apply the theme in your application entry point (JS/TS or HTML script) by importing it **after** the default `html-deck` CSS:
```javascript
import 'html-deck/css';
import './theme-custom.css'; // Always import your custom theme after html-deck/css
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

### 4. Consult the Variables Reference
Whenever you need to override colors, font sizes, padding, margins, or individual component properties, **you MUST read the [css_variables.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck-theme-creator/references/css_variables.md) reference file** using the `view_file` tool to locate the exact variable name and its default behavior.


---

## ⚙️ Key Customizable CSS Variables

For a complete list of variables, refer to the library's [variables.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/variables.css). The most common variables to override include:

### 1. Palette Colors
- `--hd-base-color`: Background color for standard container/slide blocks.
- `--hd-base-text-color`: Foreground text color.
- `--hd-main-color`: Primary branding color (used for links, primary buttons, highlights).
- `--hd-main-text-color`: Foreground text color on top of primary branding color elements.
- `--hd-accent-color`: Secondary accent branding color.
- `--hd-accent-text-color`: Foreground text color on top of accent elements.

### 2. Muted/Inverted Variants
- `--hd-base-color-muted` & `--hd-base-text-color-muted`
- `--hd-base-color-inverted` & `--hd-base-text-color-inverted`

### 3. Slide Layout Margins & Gaps
- `--hd-slide-margin-top` / `--hd-slide-margin-right` / `--hd-slide-margin-bottom` / `--hd-slide-margin-left`
- `--hd-gap-1` to `--hd-gap-6` (Spacing scale)

### 4. Typography Sizes
- `--hd-font-family`: Body text font-family.
- `--hd-font-family-serif`: Serif text font-family.
- `--hd-size-1` (largest heading) to `--hd-size-6` (smallest footnote).

### 5. Component Styling
- `--hd-card-border-radius` / `--hd-card-background-color` / `--hd-card-border-color`
- `--hd-box-border-radius` / `--hd-box-background-color` / `--hd-box-border-color`
- `--hd-callout-border-radius` / `--hd-callout-background-color` / `--hd-callout-border-color`
- `--hd-codeblock-border-radius` / `--hd-codeblock-border-color`
