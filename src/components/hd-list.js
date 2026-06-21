export class HdList extends HTMLElement {
  static get observedAttributes() {
    return ['ordered'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'ordered' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const isOrdered = this.hasAttribute('ordered');
    const tag = isOrdered ? 'ol' : 'ul';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-list-margin-bottom, 1.5rem);
        }
        ${tag} {
          margin: 0;
          padding-left: var(--hd-list-padding-left, 2.5rem);
          font-size: var(--hd-list-font-size, 1.4rem);
          line-height: var(--hd-list-line-height, 1.6);
          color: var(--hd-list-color, var(--hd-text-color, #f8fafc));
        }
        ::slotted(li) {
          margin-bottom: var(--hd-list-item-margin-bottom, 0.5rem);
        }
        @media print {
          ${tag} {
            color: #000000 !important;
          }
        }
      </style>
      <${tag}><slot></slot></${tag}>
    `;
  }
}
