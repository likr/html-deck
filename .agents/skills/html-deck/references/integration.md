# html-deck Integration Reference

This document explains how to integrate external libraries like **KaTeX** (for mathematical notation) and **Prism.js** (for syntax highlighting) with your `html-deck` presentations.

---

## 🧮 1. Mathematical Rendering with KaTeX

To render mathematical formulas and expressions inside slides:

### Load KaTeX via CDN
Include the KaTeX stylesheet and deferred scripts in the HTML `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
```

### Auto-Render Script
Add a script block to run KaTeX's `renderMathInElement` once the window loads. Use standard delimiters:
```html
<script type="module">
  window.addEventListener('load', () => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  });
</script>
```

### Writing Math
Use the configured delimiters directly in your text content (e.g., `$$x^2 + y^2 = z^2$$` for display math or `\(x\)` for inline math). Do not use non-standard raw custom HTML tags for math.

---

## 💻 2. Syntax Highlighting with Prism.js & External Files

To display high-quality code blocks using Prism.js and load source code files dynamically:

### HTML Entity Escaping (Crucial)
When displaying HTML examples (especially containing `hd-` tags or components) inside a `<pre><code>` block, **always escape the angle brackets** using `&lt;` and `&gt;`. 
> [!WARNING]
> If you write raw HTML tags inside `<code>` without escaping them, the browser will interpret them as active DOM elements. This will break layout constraints and cause slide height collapses.

### Loading External Code via Vite Raw Imports
To load external code dynamically (e.g. from `.js`, `.py`, or `.css` files), use Vite's `?raw` imports and set the `.textContent` property of the `<code>` container. This avoids having to copy-paste large code blocks directly into the HTML.

```html
<pre><code class="language-javascript" id="my-block"></code></pre>

<script type="module">
  import codeText from './sample-code.js?raw';
  
  const el = document.getElementById('my-block');
  el.textContent = codeText;
  
  // Trigger Prism highlighting after the DOM updates
  setTimeout(() => {
    if (window.Prism) {
      window.Prism.highlightElement(el);
    }
  }, 0);
</script>
```
