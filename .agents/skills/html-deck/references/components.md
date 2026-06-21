# html-deck Components API Reference

This document provides a comprehensive API guide for all 15 Web Components included in the `html-deck` library. Use this reference when building slides, custom templates, or nesting interactive elements.

---

## 🗂️ Container Components

### 1. `<hd-deck>`
The root container of the presentation slideshow. It manages layout scaling, keyboard navigations, routing, and synchronization with the presenter dashboard.

#### Attributes
- `aspect-ratio` (string): Sets the target proportions. Default: `16:9`. Supports colon formats (`16:9`, `4:3`, `1.6`) or numeric floating points (e.g., `1.77`).
- `transition` (string): Transition style between slides. Options: `fade`, `none`. Default: `fade`.
- `page-number` (boolean string): If set to `'false'`, disables slide numbers globally. Default: `true`.
- `presenter-url` (string): The path to the presenter dashboard (e.g., `./presenter.html`). When specified, enables the presenter button and `P` shortcut key.

#### Slots
- **Default Slot**: Accepts only `<hd-slide>` and `<hd-title-slide>` elements. Nested structure must remain completely flat.

#### CSS Variables
- `--hd-deck-text-color`: Fallback text color for the entire deck. Defaults to `#1e293b`.
- `--hd-body-font`: Global font family for body text. Defaults to `system-ui, sans-serif`.

#### Keyboard Shortcuts
- `ArrowRight`, `Space`, `Enter`: Go to next slide.
- `ArrowLeft`, `Backspace`: Go to previous slide.
- `f`, `F`: Toggle fullscreen mode.
- `p`, `P`: Open the presenter view in a pop-up window.

---

### 2. `<hd-slide>`
The basic container for a single slide page.

#### Attributes
- `layout` (string): Slide layout preset. Default: `title-body`.
  - `title`: Centered alignment, typically for cover slides or chapter titles.
  - `title-body`: Standard slide containing a title area and a flexible body content area.
  - `split`: Side-by-side columns.
  - `blank`: Empty canvas with padding removed (`0px`), perfect for fullscreen images or complete custom design overlays.
- `center` (boolean): If present, centers elements vertically.
  - In `title-body` layout: Centers contents inside the body area.
  - In `split` layout: Centers contents inside both columns vertically.
  - In `blank` layout: Centers the root contents.
- `no-page-number` (boolean): If present, hides the slide number indicator on this slide.
- `invert` (boolean): Swaps background and text colors dynamically based on the current theme variables.
- `bg` (string): Set to `"primary"` or `"secondary"` to apply the theme's primary or secondary accent colors as the slide background. Text and heading colors automatically adapt to white.

#### Slots
- **`title` Slot**: Place heading components here (`slot="title"`). Hides automatically on `blank` layout.
- **`left` / `right` Slots**: Used only when `layout="split"`.
- **Default Slot**: Standard container. On `split` layout, it acts as a general fallback footer area.

#### CSS Variables
- `--hd-slide-bg`: Custom background color override.
- `--hd-slide-text-color`: Custom text color override.
- `--hd-slide-padding`: Customize slide interior margins. Default: `30px 40px`.

---

### 3. `<hd-title-slide>`
A specialized, highly-customizable cover slide component. Does not show page numbers by default.

#### Slots
- `title`: Presentation title.
- `subtitle`: Subtitle description.
- `presenter`: Presenter name/details.
- `location`: Location/Hall information.
- `date`: Event date.
- **Default Slot**: Place any fallback elements here.

#### CSS Variables
Customize layouts, text alignment, and spacings:
- `--hd-title-slide-padding`: Container interior margins. Default: `40px 50px`.
- `--hd-title-slide-justify`: Vertical alignment (`center` by default).
- `--hd-title-slide-align-items`: Horizontal alignment (`flex-start` / left-aligned by default).
- `--hd-title-slide-text-align`: Text alignment (`left` by default).
- `--hd-title-slide-title-size`: Title font size. Default: `40px`.
- `--hd-title-slide-title-color`: Title text color.
- `--hd-title-slide-subtitle-size`: Subtitle font size. Default: `20px`.
- `--hd-title-slide-subtitle-color`: Subtitle text color.
- `--hd-title-slide-divider-width`: Center line divider width. Default: `100%`.
- `--hd-title-slide-divider-height`: Divider thickness. Default: `1px`.
- `--hd-title-slide-divider-bg`: Divider line color.
- `--hd-title-slide-divider-margin`: Margin around divider. Default: `16px 0`.
- `--hd-title-slide-divider-opacity`: Line opacity. Default: `0.6`.
- `--hd-title-slide-meta-direction`: Layout flow of metadata slots (`column` by default).
- `--hd-title-slide-meta-gap`: Space between meta items. Default: `8px`.

