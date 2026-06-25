# html-deck Themes & Styling Reference

`html-deck` provides a set of modern theme presets and a comprehensive library of utility classes to customize slide designs.

---

## 🎨 Built-in Themes

Themes are enabled by loading the corresponding CSS stylesheet in the presentation HTML `<head>` after the main library styles:

```html
<script type="module">
  import 'html-deck';
  import 'html-deck/css';
</script>
<!-- Load a theme preset -->
<link rel="stylesheet" href="node_modules/html-deck/dist/html-deck.theme-warm.css">
```

> [!IMPORTANT]
> **Vite Environment CSS Imports**: When developing within a Vite-based project, avoid using inline `<style>` tags or HTML `<link>` tags for custom overrides. Instead, define your custom styling in a dedicated CSS file (e.g. `style.css`) and import it inside the `<script type="module">` tag **after** `html-deck/css` (e.g., `import './style.css'`). This ensures proper style precedence and load order.

### Theme Presets Details

#### 1. Default (Minimalist Clean)
- **Background**: `#ffffff` (White)
- **Text Color**: `#111827` (Dark Charcoal)
- **Main Color**: `#4f46e5` (Indigo)
- **Accent Color**: `#ea580c` (Orange)
- **Font**: Default system font-family (`system-ui`).

#### 2. Dark Slate Theme (`html-deck.theme-dark.css`)
- **Background**: `#0f172a` (Slate 900)
- **Text Color**: `#f8fafc` (Slate 50)
- **Primary Color**: `#60a5fa` (Light Blue)
- **Secondary Color**: `#c084fc` (Light Purple)
- **Font**: Default system font-family (`system-ui`).
- **Use Case**: Low-light rooms, developer presentations.

#### 3. Corporate Theme (`html-deck.theme-corporate.css`)
- **Background**: `#ffffff` (White)
- **Text Color**: `#0f172a` (Dark Slate)
- **Primary Color**: `#1e3a8a` (Trust Navy Blue)
- **Secondary Color**: `#0d9488` (Corporate Teal)
- **Font**: `Inter` (requires loading from Google Fonts).
- **Layout Overrides**: Title slide is centered with a Teal line divider and row-aligned metadata.

#### 4. Neon Cyberpunk Theme (`html-deck.theme-neon.css`)
- **Background**: `#030303` (Pitch Black)
- **Text Color**: `#f1f5f9` (Slate White)
- **Primary Color**: `#00f2fe` (Neon Cyan)
- **Secondary Color**: `#fe019a` (Neon Pink)
- **Accent Color**: `#39ff14` (Neon Green)
- **Font**: `Space Grotesk` (requires loading from Google Fonts).
- **Layout Overrides**: Centered title slide with a pink gradient line divider. Codeblocks have a cyan border glow.

#### 5. Warm Sepia Theme (`html-deck.theme-warm.css`)
- **Background**: `#fdfaf2` (Warm Ivory)
- **Text Color**: `#433422` (Deep Espresso Brown)
- **Primary Color**: `#d97706` (Amber 600)
- **Secondary Color**: `#be123c` (Rose 700)
- **Font**: `Outfit` (requires loading from Google Fonts).
- **Use Case**: Creative or casual storytelling decks.

#### 6. Serif Academic Theme (`html-deck.theme-serif.css`)
- **Background**: `#fafaf9` (Paper Warm White)
- **Text Color**: `#1c1917` (Ink Black)
- **Primary Color**: `#1c1917` (Ink Black)
- **Secondary Color**: `#44403c` (Deep Stone Brown)
- **Fonts**: `Playfair Display` for headings, `Lora` for body text (requires loading from Google Fonts).
- **Use Case**: Academic research, publishing, literature reviews.

---

## 🔤 Google Fonts Loading Guide

For themes that require custom web typography, load Google Fonts inside your HTML `<head>` before style rules. 

Here is the recommended configuration to support all built-in themes:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 🛠️ CSS Utility Classes (Prefix: `hd-`)

Instead of writing custom `style="..."` attributes on elements, apply the following classes included in `html-deck.css`:

### 1. Typography Weights & Styles
- **Weights**:
  - `.hd-text-weight-light`: `font-weight: 300 !important`
  - `.hd-text-weight-normal`: `font-weight: 400 !important`
  - `.hd-text-weight-medium`: `font-weight: 500 !important`
  - `.hd-text-weight-semibold`: `font-weight: 600 !important`
  - `.hd-text-weight-bold`: `font-weight: 700 !important`
  - `.hd-text-weight-extrabold`: `font-weight: 800 !important`
