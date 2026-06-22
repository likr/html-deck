# html-deck Presenter View Reference

`html-deck` includes a full-featured, local presenter view dashboard (Speaker View) using a `BroadcastChannel`-based synchronization model. This document details how to scaffold, customize, and build your own presenter interface.

---

## 🚀 Setting Up the Presenter View

To enable presenter synchronization, you need:
1. A **main presentation slide deck** (`index.html`).
2. A **presenter view dashboard** (`presenter.html`).
3. An active `presenter-url` attribute on the `<hd-deck>` element.

### 1. Basic Deck Setup (`index.html`)
Specify the path to the presenter file in `<hd-deck>`:
```html
<hd-deck presenter-url="./presenter.html" aspect-ratio="16:9">
  <hd-slide>
    <hd-layout-standard>
      <h2 slot="title">Slide Title</h2>
      <hd-text>Presentation content.</hd-text>
    </hd-layout-standard>
    <hd-notes>Speaker cues and talking points go here.</hd-notes>
  </hd-slide>
</hd-deck>
```

### 2. Scaffold a Presenter View (`presenter.html`)
The presenter file is a normal HTML file that loads the library and places the dedicated `hd-presenter-*` tags.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Speaker Dashboard</title>
  <!-- Load core elements AND presenter extensions -->
  <script type="module">
    import 'html-deck';
    import 'html-deck/presenter';
  </script>
  <style>
    /* Add dashboard styles here (e.g. grid layout) */
  </style>
</head>
<body>
  <!-- Place presenter elements -->
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

---

## 👥 Presenter View Elements

The following elements are registered when importing `html-deck/presenter`:

### 1. `<hd-presenter-timer>`
A presentation stopwatch that counts up from the moment the presenter view is loaded.
- Includes a built-in **Reset** button. Clicking this button resets the elapsed time counter back to `00:00:00`.
- Format: `HH:MM:SS`.

### 2. `<hd-presenter-clock>`
A standard digital clock displaying the current local system time.
- Format: `HH:MM:SS` (updates every second).

### 3. `<hd-presenter-status>`
Displays slide navigation counts.
- Format: `Current Index + 1 / Total Slides` (e.g., `3 / 12`).

### 4. `<hd-presenter-preview>`
Displays scaled down renderings of slides.
- **Attributes**:
  - `type` (string): Set to `"current"` or `"next"`.
    - `"current"`: Renders the active slide currently visible on the main screen.
    - `"next"`: Renders a preview of the upcoming slide. If at the end of the deck, displays "End of Presentation".
- **Scaling Mechanism**: It measures the viewport container and scales the slide via `CSS transform` to fit the aspect ratio (matching `16:9` or custom aspect ratios automatically).

### 5. `<hd-presenter-notes>`
Displays the speaker cues embedded inside the slide.
- **Source**: Renders the HTML contents of the `<hd-notes>` tag found within the currently active `<hd-slide>`. If no notes are provided for the active slide, it defaults to displaying "No notes.".

### 6. `<hd-presenter-controls>`
Draws quick navigation buttons (◀ and ▶) to step forward or backward through slides.

---

## 🎨 Customizing Styles & CSS Variables

You can customize the typography, colors, and button appearances in your `presenter.html` styles using variables prefixed with `--hd-presenter-`:

| CSS Variable | Default Value | Description |
| :--- | :--- | :--- |
| `--hd-presenter-font` | `monospace` / `sans-serif` | Font family for all presenter labels and buttons |
| `--hd-presenter-timer-size` | `1.8rem` | Font size of the elapsed stopwatch timer |
| `--hd-presenter-timer-color` | `#ffffff` | Color of the timer numbers |
| `--hd-presenter-clock-size` | `1.8rem` | Font size of the local clock |
| `--hd-presenter-status-size` | `2.5rem` | Font size of the index counter |
| `--hd-presenter-preview-size` | `1.4rem` | Text size of placeholder screens |
| `--hd-presenter-notes-size` | `1.6rem` | Text size of the speaker notes |
| `--hd-presenter-btn-bg` | `#3b82f6` | Button background fill color |
| `--hd-presenter-btn-hover-bg` | `#2563eb` | Button background hover state |

---

## 🔄 How Synchronization Works (`BroadcastChannel`)

Hosting slide decks and speaker view windows communicate using the native browser API `BroadcastChannel`. They connect to a shared channel named `hd-deck-channel`.

### Messaging Specification

1. **Navigation Request** (Sent by Presenter `controls` ➔ Deck):
   ```json
   { "type": "nav", "action": "next" }
   { "type": "nav", "action": "prev" }
   { "type": "nav", "action": "goto", "index": 2 }
   ```
2. **Synchronization Request** (Sent by Presenter elements on mount ➔ Deck):
   ```json
   { "type": "request-sync" }
   ```
3. **Synchronization Payload** (Broadcasted by Deck on slide change or sync request ➔ Presenter):
   ```json
   {
     "type": "sync",
     "index": 0,
     "total": 10,
     "notes": "Speaker note HTML here",
     "activeHTML": "<hd-slide active>...</hd-slide>",
     "nextTitle": "Slide 2 Title",
     "nextHTML": "<hd-slide>...</hd-slide>",
     "aspectRatio": "16:9"
   }
   ```
Because communication is handled via the browser, the presenter view must run on the **same origin** (domain and port) as the main presentation.
