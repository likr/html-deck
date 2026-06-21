export class HdList extends HTMLElement {
  static get observedAttributes() {
    return ['ordered'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.depth = 0;
  }

  connectedCallback() {
    this.detectDepth();
    this.render();
  }

  detectDepth() {
    this.depth = 0;
    let parent = this.parentElement;
    while (parent) {
      if (parent.tagName === 'HD-LIST') {
        this.depth++;
      }
      parent = parent.parentElement;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'ordered' && oldValue !== newValue) {
      this.render();
    }
  }

  getListStyleType(tag) {
    if (tag === 'ul') {
      const types = ['disc', 'circle', 'square'];
      return types[Math.min(this.depth, types.length - 1)];
    } else {
      const types = ['decimal', 'lower-alpha', 'lower-roman'];
      return types[Math.min(this.depth, types.length - 1)];
    }
  }

  render() {
    const isOrdered = this.hasAttribute('ordered');
    const tag = isOrdered ? 'ol' : 'ul';
    const listStyleType = this.getListStyleType(tag);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: ${this.depth > 0 ? '0' : 'var(--hd-list-margin-bottom, 12px)'};
          margin-top: ${this.depth > 0 ? '2px' : '0'};
        }
        ${tag} {
          font-family: var(--hd-body-font, inherit);
          margin: 0;
          padding-left: var(--hd-list-padding-left, 19px);
          font-size: ${this.depth > 0 ? '12px' : 'var(--hd-list-font-size, 14px)'};
          line-height: var(--hd-list-line-height, 1.6);
          color: var(--hd-list-color, var(--hd-slide-text-color, var(--hd-text-color, #1e293b)));
          list-style-type: ${listStyleType};
        }
        ::slotted(li) {
          margin-bottom: var(--hd-list-item-margin-bottom, 4px);
        }
      </style>
      <${tag}><slot></slot></${tag}>
    `;
  }
}
