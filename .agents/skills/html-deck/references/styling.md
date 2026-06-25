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
- **Text Color**: `#1e293b` (Dark Slate)
- **Primary Color**: `#3b82f6` (Blue)
- **Secondary Color**: `#a855f7` (Purple)
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

### 1. Typography Styles
- **Weights**:
  - `.hd-bold`: `font-weight: 700 !important`
  - `.hd-semibold`: `font-weight: 600 !important`
  - `.hd-normal`: `font-weight: 400 !important`
- **Italics & Line Decorations**:
  - `.hd-italic`: `font-style: italic !important`
  - `.hd-underline`: `text-decoration: underline !important`
  - `.hd-line-through`: `text-decoration: line-through !important`

### 2. Relative Typography Scales
Font sizes are scaled relative (`em` based) to the parent components:
- `.hd-text-xs`: `0.7em` (micro text, captions)
- `.hd-text-sm`: `0.85em` (secondary notes)
- `.hd-text-lg`: `1.15em` (highlighted paragraphs)
- `.hd-text-xl`: `1.3em` (important subheadings)
- `.hd-text-2xl`: `1.6em` (large numbers, callouts)

### 3. Theme Colors
Sets the foreground font color to the current theme variables:
- `.hd-text-primary`: Primary color
- `.hd-text-secondary`: Secondary color
- `.hd-text-accent`: Accent color
- `.hd-text-muted`: Muted color
- `.hd-text-danger`: Danger accent (Red)
- `.hd-text-warning`: Warning accent (Yellow/Amber)
- `.hd-text-success`: Success accent (Green)
- `.hd-text-info`: Info accent (Teal/Cyan)

### 4. Background Color Highlights
Wraps inline words in a pill style background badge:
- `.hd-bg-primary`: Uses the primary color background with white text.
- `.hd-bg-secondary`: Uses the secondary color background with white text.

### 5. Layout and Spacings (Margin Top)
Use these variables to add vertical breathing room between blocks:
- `.hd-mt-xs` / `.hd-mt-1`: `4px`
- `.hd-mt-sm` / `.hd-mt-2`: `8px`
- `.hd-mt-md` / `.hd-mt-3`: `16px`
- `.hd-mt-lg` / `.hd-mt-4`: `24px`
- `.hd-mt-xl` / `.hd-mt-5`: `32px`
- `.hd-mt-2xl` / `.hd-mt-6`: `48px`

### 6. Width Limiters & Centering
- `.hd-max-w-sm`: Limits element max-width to `400px`.
- `.hd-max-w-md`: Limits element max-width to `600px`.
- `.hd-max-w-lg`: Limits element max-width to `800px`.
- `.hd-w-full`: Fills standard horizontal margins (`100%`).
- `.hd-mx-auto`: Centers the block horizontally (`margin-left: auto; margin-right: auto; display: block;`).

### 7. Alignments
- `.hd-text-left`: Align text to the left.
- `.hd-text-center`: Center align text.
- `.hd-text-right`: Align text to the right.

### 8. Absolute Positioning
- `.hd-absolute-bottom`: Absolutely positions an element at the bottom of the slide (`bottom: 24px; left: 0; right: 0; width: 100%`). Use this class to place footer metadata or center aligned page annotations.

### 9. Slide Layout Helper Classes
These CSS helper classes style standard slide elements:
- `.hd-text`: Applies to standard block paragraph wrappers (e.g. `<p class="hd-text">`). Sets standard spacing, line heights, and custom text colors.
- `.hd-list`: Applies to standard lists (e.g. `<ul class="hd-list">` or `<ol class="hd-list">`). Automatically styles bullets/numbering patterns across nested levels.

> [!IMPORTANT]
> **Use UI Components Instead of Custom Classes for Callouts/Cards**:
> Do not use custom classes like `.hd-callout` or `.hd-card` on raw divs. Instead, use the native custom elements: `<hd-callout>`, `<hd-card>`, and `<hd-box>`. For detailed configurations, see [components.md](file:///home/likr/work/likr/html-deck/.agents/skills/html-deck/references/components.md).
