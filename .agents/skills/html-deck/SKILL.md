---
name: html-deck
description: How to create, write, and style new presentations or add slides using the html-deck WebComponents slideshow library. Trigger this skill whenever a user requests to build a presentation, edit slides, write math equations in slides, write code examples in slides, include external code source files, use image components, or configure presenter options.
---

# html-deck Slide Authoring Skill

This skill explains how to build elegant presentation slide decks using the `html-deck` library.

---

## 🚀 Generating a Boilerplate Slide Deck

When the user asks to create a **new** presentation, do not write the HTML manually from scratch. Use the bundled Node.js CLI boilerplate utility:

```bash
node .agents/skills/html-deck/scripts/create-deck.js <output-file.html> [options]
```

**Options**:
- `--aspect <ratio>`: Sets ratio. Examples: `16:9` (default), `4:3`, `1.6`.
- `--presenter`: Automatically includes `presenter-url="..."` attribute linked to the project presenter dashboard.

---

## 🎨 Page Structuring Guidelines

### 1. Include Global Stylesheet (html-deck.css)
Always link the CSS utility stylesheet `src/html-deck.css` in the HTML document's `<head>`. It resets body margins, ensures proper presentation scrolling, and provides essential text decoration/utility classes.

```html
<link rel="stylesheet" href="src/html-deck.css">
```

### 2. Flat Declarative DOM Tree
Keep the DOM structure completely flat. Do not nest pages inside nested section blocks. Place all `<hd-slide>` tags directly under `<hd-deck>`.

```html
<hd-deck transition="fade" aspect-ratio="16:9" presenter-url="./demo/presenter.html">
  <hd-slide layout="title" title="Slide 1" center>...</hd-slide>
  <hd-slide layout="title-body" title="Slide 2">...</hd-slide>
</hd-deck>
```

### 3. Slide Layout presets
Choose the right `layout` attribute value for `<hd-slide>`:
- `title`: Centered alignment, useful for intro/closing slides. Uses `<hd-heading>` (level="1") and `<hd-text>`.
- `title-body`: Standard slides. Slot title into `<hd-heading slot="title">`, and put body contents in the main default slot.
- `split`: Splitted side-by-side content columns. Put left column elements in `slot="left"`, right column elements in `slot="right"`.

### 4. Customizing Variables & Text Decoration Utilities
The virtual presentation space defaults to **960x540** (proportional to Google Slides 16:9).
- Use HSL tailored custom variables to change theme colors:
```css
:root {
  --hd-slide-bg: #1e1b4b; /* Indigo slide backgrounds */
  --hd-text-color: #f1f5f9;
  --hd-primary: #818cf8;
}
```
- Decorate texts in paragraph using span classes provided by `html-deck.css`:
  - Font weights: `.font-bold`, `.font-normal`, `.font-light`
  - Theme colors: `.text-primary`, `.text-secondary`, `.text-accent`, `.text-muted`
  - Font styles: `.italic`, `.underline`, `.line-through`

```html
<hd-text>
  This is a <span class="text-primary font-bold">highlighted</span> word in a paragraph.
</hd-text>
```

### 5. Nested Lists
Lists (`<hd-list>`) can be nested inside another `<hd-list>` component. The nested list will automatically detect its depth level and adjust indentation spacing and bullet types (disc, circle, square).
```html
<hd-list>
  <li>First item</li>
  <li>Second item with nested list
    <hd-list>
      <li>Nested item A</li>
      <li>Nested item B
        <hd-list>
          <li>Deeply nested item</li>
        </hd-list>
      </li>
    </hd-list>
  </li>
</hd-list>
```

### 6. Image Component (<hd-image>)
Use `<hd-image>` for showing images with caption and shadow box decorators.
- **Attributes**:
  - `src`: Path to image
  - `alt`: Alt text
  - `fit`: Size mode (`cover` or `contain`, defaults to `cover`)
  - `caption`: Caption text shown at bottom-right
  - `shadow`: Set to `"true"` to add shadow effect
  - `rounded`: Set to `"true"` to add rounded corners
```html
<hd-image src="./assets/chart.png" caption="Sales Q4" shadow="true" rounded="true"></hd-image>
```

---

## ⚠️ Important Coding Guidelines

### 1. HTML Entity Escaping inside Code Blocks (Critical)
When showing HTML examples (especially containing `hd-` tags) inside `<hd-codeblock>`, **always escape the brackets** using `&lt;` and `&gt;`.
If you write raw `<hd-slide>` inside `<hd-codeblock>`, the browser will interpret it as a real slide, breaking layout constraints and causing page collapses.

- **Incorrect**:
```html
<hd-codeblock language="html">
  <hd-slide layout="split">...</hd-slide>
</hd-codeblock>
```
- **Correct**:
```html
<hd-codeblock language="html">
  &lt;hd-slide layout="split"&gt;...&lt;/hd-slide&gt;
</hd-codeblock>
```

### 2. Loading External Files in Code Blocks
You can render external files directly inside `<hd-codeblock>` by setting the `src` attribute. This is cleaner than inlining massive snippets.
```html
<hd-codeblock language="javascript" src="./demo/sample-code.js"></hd-codeblock>
```

### 3. Math LaTeX Syntax
Use `<hd-math>` for LaTeX equations. Keep LaTeX notation clean and decode characters like `<` or `>` properly. Use the `block` attribute to center and scale equations.
```html
<hd-math block>
  f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx
</hd-math>
```
