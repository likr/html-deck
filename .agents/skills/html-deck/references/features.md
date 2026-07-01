# html-deck Library Features Reference

This document covers the advanced built-in features of `html-deck`, specifically the **Presenter View** and the **PDF Export & Printing** mechanism.

---

## 👥 1. Presenter View (Speaker Dashboard)

`html-deck` includes a local presenter view dashboard (Speaker View) synced via a `BroadcastChannel` communication model. 

### Setting Up the Presenter View
To enable synchronization, you need a main slide deck (`index.html`), a presenter file (`presenter.html`), and the `presenter-url` attribute configured on the deck container:

1. **Main Deck (`index.html`)**:
   ```html
   <hd-deck presenter-url="./presenter.html" aspect-ratio="16:9">
     <hd-slide>
       <hd-layout>
         <h2 slot="heading">My Title</h2>
         <p>Main content visible to the audience.</p>
       </hd-layout>
       <!-- Speaker cues -->
       <div slot="notes">Explain key benefits here.</div>
     </hd-slide>
   </hd-deck>
   ```

2. **Presenter View Dashboard (`presenter.html`)**:
   Create a standard HTML page loading the core presenter scripts:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Speaker Dashboard</title>
     <script type="module">
       import 'html-deck';
       import 'html-deck/presenter';
     </script>
   </head>
   <body>
     <!-- Place speaker UI elements -->
     <hd-presenter-timer></hd-presenter-timer>
     <hd-presenter-clock></hd-presenter-clock>
     <hd-presenter-status></hd-presenter-status>
     <hd-presenter-preview type="current"></hd-presenter-preview>
     <hd-presenter-preview type="next"></hd-presenter-preview>
     <hd-presenter-notes></hd-presenter-notes>
     <hd-presenter-controls></hd-presenter-controls>
   </body>
   </html>
   ```

### Presenter View Elements
The following elements are registered when importing `html-deck/presenter`:
- **`<hd-presenter-timer>`**: Stopwatch counting elapsed time since loading. Clicking it resets to `00:00:00`.
- **`<hd-presenter-clock>`**: Digital clock showing current system time (`HH:MM:SS`).
- **`<hd-presenter-status>`**: Index counter of active slides (e.g. `3 / 12`).
- **`<hd-presenter-preview>`**: Renders scaled previews of slides. Set `type="current"` (active slide) or `type="next"` (upcoming slide preview).
- **`<hd-presenter-notes>`**: Renders the HTML contents of the `slot="notes"` element of the active slide. Defaults to "No notes." if empty.
- **`<hd-presenter-script>`**: Renders the HTML contents of the `slot="script"` element of the active slide.
- **`<hd-presenter-controls>`**: Provides navigation buttons (◀ and ▶).

### CSS Customization
Presenter elements can be styled using the following variables (prefixed with `--hd-presenter-`):
- `--hd-presenter-font` (default: monospace / sans-serif)
- `--hd-presenter-timer-size`, `--hd-presenter-timer-color`
- `--hd-presenter-clock-size`
- `--hd-presenter-status-size`
- `--hd-presenter-preview-size`
- `--hd-presenter-notes-size`
- `--hd-presenter-script-size`
- `--hd-presenter-btn-bg`, `--hd-presenter-btn-hover-bg`

### BroadcastChannel Sync Mechanism
Communication occurs over the native browser `BroadcastChannel` named `hd-deck-channel`. 
- **Origin constraint**: Because the dashboard and deck communicate in the browser client, they must run on the **same origin** (same domain and port).

---

## 🖨️ 2. PDF Export and Printing

`html-deck` provides native print styles that convert the slideshow into standard PDF pages directly from the browser print dialog.

### How to Export to PDF (Step-by-Step)
1. Open your presentation in Chrome or any Chromium-based browser.
2. Press **Ctrl + P** (Windows/Linux) or **Cmd + P** (macOS).
3. Select the following settings in the print options panel:
   - **Destination**: Save as PDF
   - **Layout / Orientation**: Landscape
   - **Margins**: **None** (Crucial to prevent page breaks and unwanted borders)
   - **Background graphics**: **Checked / Enabled** (Crucial to render colors, backgrounds, and syntax highlighting)
4. Save the document.

### Print Layout Mechanics
The library automatically configures print boundaries to stack slides:
1. **Dimension Match Alignment (`@page`)**:
   Under `@media print`, standard computer screen sizes are matched to printable sizes using a base height of **5.625 inches** (540px at 96 DPI). The width is computed by multiplying this height by the slide aspect ratio.
   For `aspect-ratio="16:9"`:
   $$\text{Width} = 5.625 \times \frac{16}{9} = 10 \text{ inches}$$
   This results in the CSS rule:
   ```css
   @media print {
     @page {
       size: 10in 5.625in;
       margin: 0;
     }
   }
   ```
2. **Print Overrides**:
   Controls, timelines, and UI progress widgets are set to `display: none !important;`.
   Slides are flattened (`opacity: 1`, `visibility: visible`, `position: relative`) and separated using `page-break-after: always !important;` and `break-inside: avoid !important;`.

---

## 🔊 3. Speech Synthesis & Auto-Play Presentation

`html-deck` includes built-in Text-To-Speech (TTS) reading and automated slideshow playback functionality powered by the browser SpeechSynthesis API.

### Enabling Speech Synthesis and Auto-Play
To use these features, configure the attributes on the `<hd-deck>` element:
- **`enable-speech`**: Displays the `🔊` (Read Aloud) button in the bottom-right controls panel and enables the corresponding keyboard shortcut.
- **`enable-auto-play`**: Displays the `⏯` (Auto Play) button in the bottom-right controls panel and enables the corresponding keyboard shortcut.
- **`auto-play-interval`**: Sets the delay duration (in seconds) to wait before automatically advancing to the next slide when no `slot="script"` reading text is defined on the current slide (default: `5`).

Example:
```html
<hd-deck enable-speech enable-auto-play auto-play-interval="3">
  <!-- Slides here -->
