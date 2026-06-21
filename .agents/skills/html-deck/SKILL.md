---
name: html-deck
description: How to create, write, and style new presentations or add slides using the html-deck WebComponents slideshow library. Trigger this skill whenever a user requests to build a presentation, edit slides, write math equations in slides, write code examples in slides, or configure presenter options.
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

### 1. Flat Declarative DOM Tree
Keep the DOM structure completely flat. Do not nest pages inside nested section blocks. Place all `<hd-slide>` tags directly under `<hd-deck>`.

```html
<hd-deck transition="fade" aspect-ratio="16:9" presenter-url="./demo/presenter.html">
  <hd-slide layout="title" title="Slide 1">...</hd-slide>
  <hd-slide layout="title-body" title="Slide 2">...</hd-slide>
</hd-deck>
```

### 2. Slide Layout presets
Choose the right `layout` attribute value for `<hd-slide>`:
- `title`: Centered alignment, useful for intro/closing slides. Uses `<hd-heading>` (level="1") and `<hd-text>`.
- `title-body`: Standard slides. Slot title into `<hd-heading slot="title">`, and put body contents in the main default slot.
- `split`: Splitted side-by-side content columns. Put left column elements in `slot="left"`, right column elements in `slot="right"`.

### 3. Arbitrary Multi-Columns
For 3-column, 4-column, or unequal column cards, use `<hd-columns>` containing child `<hd-column>` components. Adjust widths using the `flex` attribute.
```html
<hd-columns>
  <hd-column flex="1"><hd-text>Column A</hd-text></hd-column>
  <hd-column flex="2"><hd-text>Double Width Column B</hd-text></hd-column>
</hd-columns>
```

### 4. Customizing Variables
Do not redefine `--hd-bg` on the root. The deck host background is always black. Use `--hd-slide-bg` on `<hd-slide>` (or globally) to customize slide background styles.
```css
:root {
  --hd-slide-bg: #1e1b4b; /* Indigo slide backgrounds */
  --hd-text-color: #f1f5f9;
  --hd-primary: #818cf8;
}
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

### 2. Math LaTeX Syntax
Use `<hd-math>` for LaTeX equations. Keep LaTeX notation clean and decode characters like `<` or `>` properly. Use the `block` attribute to center and scale equations.
```html
<hd-math block>
  f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx
</hd-math>
```