---

### 4. `<hd-columns>`
Creates a multi-column flex container. Must be populated with `<hd-column>` components.

#### CSS Variables
- `--hd-columns-gap`: Spacing between columns. Default: `20px`.
- `--hd-columns-margin-bottom`: Lower spacing boundary. Default: `12px`.

---

### 5. `<hd-column>`
A single column inside `<hd-columns>`.

#### Attributes
- `flex` (string/number): The `flex-grow` value or ratio configuration. Default: `1`.

---

## 📝 Text & Heading Components

### 6. `<hd-heading>`
Renders text titles inside slot headers.

#### Attributes
- `level` (string): Heading tier depth. Options: `1`, `2`, `3`. Default: `1`.
  - Level `1`: Usually for slide titles. Default size: `32px`.
  - Level `2`: Sub-headings. Default size: `24px`.
  - Level `3`: Minor section headers. Default size: `18px`.

#### CSS Variables
- `--hd-heading-margin-bottom`: Heading margins. Default: `8px`.
- `--hd-heading-font`: Font family override. Defaults to `--hd-heading-font` -> `--hd-body-font`.
- `--hd-heading-font-size-${level}`: Font size override for level.
- `--hd-heading-color-${level}`: Font color override for level.
- `--hd-heading-font-weight`: Title weight. Default: `700`.
- `--hd-heading-line-height`: Heading line heights. Default: `1.2`.

---

### 7. `<hd-text>`
Standard block paragraph wrapper.

#### CSS Variables
- `--hd-text-margin-bottom`: Padding space. Default: `8px`.
- `--hd-text-font-size`: Font size override. Default: `14px`.
- `--hd-text-line-height`: Paragraph spacing. Default: `1.6`.
- `--hd-text-color-custom`: Dedicated text color override.

---

### 8. `<hd-list>`
Wraps standard `<li>` elements, automatically styling nested levels.

#### Attributes
- `ordered` (boolean): Renders a numbered list (`<ol>`) instead of a bullet list (`<ul>`).

#### nesting & indentation markers
Nested lists detect depth levels automatically and change their markers:
- **Bullet (`<ul>`)**: Level 1 (`disc`) ➔ Level 2 (`circle`) ➔ Level 3+ (`square`)
- **Ordered (`<ol>`)**: Level 1 (`decimal`) ➔ Level 2 (`lower-alpha`) ➔ Level 3+ (`lower-roman`)

#### CSS Variables
- `--hd-list-margin-bottom`: Bottom margin. Default: `12px` (set to `0` inside nested items).
- `--hd-list-padding-left`: Indentation offset. Default: `19px`.
- `--hd-list-font-size`: Font size override. Default: `14px` (Level 1) / `12px` (Nested levels).
- `--hd-list-line-height`: Bullet vertical layout. Default: `1.6`.
- `--hd-list-color`: Bullet item color.
- `--hd-list-item-margin-bottom`: Margin between list items. Default: `4px`.

---

## 🖼️ Media & Table Components

### 9. `<hd-image>`
A container for showing image layouts with built-in styling additions.

#### Attributes
- `src` (string): Absolute or relative image URL.
- `alt` (string): Alternate text definition.
- `fit` (string): Image scaling mode. Options: `cover`, `contain`. Default: `contain`.
- `width` (string): Width override. Default: `100%`.
- `height` (string): Height override. Default: `auto`.
- `caption` (string): Footer label shown under the image.
- `shadow` (boolean): Applies container box-shadow decorators.
- `rounded` (boolean): Applies border-radius rounding corner decoration (`12px`).

#### CSS Variables
- `--hd-image-margin-bottom`: Under-image margins. Default: `12px`.
- `--hd-image-caption-size`: Caption font size. Default: `9px`.
- `--hd-image-caption-color`: Caption font color. Defaults to `#94a3b8`.

---

### 10. `<hd-table>`
A wrapper component that encapsulates standard HTML `<table>` elements with slide-compatible styles (e.g. zebra-striping, row hovering, border layouts).

#### Attributes
- `scrollable` (boolean string): If present without value, caps height at `250px` and enables vertical scroll. You can also specify an exact height value (e.g., `scrollable="200px"`).

