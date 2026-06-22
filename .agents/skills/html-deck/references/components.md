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
- **Default Slot**: Accepts only slide components (`<hd-slide>`). Nested structure must remain completely flat.

#### CSS Variables
- `--hd-deck-text-color`: Fallback text color for the entire deck. Defaults to `#1e293b`.
- `--hd-body-font`: Global font family for body text. Defaults to `system-ui, sans-serif`.

#### Keyboard Shortcuts
- `ArrowRight`, `Space`, `Enter`: Go to next slide.
- `ArrowLeft`, `Backspace`: Go to previous slide.
- `f`, `F`: Toggle fullscreen mode.
- `p`, `P`: Open the presenter view in a pop-up window.

---

## 🎴 Slide & Layout Components

Slides are represented by the thin container `<hd-slide>`. Structural layout layouts are nested inside slides using dedicated custom layout elements (`<hd-layout-standard>`, `<hd-layout-split>`, `<hd-layout-cover>`).

### 2. `<hd-slide>`
The unified slide container component. It handles slide transitions, visibility switching, color scheme overrides, page number tracking, and scrollability.

#### Attributes
- `active` (boolean): Indicated if this slide is active.
- `transition-style` (string): Transition style between slides. Options: `fade`, `none`.
- `page-index` (number): Dynamic 1-based page index.
- `page-total` (number): Dynamic total slide count.
- `hide-page-number` (boolean): If present, disables the page number on this slide.
- `scrollable` (boolean): If present, enables vertical scrolling.
- `height` (string): Max height for scrollable content (e.g. `100%`, `350px`).
- `invert` (boolean): Inverts slide background and text colors.
- `bg` (string): Sets background preset color. Options: `primary`, `secondary`.

#### Slots
- **Default Slot**: Main content slot. Standalone slide (with no layout component) acts as a blank slide (padding: `0`). Usually contains one of the layout components below.
- `notes`: Speaker notes slot. Element inside this slot (e.g. `<div slot="notes">`) is hidden on the slide and displayed in the presenter view dashboard.
- `footnote`: Footnote annotation slot. Element inside this slot (e.g. `<div slot="footnote">`) is automatically positioned at the bottom left of the slide viewport.

#### CSS Variables
- `--hd-slide-bg`: Custom background color override.
- `--hd-slide-text-color`: Custom text color override.
- `--hd-slide-padding`: Customize interior margins of layout components. Default: `30px 40px`.

---

### 3. `<hd-layout-standard>`
Standard slide layout component.

#### Slots
- `header`: Top header area slot.
- `title`: Slide title area slot (usually contains standard `<h2>` tag).
- `footer`: Bottom footer area slot.
- **Default Slot**: Main content area. Automatically grows (`flex-grow: 1`) to fill the vertical space between title and footer.

---

### 4. `<hd-layout-split>`
A 2-column slide layout component.

#### Attributes
- `ratio` (string): Sizing ratio for left and right columns (e.g., `1:1`, `2:1`, `1:2`). Default: `1:1`.

#### Slots
- `title`: Slide title area slot.
- `left`: Left-hand column slot.
- `right`: Right-hand column slot.

---

### 5. `<hd-layout-cover>`
A cover or section divider slide layout component. Centers content vertically and horizontally, and automatically hides page numbers on the parent slide.

#### Slots
- `title`: Large cover title slot (usually contains standard `<h1>` tag).
- `subtitle`: Subtitle description slot.
- `meta`: Meta information area slot (e.g., author, date).

---

## 📐 Math Component

### 6. `<hd-math>`
An equation rendering component powered by KaTeX.

#### Attributes
- `block` (boolean): If present, centers and renders the math formula as a standalone block.
