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
  - Link: [css_variables.md](file:///home/likr/src/likr/html-deck/.agents/skills/html-deck-theme-creator/references/css_variables.md)

---

## 🎨 Theme Customization Core Principles

### 1. Dedicated CSS File for Theme Overrides
Create a dedicated CSS file (e.g., `style.css`) to define the custom theme. Do not write CSS variable overrides directly in `<style>` blocks.

The core styling is automatically injected by `html-deck` at runtime. Therefore, you **MUST NOT** import `html-deck/css` (using `@import` or similar) inside your custom theme file, as doing so will cause compilation/resolution errors in build tools like Vite and PostCSS. Simply define your CSS variable overrides under the `:root` selector and import the stylesheet in your script block.

- **Correct Theme Stylesheet (`style.css`)**:
  ```css
  :root {
    --hd-base-soft-background-color: #fffcf5;
    ...
  }
  ```

- **Correct Presentation Entry Point (`index.html`)**:
  ```html
  <script type="module">
    import 'html-deck';
    import './style.css';
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
When designing or modifying a theme, it is highly recommended to define exactly 4 base variables under the `:root` selector representing the core color palette:
1. **Background Color** (e.g. `--custom-theme-background-color`)
2. **Text Color** (e.g. `--custom-theme-text-color`)
3. **Main Color** (e.g. `--custom-theme-main-color`)
4. **Accent Color** (e.g. `--custom-theme-accent-color`)

Except for basic neutral constants (like `#ffffff` or `#000000`), you should highly avoid hardcoding raw hex, rgb, or hsl values for the 48-color matrix (including muted states, highlights, secondary backgrounds, and inverted variants). Instead, **strongly prefer deriving all intermediate matrix colors from the 4 base variables** using CSS Relative Color Syntax (`rgba(from var(...) r g b / opacity)`) or color mixing (`color-mix(in srgb, ...)`). This ensures visual harmony and guarantees that changing the 4 base variables cleanly propagates through the entire presentation theme.

### 5. Prevent Header/Footer Overlaps (ヘッダー/フッターの重複防止)
To prevent the absolute-positioned `header`/`footer` elements from overlapping with the slide's main `heading` and content areas, do not hardcode static margins. You must ensure the padding is mathematically larger than the space occupied by the peripheral text, plus a safety margin:
- **Heading Top Padding**: Enforce that the top padding of the heading area (`--hd-layout-heading-padding` top value) satisfies:
  $$\text{Heading Top Padding} \ge \text{Peripheral Offset} + (\text{Peripheral Font Size} \times \text{Peripheral Line Height}) + \text{Safety Margin (e.g. Gap-1 or Gap-2)}$$
- **Body Bottom Padding**: Enforce that the bottom padding of the body area (`--hd-layout-body-padding` bottom value) satisfies:
  $$\text{Body Bottom Padding} \ge \text{Peripheral Offset} + (\text{Peripheral Font Size} \times \text{Peripheral Line Height}) + \text{Safety Margin (e.g. Gap-1 or Gap-2)}$$
- **Maintain Symmetry**: Symmetrical spacing improves design quality. Ensure that the heading top padding and the body bottom padding are configured to be symmetrical where possible, keeping peripheral offsets identical via the shared `--hd-peripheral-offset` variable.

### 6. Color Contrast and Readability Assurance (カラーコントラストと可読性の確保)
To prevent unreadable presentations where text colors blend into the background, you must respect the following standards:
- **WCAG AA Compliance**: Ensure a contrast ratio of at least **4.5:1** for standard readable text, and at least **3:1** for large heading text (typically above 24px, or bold above 18.66px) against the background.
- **Ensure Sufficient Lightness/Darkness Difference**: For dark themes, keep background values extremely dark and readable texts high-luminance. For light themes, keep text values low-luminance.
- **Opacity Threshold**: When using relative color syntax to derive text colors (e.g. `--hd-*-text-color`), avoid excessive transparency. Maintain the opacity/alpha channel at **0.85 or higher** for readable body or title elements to prevent text from blending with the background color.

### 7. Content-Density-Aware Spacing & Typography (コンテンツ密度に応じた余白とタイポグラフィの設計)
Before designing a theme, **always inspect or ask the user for content samples and estimated text volume per page**. Align the spacing and sizing variables with the expected text density:
- **High-Density (Compact) Slide Guidelines**: If slides contain heavy content (4+ bullet points, large paragraphs, or multiple boxes/cards), you must use a scaled-down compact sizing template to prevent content from overflowing the slide canvas.
  - **Compact Scaling Template**:
    ```css
    :root {
      /* Scaled down typography (Standard: 64px / 40px / 24px) */
      --hd-size-1: 44px; /* Title */
      --hd-size-2: 30px; /* Heading */
      --hd-size-3: 18px; /* Body text */
      --hd-size-4: 15px; /* Component/Card text */
      
      /* Scaled down spacing gaps (Standard: 24px / 32px / 48px) */
      --hd-gap-2: 12px;
      --hd-gap-3: 16px;
      --hd-gap-4: 20px;
      --hd-gap-5: 24px;
      --hd-gap-6: 32px;
      
      /* Reduced slide margin offsets */
      --hd-slide-margin-top: var(--hd-gap-4);
      --hd-slide-margin-bottom: var(--hd-gap-4);
      --hd-slide-margin-left: var(--hd-gap-5);
      --hd-slide-margin-right: var(--hd-gap-5);
    }
    ```
- **Low-Density (Impact) Slide Guidelines**: If slides are visually driven with minimal text, leverage large typography scales (e.g. `--hd-size-1: 64px`, `--hd-size-2: 40px`) and spacious margins to maximize visual impact.

### 8. Consult the Variables Reference
Whenever you need to override colors, font sizes, padding, margins, or individual component properties, **you MUST read the [css_variables.md](file:///home/likr/src/likr/html-deck/.agents/skills/html-deck-theme-creator/references/css_variables.md) reference file** using the `view_file` tool to locate the exact variable name and its default behavior.


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