#### CSS Variables
- `--hd-table-margin-bottom`: Table margins. Default: `16px`.
- `--hd-table-font-size`: Table typography size. Default: `12px`.
- `--hd-table-bg`: Background color override.
- `--hd-table-text-color`: Text color inside cells.
- `--hd-table-header-bg`: Heading cell backgrounds. Defaults to translucent primary color.
- `--hd-table-header-text-color`: Header typography color.
- `--hd-table-border-color`: Cells divider line border. Default: `rgba(0, 0, 0, 0.1)`.
- `--hd-table-stripe-bg`: Row zebra shading tint. Defaults to `rgba(0, 0, 0, 0.02)`.
- `--hd-table-hover-bg`: Hover row shading. Defaults to `rgba(59, 130, 246, 0.03)`.
- `--hd-scrollbar-thumb`: Scrollbar color (when `scrollable` is active).

---

## 💡 Specialized Components

### 11. `<hd-callout>`
Draws highlight boxes with left border markers to attract user attention.

#### Attributes
- `type` (string): Color variations. Options: `primary`, `secondary`, `accent`, `danger`, `warning`.

#### CSS Variables
- `--hd-callout-border-width`: Highlight border thickness. Default: `3px`.
- `--hd-callout-padding-left`: Interior spacing offset. Default: `12px`.
- `--hd-callout-margin-bottom`: Callout block margins. Default: `12px`.

---

### 12. `<hd-codeblock>`
A code highlighter component built on top of Prism.js.

#### Attributes
- `language` (string): Code grammar classification. Default: `javascript`.
- `scrollable` (boolean string): Caps the container block height and enables scrollbars. Default height: `250px`. Can be set to a custom height string (e.g., `scrollable="150px"`).

#### Dynamic imports (Vite context)
To load external code dynamically without compiling HTML files manually, **modify the `.textContent` property** rather than using attributes:
```html
<hd-codeblock language="javascript" id="example-code"></hd-codeblock>
<script type="module">
  import codeText from './sample.js?raw';
  document.getElementById('example-code').textContent = codeText;
</script>
```

> [!WARNING]
> If you write HTML slide structures inside the Light DOM of `<hd-codeblock>` directly in your HTML files, **always escape the brackets** (`&lt;` and `&gt;`). Failing to do so will cause the browser to parse them as real DOM slides, crashing slide show flow metrics.

#### CSS Variables
- `--hd-codeblock-margin-bottom`: Lower margins. Default: `12px`.
- `--hd-codeblock-font-size`: Monospace text sizes. Default: `11px`.
- `--hd-codeblock-bg`: Codeblock background fill. Default: `#f8fafc`.
- `--hd-codeblock-border`: Border boundary outline. Default: `#e2e8f0`.
- `--hd-codeblock-text`: Default un-tokenized code color. Default: `#0f172a`.
- `--hd-token-comment`: Comments text color.
- `--hd-token-operator`: Symbol, punctuation and operator color.
- `--hd-token-number`: Constant, boolean and numeric values.
- `--hd-token-string`: String literals and regexes.
- `--hd-token-keyword`: Control flow statement highlights.
- `--hd-token-function`: Function declarations and call highlights.
- `--hd-token-variable`: Object key variables or properties.

---

### 13. `<hd-math>`
An equation rendering component powered by KaTeX.

#### Attributes
- `block` (boolean): If present, centers and renders the math formula as a standalone block.

#### Usage
Write LaTeX directly inside the element:
```html
<hd-math block>
  \sigma = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (x_i - \mu)^2}
</hd-math>
```

#### CSS Variables
- `--hd-math-color`: Math characters text color. Defaults to parent context color.
- `--hd-math-block-margin`: Block alignment vertical margins. Default: `12px 0`.

---

### 14. `<hd-footnote>`
Slide bottom annotation reference.

#### Attributes
- `inline` (boolean): Renders the footnote inline inside regular slide layouts (static block position) rather than absolutely positioned at the bottom left of the slide viewport.

#### CSS Variables
- `--hd-footnote-bottom` / `--hd-footnote-left`: Position coordinate overrides.
- `--hd-footnote-font-size`: Footnote size. Default: `9px`.
- `--hd-footnote-color`: Footnote text color.
- `--hd-footnote-opacity`: Footnote transparency. Default: `0.85`.
- `--hd-footnote-inline-margin-top`: Vertical space applied only in `inline` mode. Default: `8px`.

---

### 15. `<hd-notes>`
Defines presenter speech cues that sync with the presenter view.

#### Usage
Place the tag inside any `<hd-slide>`. It is set to `display: none !important;` on the slide deck itself and is only visible in the presenter dashboard view.
```html
<hd-slide layout="title-body">
  <hd-heading slot="title">Welcome</hd-heading>
  <hd-text>This slide outlines our roadmap.</hd-text>
  
  <hd-notes>
    <ul>
      <li>Remember to welcome the audience.</li>
      <li>Do not spend more than 2 minutes on this slide.</li>
    </ul>
  </hd-notes>
</hd-slide>
```