- **Italics & Line Decorations**:
  - `.hd-italic`: `font-style: italic !important`
  - `.hd-underlined`: `text-decoration: underline !important`
- **Text Transformations**:
  - `.hd-capitalized`: `text-transform: capitalize !important`
  - `.hd-lowercase`: `text-transform: lowercase !important`
  - `.hd-uppercase`: `text-transform: uppercase !important`

### 2. Absolute Typography Scales
Font sizes are explicitly set using the global sizing scale (sizes 1-6, where 1 is largest and 6 is smallest):
- `.hd-size-1`: `48px` (large display numbers/titles)
- `.hd-size-2`: `32px` (headings)
- `.hd-size-3`: `24px` (subheadings/large paragraphs)
- `.hd-size-4`: `18px` (standard body text)
- `.hd-size-5`: `14px` (captions/notes)
- `.hd-size-6`: `12px` (micro/peripheral text)

### 3. Theme Colors
Sets the foreground text color using key theme color variables:
- `.hd-accent`: Uses the primary accent color (`var(--hd-accent-color)`)
- `.hd-muted`: Uses the muted text color (`var(--hd-base-text-color-muted)`)

### 5. Layout and Spacings (Margins, Paddings, Gaps)
Apply standard spacing intervals using numeric levels `0` to `6` (mapping to 0px, 4px, 8px, 16px, 24px, 32px, and 48px):
- **Margins (`m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`)**:
  - `.hd-m-0` to `.hd-m-6`: Margin for all sides.
  - `.hd-mt-0` to `.hd-mt-6`: Margin top.
  - `.hd-mb-0` to `.hd-mb-6`: Margin bottom.
  - `.hd-mx-0` to `.hd-mx-6`: Horizontal margin.
  - `.hd-my-0` to `.hd-my-6`: Vertical margin.
- **Paddings (`p`, `pt`, `pb`, `pl`, `pr`, `px`, `py`)**:
  - `.hd-p-0` to `.hd-p-6`: Padding for all sides.
  - `.hd-pt-0` to `.hd-pt-6`: Padding top.
  - `.hd-pb-0` to `.hd-pb-6`: Padding bottom.
  - `.hd-px-0` to `.hd-px-6`: Horizontal padding.
  - `.hd-py-0` to `.hd-py-6`: Vertical padding.
- **Gaps**:
  - `.hd-gap-0` to `.hd-gap-6`: Gap between flex/grid items.

### 6. Width Utilities (Grid-based 1/12 scale)
Sets the explicit width of an element relative to its container parent:
- `.hd-width-1` to `.hd-width-12` (e.g., `.hd-width-6` fills exactly `50%` width).

### 7. Layout Alignment (Margin-based)
Controls the layout positioning and auto-margins for block level elements:
- `.hd-align-left`: Aligns block to the left (`margin-right: auto`).
- `.hd-align-center`: Centers block horizontally (`margin-left: auto; margin-right: auto`).
- `.hd-align-right`: Aligns block to the right (`margin-left: auto`).
- `.hd-align-top`: Aligns block to the top (`margin-bottom: auto`).
- `.hd-align-middle`: Vertically centers block (`margin-top: auto; margin-bottom: auto`).
- `.hd-align-bottom`: Aligns block to the bottom (`margin-top: auto`).

### 8. Text Alignments
- `.hd-text-left`: Align text content to the left.
- `.hd-text-center`: Center align text content.
- `.hd-text-right`: Align text content to the right.
- `.hd-text-justified`: Align text content as justified.

### 9. Absolute Positioning
- `.hd-absolute-bottom`: Absolutely positions an element at the bottom of the slide (`bottom: 24px; left: 0; right: 0; width: 100%`). Use this class to place footer metadata or center aligned page annotations.

### 9. Slide Layout Helper Classes
These CSS helper classes style standard slide elements:
- `.hd-text`: Applies to standard block paragraph wrappers (e.g. `<p class="hd-text">`). Sets standard spacing, line heights, and custom text colors.
- `.hd-list`: Applies to standard lists (e.g. `<ul class="hd-list">` or `<ol class="hd-list">`). Automatically styles bullets/numbering patterns across nested levels.

> [!IMPORTANT]
> **Use UI Components Instead of Custom Classes for Callouts/Cards**:
> Do not use custom classes like `.hd-callout` or `.hd-card` on raw divs. Instead, use the native custom elements: `<hd-callout>`, `<hd-card>`, and `<hd-box>`. For detailed configurations, see [components.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/components.md).