</hd-deck>
```

### Script & Speech Mechanics
1. **Slide Script (`slot="script"`)**: Place a `<div slot="script">` tag inside `<hd-slide>` containing the exact text to read aloud. This text is automatically hidden on the slide canvas but synced to the presenter view.
2. **Auto-Play Progression**:
   - When Auto-Play is active, the deck plays the slide script using SpeechSynthesis.
   - When the speech ends, it automatically triggers `next()` to advance to the next slide.
   - If no script text is present, it falls back to waiting for the duration specified in the `auto-play-interval` attribute before advancing.
3. **Manual Navigation**: Manual page transitions (via click, swiping, or keyboard shortcuts) during speech will cancel any active speech and immediately trigger reading the new slide if Auto-Play is active.

### Interaction & Keyboard Shortcuts
- **`s` / `S`**: Toggles reading aloud the current slide script (only when `enable-speech` is active).
- **`a` / `A`**: Toggles Auto-Play mode on/off (only when `enable-auto-play` is active).

---

## 🎛️ 4. Navigation & Interaction Controls

`html-deck` provides an overlay control panel at the bottom of the slide presentation to facilitate navigation, toggling presentation tools, and viewing options.

### Controls Layout
The control buttons are positioned in the bottom-left and bottom-right corners of the presentation canvas to keep the screen uncluttered:
- **Left-Bottom Controls**: Action buttons for speaker features:
  - **Speech Synthesis (🔊)**: Toggles reading aloud the current slide script.
  - **Auto Play (⏯)**: Toggles automated progression of slides.
  - **Fullscreen (⛶)**: Toggles browser fullscreen mode.
  - **Presenter View (👤)**: Opens the presenter view dashboard window.
- **Right-Bottom Controls**: Core slide navigation buttons:
  - **First Slide (⏮)**: Returns to the first slide in the deck.
  - **Previous Slide (◀)**: Navigates to the preceding slide.
  - **Next Slide (▶)**: Navigates to the following slide.

### Hiding the Controls Panel
To hide the controls panel completely, add the `no-controls` attribute to the `<hd-deck>` element:
```html
<hd-deck no-controls>
  <!-- Slides here -->
</hd-deck>
```

### Keyboard Shortcuts & Exposing Methods
These functions can be invoked via keyboard shortcuts or programmatically called on the `<hd-deck>` element instance:

| Feature | Keyboard Shortcut | Javascript Method |
| :--- | :--- | :--- |
| First Slide | `Home` | `deck.first()` |
| Previous Slide | `ArrowLeft` / `Backspace` | `deck.prev()` |
| Next Slide | `ArrowRight` / `Space` / `Enter` | `deck.next()` |
| Fullscreen | `f` / `F` | `deck.toggleFullscreen()` |
| Presenter View | `p` / `P` | `deck.openPresenter()` |
| Read Aloud | `s` / `S` | `deck.toggleSpeech()` |
| Auto Play | `a` / `A` | `deck.toggleAutoPlay()` |
