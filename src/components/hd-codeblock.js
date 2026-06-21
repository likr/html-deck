import { prismCSSTextPromise } from '../html-deck.js';

export class HdCodeblock extends HTMLElement {
  static get observedAttributes() {
    return ['language', 'src'];
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
          background: var(--hd-codeblock-bg, #1e293b) !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: auto;
        }
        code {
          font-family: inherit !important;
          text-shadow: none !important;
        }
      </style>
      <pre><code id="code-output"></code></pre>
    `;
  }

  async connectedCallback() {
    this.rawCode = this.getAttribute('code') || this.innerHTML;
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
    
    // Trim raw code and remove HTML entity escaping if any
    let codeText = this.rawCode.trim();
    
    // Decode HTML entities (e.g. &lt; -> <) which are common when agents write inside HTML tags
    const doc = new DOMParser().parseFromString(codeText, 'text/html');
    codeText = doc.documentElement.textContent || codeText;

    codeOutput.textContent = codeText;
    
    // Trigger Prism highlight
    window.Prism.highlightElement(codeOutput);
  }
}
