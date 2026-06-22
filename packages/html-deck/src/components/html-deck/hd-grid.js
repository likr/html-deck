const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: grid;
    grid-template-columns: repeat(var(--hd-grid-cols, 1), minmax(0, 1fr));
    gap: var(--hd-grid-gap, var(--hd-gap-md, 16px));
    width: 100%;
    box-sizing: border-box;
  }
</style>
<slot></slot>
`;

export class HdGrid extends HTMLElement {
  static get observedAttributes() {
    return ['cols', 'gap'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this.updateCols();
    this.updateGap();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'cols') {
      this.updateCols();
    }
    if (name === 'gap') {
      this.updateGap();
    }
  }

  updateCols() {
    const cols = this.getAttribute('cols') || '1';
    this.style.setProperty('--hd-grid-cols', cols);
  }

  updateGap() {
    const gap = this.getAttribute('gap') || 'md';
    const presetGaps = ['xs', 'sm', 'md', 'lg', 'xl'];
    if (presetGaps.includes(gap)) {
      this.style.setProperty('--hd-grid-gap', `var(--hd-gap-${gap})`);
    } else {
      this.style.setProperty('--hd-grid-gap', gap);
    }
  }
}
