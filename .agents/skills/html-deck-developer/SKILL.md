---
name: html-deck-developer
description: Guidelines and workflows for modifying, extending, debugging, or refactoring the html-deck WebComponents presentation library core code. Trigger this skill whenever you need to edit src/ index.js, components, dynamic loaders, or when repairing slideshow scaling and printing bugs.
---

# html-deck-developer Skill

This skill is designed for coding agents that are tasking with refactoring, extending, or fixing the core code of the `html-deck` library. It documents crucial architectural assumptions, bugs we've resolved, and the self-update reflection protocol.

---

## 🔁 Self-Reflection & Skill Update Protocol

At the end of **every** development task you complete on the `html-deck` library:
1. **Analyze your work**: Did you fix a scaling bug? Did you encounter a layout collapse or a timing race condition?
2. **Review this SKILL.md file**: Are there parts of this file that could be improved, or new traps that should be documented to protect future agents from making the same mistake?
3. **Self-Update**: Modify this `SKILL.md` file immediately before closing the task to keep the developer skill alive and updated. Explain what you added in your task summary.

---

## 🛠️ Architectural Guidelines

### 1. WebComponents Lifecycle Timing (Crucial)
When `<hd-deck>` is mounted, its `connectedCallback()` runs **before** its Light DOM child elements (like `<hd-slide>`) are fully parsed by the browser HTML engine.
- **Rule**: Never call `this.querySelectorAll('hd-slide')` or try to access child attributes directly inside `connectedCallback` synchronously.
- **Pattern**: Wrap the child detection, transition property assignment, and initial slide updates inside a `setTimeout(..., 0)` block to allow the HTML parser to finish.
```javascript
connectedCallback() {
  // Bind events synchronously
  window.addEventListener('keydown', this.handleKeyDown);

  // Wait for children to be parsed in the DOM
  setTimeout(() => {
    this.slides = Array.from(this.querySelectorAll('hd-slide'));
    this.updateSlides();
    this.handleResize();
  }, 0);
}
```

### 2. Sizing & Scaling (Aspect Ratio)
`html-deck` maintains custom aspect ratios (like 16:9 or 4:3) by holding virtual slide dimensions (Width: `1920px`, Height: `1920 / ratio`) and scaling them down using CSS `transform: scale()` inside a `ResizeObserver`.
- **Rule**: Do not apply responsive layout media queries (like `@media (max-width: 768px)`) inside slide contents or columns. Viewport-based media queries trigger layout collapsing even when the slide is scaled down, breaking the aspect ratio.
- **Rule**: Ensure the layout container (`#layout-root` inside `<hd-slide>`) is always set to `display: flex; flex-direction: column; height: 100%; width: 100%;` so that content elements (like columns) do not collapse to height 0.
- **Rule**: Ensure `.deck-container` has `flex-shrink: 0;` (or `flex: none;`) to prevent the browser from shrinking the virtual layout size (e.g. `1920px`) inside the parent flex wrapper before the scale transform is applied.


### 3. Printing & PDF Exporting (`@media print`)
When printing, we must disable JavaScript scaling and let the browser format slides sequentially into paper pages.
- **Rule**: Inside `handleResize()`, skip scale calculations when printing:
```javascript
if (window.matchMedia('print').matches) return;
```
- **Rule**: Apply absolute landscape page bounds and pagebreaks in CSS. Enable color reproduction:
```css
@media print {
  :host {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
    position: relative !important;
    width: 297mm !important; /* A4 Width */
    height: 210mm !important; /* A4 Height */
    page-break-after: always !important;
    break-inside: avoid !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### 4. Flat CSS & Skeleton Principle
`html-deck` is a skeleton library. It provides structural components but does not define opinions on themes (e.g., Academic, Corporate, Dark, Light).
- **Rule**: Use fallback CSS custom properties inside shadow roots (e.g., `background-color: var(--hd-slide-bg, #000000)`).
- **Rule**: Allow users to customize colors, text sizes, and padding entirely via root CSS variables.
