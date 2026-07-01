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
- `no-controls` (boolean): If present, hides the navigation controls panel at the bottom of the presentation.

#### Slots
- **Default Slot**: Accepts only slide components (`<hd-slide>`). Nested structure must remain completely flat.

#### CSS Variables
- `--hd-deck-text-color`: Fallback text color for the entire deck. Defaults to `#1e293b`.
- `--hd-body-font`: Global font family for body text. Defaults to `system-ui, sans-serif`.

#### Keyboard Shortcuts
- `Home`: Go to first slide.
- `ArrowRight`, `Space`, `Enter`: Go to next slide.
- `ArrowLeft`, `Backspace`: Go to previous slide.
- `f`, `F`: Toggle fullscreen mode.
- `p`, `P`: Open the presenter view in a pop-up window.
- `s`, `S`: Toggle speech synthesis/reading aloud (only when `enable-speech` is active).
- `a`, `A`: Toggle auto-play mode (only when `enable-auto-play` is active).

#### Methods
- `first()`: Navigates to the first slide.
- `prev()`: Navigates to the previous slide.
- `next()`: Navigates to the next slide.
- `goto(index)`: Navigates to the slide at the specified 0-based index.
- `toggleSpeech()`: Toggles reading aloud slide script.
- `toggleAutoPlay()`: Toggles automated slide progression.
- `toggleFullscreen()`: Toggles browser fullscreen mode.
- `openPresenter()`: Opens the presenter view dashboard.
- `sync()`: Synchronizes the current presentation state with any connected presenter view dashboard.

---

## 🎴 Slide & Layout Components

Slides are represented by the container `<hd-slide>`. Structural layout layouts are nested inside slides using dedicated custom layout elements (`<hd-layout>`, `<hd-layout-split>`, `<hd-layout-grid>`, `<hd-layout-cover>`).

### 2. `<hd-slide>`
The unified slide container component. It handles slide transitions, visibility switching, color scheme overrides, page number tracking, and scrollability.

#### Attributes
- `active` (boolean): Indicated if this slide is active.
- `transition-style` (string): Transition style between slides. Options: `fade`, `none`.
- `page-index` (number): Dynamic 1-based page index.
- `page-total` (number): Dynamic total slide count.
- `hide-page-number` (boolean): If present, disables the page number on this slide.
- `inverted` (boolean): If present, inverts the background and text color of the slide (switches colors to inverted palette variants, useful for introducing dark slides).
- `center` (boolean): If present, vertically and horizontally centers content within the slide.
- `variant` (string): Theme variation for the slide. Options: `default` (heading main-solid, body base-soft), `base` (body base-soft, heading base-solid), `main` (body main-soft, heading main-solid), `accent` (body accent-soft, heading accent-solid).
- `heading` (string): Specific theme variation for layout heading only, overriding the variant heading theme. Options: `base`, `main`, `accent` (sets heading to y-solid).
- `surface` (string): Surface override configurations. Options: `soft` (forces heading to soft), `solid` (forces body to solid).

#### Slots
- **Default Slot**: Main content slot. Usually contains one of the layout components below.
- `notes`: Speaker notes slot. Element inside this slot (e.g. `<div slot="notes">`) is hidden on the slide and displayed in the presenter view dashboard.
- `header`: Top header annotation slot (automatically positioned at the top left of the slide viewport).
- `footer`: Bottom footer annotation slot (automatically positioned at the bottom left of the slide viewport).

#### CSS Variables
- `--hd-slide-background-color`: Custom background color override.
- `--hd-slide-text-color`: Custom text color override.

---

### 3. `<hd-layout>`
Standard slide layout component. Typically contains heading, before, body, and after slots.

#### Slots
- `heading`: Title area slot (usually contains standard `<h2>` tag).
- `before`: Content to place *before* the main slot.
- **Default Slot**: Main content area. Automatically grows (`flex-grow: 1`) to fill the vertical space.
- `after`: Content to place *after* the main slot.

---

### 4. `<hd-layout-split>`
A 2-column slide layout component.

#### Attributes
- `ratio` (string): Sizing ratio for left and right columns (e.g., `1:1`, `2:1`, `1:2`). Default: `1:1`.

#### Slots
- `heading`: Slide title area slot (usually contains standard `<h2>` tag).
- `before`: Content to place *before* the columns.
- `left`: Left-hand column slot.
- `right`: Right-hand column slot.
- `after`: Content to place *after* the columns.

---

### 5. `<hd-layout-grid>`
A grid slide layout component that automatically arranges child elements sequentially into a configured grid of columns and rows.

#### Attributes
- `cols` (number): The number of grid columns to create. Default: `1`.
- `rows` (number): The number of grid rows to create. Default: `auto` (height flows naturally).

#### Slots
- `heading`: Slide title area slot (usually contains standard `<h2>` tag).
- `before`: Content to place *before* the grid container.
- **Default Slot**: Contains the grid items. All direct child elements inside this slot will be arranged sequentially into the grid cells.
- `after`: Content to place *after* the grid container.

---

### 6. `<hd-layout-cover>`
A cover or section divider slide layout component. Centers content vertically and horizontally, and automatically hides page numbers on the parent slide.

#### Slots
- `before`: Content to place *before* the cover area.
- `title`: Large cover title slot (usually contains standard `<h1>` tag).
- `subtitle`: Subtitle description slot.
- `meta`: Meta information area slot (e.g., author, date).
- `after`: Content to place *after* the cover area.

---

## 🎨 UI & Content Components

These components help present block text and callouts within the slides.

### 7. `<hd-card>`
A card container with a boxed layout, styled with background colors and borders. Good for highlighting specific sections of content.

#### Attributes
- `variant` (string): Theme variation mapping. Options: `base`, `main` (uses primary accent colors), `accent` (uses secondary accent colors). If omitted, renders with standard base muted styles.
- `surface` (string): Surface override configuration. Options: `soft` (makes both card body and heading soft), `solid` (makes both card body and heading solid). Default (omitted): body is soft, heading is solid.

#### Slots
- `heading`: Card title header area. Automatically styled like a subheading.
- **Default Slot**: Main interior body content of the card.

---

### 8. `<hd-box>`
A boxed container similar to `<hd-card>` but configured to automatically stretch to fill 100% height of its parent column/container.

#### Attributes
- `variant` (string): Theme variation mapping. Options: `base`, `main`, `accent`. If omitted, renders with standard base muted styles.
- `surface` (string): Surface override configuration. Options: `soft` (makes both box body and heading soft), `solid` (makes both box body and heading solid). Default (omitted): body is soft, heading is solid.

#### Slots
- `heading`: Box title header area.
- **Default Slot**: Main interior body content.

---

### 9. `<hd-callout>`
Draws a highlighted text block with a left border marker to emphasize specific statements or quotes.

#### Attributes
- `variant` (string): Theme variation mapping. Options: `main`, `accent`. If omitted, renders with standard base muted styles.

#### Slots
- **Default Slot**: Main content to render within the callout box.
