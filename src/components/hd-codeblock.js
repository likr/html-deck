import { prismCSSTextPromise } from '../html-deck.js';

export class HdCodeblock extends HTMLElement {
  static get observedAttributes() {
    return ['language', 'src', 'scrollable'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style id="prism-style"></style>
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-codeblock-margin-bottom, 0.75rem);
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          font-size: var(--hd-codeblock-font-size, 0.7rem);
          border-radius: 8px;
          overflow: hidden;
        }
        pre {
          margin: 0 !important;
          padding: 12px !important;
          background: var(--hd-codeblock-bg, #f8fafc) !important;
          border: 1px solid var(--hd-codeblock-border, #e2e8f0);
          border-radius: 8px;
          overflow: auto;
        }
        :host([scrollable]) pre {
          max-height: var(--scroll-height, 250px) !important;
          overflow-y: auto !important;
        }
        code {
          font-family: inherit !important;
          text-shadow: none !important;
          color: var(--hd-codeblock-text, #0f172a) !important;
        }
        /* Prism token overrides using CSS variables */
        .token.comment, .token.prolog, .token.doctype, .token.cdata {
          color: var(--hd-token-comment, #64748b) !important;
          font-style: italic;
        }
        .token.punctuation {
          color: var(--hd-token-operator, #475569) !important;
        }
        .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted {
          color: var(--hd-token-number, #2563eb) !important;
        }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted {
          color: var(--hd-token-string, #059669) !important;
        }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
          color: var(--hd-token-operator, #475569) !important;
        }
        .token.atrule, .token.attr-value, .token.keyword {
          color: var(--hd-token-keyword, #d97706) !important;
        }
        .token.function, .token.class-name {
          color: var(--hd-token-function, #7c3aed) !important;
        }
        .token.regex, .token.important, .token.variable {
          color: var(--hd-token-variable, #475569) !important;
        }
      </style>
      <pre><code id="code-output"></code></pre>
    `;
  }

  async connectedCallback() {
    this.updateScrollable();
    if (this.hasAttribute('code')) {
      this.rawCode = this.getAttribute('code');
      this.isInlineHTML = false;
    } else {
      this.rawCode = this.innerHTML;
      this.isInlineHTML = true;
    }
    this.innerHTML = '';
    
    await this.setupHighlighting();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'language' && this.rawCode) {
      this.highlight();
    }
    if (name === 'src' && newValue) {
      this.loadExternalCode(newValue);
    }
    if (name === 'scrollable') {
      this.updateScrollable();
    }
  }

  updateScrollable() {
    const scrollable = this.getAttribute('scrollable');
    if (scrollable !== null) {
      let height = '250px';
      if (scrollable !== '' && scrollable !== 'true') {
        height = scrollable;
      }
      this.style.setProperty('--scroll-height', height);
    } else {
      this.style.removeProperty('--scroll-height');
    }
  }

  async setupHighlighting() {
    try {
      // 1. Ensure Prism CSS is loaded and injected into Shadow DOM
      const cssText = await prismCSSTextPromise;
      this.shadowRoot.getElementById('prism-style').textContent = cssText;
      
      // 2. Perform highlighting or load external file
      const src = this.getAttribute('src');
      if (src) {
        await this.loadExternalCode(src);
      } else {
        this.highlight();
      }
    } catch (err) {
      console.error('Failed to load PrismJS dependencies:', err);
      // Fallback: render raw code without highlight
      const codeOutput = this.shadowRoot.getElementById('code-output');
      if (codeOutput) {
        codeOutput.textContent = this.rawCode;
      }
    }
  }

  async loadExternalCode(src) {
    const codeOutput = this.shadowRoot.getElementById('code-output');
    if (codeOutput) {
      codeOutput.textContent = `// Loading code from ${src}...`;
    }
    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.rawCode = await response.text();
      this.isInlineHTML = false;
      this.highlight();
    } catch (err) {
      console.error(`Failed to load external code from ${src}:`, err);
      if (codeOutput) {
        codeOutput.textContent = `// Error loading code from ${src}\n// ${err.message}`;
      }
    }
  }

  highlight() {
    const codeOutput = this.shadowRoot.getElementById('code-output');
    if (!codeOutput || !window.Prism) return;

    const lang = this.getAttribute('language') || 'javascript';
    codeOutput.className = `language-${lang}`;
    
    // Trim raw code
    let codeText = this.rawCode.trim();
    
    // Decode HTML entities (e.g. &lt; -> <) ONLY for inline innerHTML tags
    if (this.isInlineHTML) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = codeText;
      codeText = textarea.value;
    }

    codeOutput.textContent = codeText;
    
    // Trigger Prism highlight
    window.Prism.highlightElement(codeOutput);
  }
}
