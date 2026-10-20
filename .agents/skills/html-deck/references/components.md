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
- `presenter-channel` (string): The `BroadcastChannel` channel name used to sync with the presenter dashboard. Default: `hd-deck-channel`.
- `no-controls` (boolean): If present, hides the navigation controls panel at the bottom of the presentation.
- `enable-speech` (boolean): If present, displays the SpeechSynthesis read-aloud button (`🔊`) and enables the `S` shortcut key.
- `enable-auto-play` (boolean): If present, displays the Auto-Play button (`⏯`) and enables the `A` shortcut key.
- `auto-play-interval` (number): Delay in seconds before advancing to the next slide during Auto-Play when no `slot="script"` is defined (default: `5`).

#### Slots
- **Default Slot**: Accepts only slide components (`<hd-slide>`). Nested structure must remain completely flat.

#### CSS Variables
- `--hd-deck-background-color`: Background color of the outer viewport surrounding the slide canvas.
- `--hd-deck-text-color`: Fallback text color for the entire deck. Defaults to `#1e293b`.
- `--hd-deck-font-family`: Font family for deck UI controls. Defaults to `var(--hd-body-font)`.
- `--hd-deck-progress-color`: Progress bar accent color.
- `--hd-deck-button-text-color`: Active button text color.

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
- `active` (boolean): Indicates if this slide is active.
- `transition-style` (string): Transition style between slides. Options: `fade`, `none`.
- `page-index` (number): Dynamic 1-based page index.
- `page-total` (number): Dynamic total slide count.
- `hide-page-number` (boolean): If present, disables the page number on this slide.
- `center` (boolean): If present, vertically and horizontally centers content within the slide.
- `variant` (string): Theme variation for the slide. Options: `base`, `main`, `accent` (default: `base`).
- `surface` (string): Surface style configuration. Options: `soft`, `solid` (default: `soft`).
- `heading` (string): Overrides the heading banner color variant independently of the slide body. Options: `base`, `main`, `accent`.

#### Slots
- **Default Slot**: Main content slot. Usually contains one of the layout components below.
- `notes`: Speaker notes slot. Element inside this slot (e.g. `<div slot="notes">`) is hidden on the slide and displayed in the presenter view dashboard.
- `script`: SpeechSynthesis reading script slot. Element inside this slot (e.g. `<div slot="script">`) is hidden on the slide and read aloud or displayed in the presenter view.
- `header`: Top header annotation slot (automatically positioned at the top of the slide viewport).
- `footer`: Bottom footer annotation slot (automatically positioned at the bottom of the slide viewport).

#### CSS Variables
- `--hd-slide-body-background-color` / `--hd-slide-body-background`: Slide body background override.
- `--hd-slide-body-text-color`: Slide body text color override.
- `--hd-slide-border-width` / `--hd-slide-border-style` / `--hd-slide-border-color`: Slide frame border properties.
- `--hd-slide-overlay-background`: Decorative pointer-events-none overlay (e.g., CRT scanlines or botanical corner ornaments).

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

#### Attributes
- `variant` (string): Optional variant override (`base`, `main`, `accent`).
- `surface` (string): Optional surface override (`soft`, `solid`).

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
- `variant` (string): Theme variation mapping. Options: `base`, `main` (uses primary theme colors), `accent` (uses secondary accent colors). Default: `base`.
- `surface` (string): Surface override configuration. Options: `soft`, `solid`. Default: `soft`.
- `heading` (string): Overrides the card header banner variant independently of the card body. Options: `base`, `main`, `accent`.

#### Slots
- `heading`: Card title header area. Automatically styled like a subheading.
- **Default Slot**: Main interior body content of the card.

---

### 8. `<hd-box>`
A boxed container similar to `<hd-card>` but configured to automatically stretch to fill 100% height of its parent column/container.

#### Attributes
- `variant` (string): Theme variation mapping. Options: `base`, `main`, `accent`. Default: `base`.
- `surface` (string): Surface override configuration. Options: `soft`, `solid`. Default: `soft`.
- `heading` (string): Overrides the box header banner variant independently of the box body. Options: `base`, `main`, `accent`.

#### Slots
- `heading`: Box title header area.
- **Default Slot**: Main interior body content.

---

### 9. `<hd-callout>`
Draws a highlighted text block with a left border marker to emphasize specific statements or quotes.

#### Attributes
- `variant` (string): Theme variation mapping. Options: `base`, `main`, `accent`. If omitted, inherits active slide body colors.
- `surface` (string): Surface override configuration. Options: `soft`, `solid`.

#### Slots
- **Default Slot**: Main content to render within the callout box.
