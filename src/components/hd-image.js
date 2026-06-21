export class HdImage extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt', 'fit', 'caption', 'height', 'width', 'shadow', 'rounded'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const fit = this.getAttribute('fit') || 'contain';
    const caption = this.getAttribute('caption') || '';
    const height = this.getAttribute('height') || 'auto';
    const width = this.getAttribute('width') || '100%';
    const hasShadow = this.hasAttribute('shadow');
    const isRounded = this.hasAttribute('rounded');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-image-margin-bottom, 12px);
          width: ${width};
          text-align: center;
        }
        .image-container {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          max-width: 100%;
        }
        img {
          max-width: 100%;
          height: ${height};
          object-fit: ${fit};
          border-radius: ${isRounded ? '12px' : '0'};
          box-shadow: ${hasShadow ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'};
          border: ${hasShadow || isRounded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
        }
        .caption {
          margin-top: 4px;
          font-size: var(--hd-image-caption-size, 9px);
          color: var(--hd-image-caption-color, var(--hd-text-muted, #94a3b8));
          font-style: italic;
        }
      </style>
      <div class="image-container">
        ${src ? `<img src="${src}" alt="${alt}">` : ''}
        ${caption ? `<div class="caption">${caption}</div>` : ''}
      </div>
    `;
  }
}
