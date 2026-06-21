export class HdHeading extends HTMLElement {
  static get observedAttributes() {
    return ['level'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'level' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const level = this.getAttribute('level') || '1';
    const tag = `h${level}`;

    // Size configuration based on level
    let defaultFontSize = '3.5rem';
    let defaultColor = 'var(--hd-primary, #3b82f6)';
    if (level === '2') {
      defaultFontSize = '2.5rem';
      defaultColor = 'var(--hd-secondary, #a855f7)';
    } else if (level === '3') {
      defaultFontSize = '1.8rem';
      defaultColor = 'var(--hd-text-color, #f8fafc)';
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-heading-margin-bottom, 0.5em);
        }
        ${tag} {
          font-size: var(--hd-heading-font-size-${level}, ${defaultFontSize});
          color: var(--hd-heading-color-${level}, ${defaultColor});
          font-weight: var(--hd-heading-font-weight, 700);
          line-height: var(--hd-heading-line-height, 1.2);
          margin: 0;
          letter-spacing: -0.02em;
        }
      </style>
      <${tag}><slot></slot></${tag}>
    `;
  }
}
