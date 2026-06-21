import { katexCSSTextPromise } from '../html-deck.js';

export class HdMath extends HTMLElement {
  static get observedAttributes() {
    return ['block'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style id="katex-style"></style>
      <style>
        :host {
          display: inline-block;
        }
        :host([block]) {
          display: block;
          text-align: center;
          margin: var(--hd-math-block-margin, 0.75rem 0);
        }
      </style>
      <span id="math-output"></span>
    `;
  }

  async connectedCallback() {
    this.formula = this.getAttribute('formula') || this.innerHTML;
    this.innerHTML = '';
    
    await this.setupKaTeX();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'block' && oldValue !== newValue && this.formula) {
      this.renderMath();
    }
  }

  async setupKaTeX() {
    try {
      // Ensure KaTeX CSS is loaded and injected into Shadow DOM
      const cssText = await katexCSSTextPromise;
      this.shadowRoot.getElementById('katex-style').textContent = cssText;

      this.renderMath();
    } catch (err) {
      console.error('Failed to initialize KaTeX:', err);
      const output = this.shadowRoot.getElementById('math-output');
      if (output) {
        output.textContent = this.formula; // fallback to raw string
      }
    }
  }

  renderMath() {
    const output = this.shadowRoot.getElementById('math-output');
    if (!output || !window.katex) return;

    const isBlock = this.hasAttribute('block');
    let formulaText = this.formula.trim();

    // Decode HTML entities
    const doc = new DOMParser().parseFromString(formulaText, 'text/html');
    formulaText = doc.documentElement.textContent || formulaText;

    try {
      window.katex.render(formulaText, output, {
        displayMode: isBlock,
        throwOnError: false
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      output.textContent = formulaText;
    }
  }
}
