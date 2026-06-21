import { loadScript, fetchCSS } from '../utils/loader.js';

export class HdCodeblock extends HTMLElement {
  static get observedAttributes() {
    return ['language'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style id="prism-style"></style>
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-codeblock-margin-bottom, 1.5rem);
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          font-size: var(--hd-codeblock-font-size, 1.1rem);
          border-radius: 8px;
          overflow: hidden;
        }
        pre {
          margin: 0 !important;
          padding: 20px !important;
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
    // Keep a copy of original source code text
    this.rawCode = this.getAttribute('code') || this.innerHTML;
    // Clear innerHTML to prevent rendering raw text on screen
    this.innerHTML = '';
    
    await this.setupHighlighting();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'language' && oldValue !== newValue && this.rawCode) {
      this.highlight();
    }
  }

  async setupHighlighting() {
    try {
      // 1. Ensure Prism.js script is loaded globally
      await loadScript('vendor/prismjs/prism.js');
      
      // 2. Ensure Prism CSS is loaded and injected into Shadow DOM
      const cssText = await fetchCSS('vendor/prismjs/prism.css');
      this.shadowRoot.getElementById('prism-style').textContent = cssText;
      
      // 3. Perform highlighting
      this.highlight();
    } catch (err) {
      console.error('Failed to load PrismJS dependencies:', err);
      // Fallback: render raw code without highlight
      const codeOutput = this.shadowRoot.getElementById('code-output');
      if (codeOutput) {
        codeOutput.textContent = this.rawCode;
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
