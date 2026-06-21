export class HdColumn extends HTMLElement {
  static get observedAttributes() {
    return ['flex'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'flex' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const flexVal = this.getAttribute('flex') || '1';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex: ${flexVal};
          min-width: 0; /* Prevents flex items from overflowing */
        }
      </style>
      <slot></slot>
    `;
  }
}
