# html-deck Components API Reference

This document provides a comprehensive API guide for all core Web Components included in the `html-deck` library. Use this reference when building slides, custom templates, or nesting layouts.

---

## 🗂️ Container Components

### 1. `<hd-deck>`
The root container of the presentation slideshow. It manages layout scaling, keyboard navigations, routing, and synchronization with the presenter dashboard.

#### Attributes
- `aspect-ratio` (string): Sets the target proportions. Default: `16:9`. Supports colon formats (`16:9`, `4:3`, `1.6`) or numeric floating points (e.g., `1.77`).
- `transition` (string): Transition style between slides. Options: `fade`, `none`. Default: `fade`.
- `hide-page-number` (boolean): If present, disables slide numbers globally.
- `presenter-url` (string): The path to the presenter dashboard (e.g., `./presenter.html`). When specified, enables the presenter button and `P` shortcut key.

#### Slots
- **Default Slot**: Accepts only slide components (`<hd-slide-standard>`, `<hd-slide-split>`, `<hd-slide-cover>`, `<hd-slide-blank>`). Nested structure must remain completely flat.

#### CSS Variables
- `--hd-deck-text-color`: Fallback text color for the entire deck. Defaults to `#1e293b`.
- `--hd-body-font`: Global font family for body text. Defaults to `system-ui, sans-serif`.

#### Keyboard Shortcuts
- `ArrowRight`, `Space`, `Enter`: Go to next slide.
- `ArrowLeft`, `Backspace`: Go to previous slide.
- `f`, `F`: Toggle fullscreen mode.
- `p`, `P`: Open the presenter view in a pop-up window.

---

## 🎴 Slide Preset Components

All slide presets inherit basic slide behaviors, including transitions, visibility switching, color scheme overrides, page number tracking, and scrollable container height constraints.

### 2. `<hd-slide-standard>`
A standard 1-column layout slide component.

#### Slots
- `header`: Top header area slot.
- `title`: Slide title area slot (usually contains standard `<h2>` tag).
- `footer`: Bottom footer area slot.
- **Default Slot**: Main content area. Automatically grows (`flex-grow: 1`) to fill the vertical space between title and footer.

#### CSS Variables
- `--hd-slide-bg`: Custom background color override.
- `--hd-slide-text-color`: Custom text color override.
- `--hd-slide-padding`: Customize slide interior margins. Default: `30px 40px`.

---

### 3. `<hd-slide-split>`
A 2-column layout slide component.

#### Attributes
- `ratio` (string): Sizing ratio for left and right columns (e.g., `1:1`, `2:1`, `1:2`). Default: `1:1`.

#### Slots
- `title`: Slide title area slot.
- `left`: Left-hand column slot.
- `right`: Right-hand column slot.

---

### 4. `<hd-slide-cover>`
A cover or section divider slide component. Centers content vertically and horizontally, and hides page numbers by default.

#### Slots
- `title`: Large cover title slot (usually contains standard `<h1>` tag).
- `subtitle`: Subtitle description slot.
- `meta`: Meta information area slot (e.g., author, date).

---

### 5. `<hd-slide-blank>`
An empty layout canvas slide component with margins and paddings removed (`0px`). Perfect for fullscreen background images or custom layouts.

#### Slots
- **Default Slot**: Unstyled blank canvas slot.

---

## 📐 Layout Primitive Components

### 6. `<hd-grid>`
A 2-dimensional grid layout primitive component.

#### Attributes
- `cols` (number): Number of equal-width columns. Default: `1`.
- `gap` (string): Grid gap size. Supports T-shirt sizes (`xs`, `sm`, `md`, `lg`, `xl`) or explicit pixel values (e.g. `20px`). Default: `md`.

---

### 7. `<hd-flex>`
A 1-dimensional flexbox layout primitive component.

#### Attributes
- `direction` (string): Flex layout direction. Options: `row`, `column`. Default: `row`.
- `gap` (string): Flex gap size. Supports T-shirt sizes (`xs`, `sm`, `md`, `lg`, `xl`) or explicit pixel values (e.g. `20px`). Default: `md`.
- `align` (string): Align items alignment. Options: `stretch`, `center`, `flex-start`, `flex-end`. Default: `stretch`.
- `justify` (string): Justify content alignment. Options: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`. Default: `flex-start`.

---

## 📝 Text & Annotation Components

### 8. `<hd-text>`
Standard block paragraph wrapper.

#### CSS Variables
- `--hd-text-margin-bottom`: Bottom margin space. Default: `8px`.
- `--hd-text-font-size`: Font size override. Default: `14px`.
- `--hd-text-line-height`: Paragraph spacing. Default: `1.6`.
- `--hd-text-color-custom`: Dedicated text color override.

---

### 9. `<hd-list>`
Wraps standard `<li>` elements, automatically styling nested levels.

#### Attributes
- `ordered` (boolean): Renders a numbered list (`<ol>`) instead of a bullet list (`<ul>`).

---

### 10. `<hd-callout>`
Draws highlight boxes with left border markers to attract user attention.

#### Attributes
- `type` (string): Color variations. Options: `primary`, `secondary`, `accent`, `danger`, `warning`.

---

### 11. `<hd-math>`
An equation rendering component powered by KaTeX.

#### Attributes
- `block` (boolean): If present, centers and renders the math formula as a standalone block.

---

### 12. `<hd-footnote>`
Slide bottom annotation reference.

#### Attributes
- `inline` (boolean): Renders the footnote inline inside regular slide layouts (static block position) rather than absolutely positioned at the bottom left of the slide viewport.

---

### 13. `<hd-notes>`
Defines presenter speech cues that sync with the presenter view.

#### Usage
Place the tag inside any slide component. It is set to `display: none !important;` on the slide deck itself and is only visible in the presenter dashboard view.
