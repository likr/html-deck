const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    margin-bottom: var(--hd-text-margin-bottom, 1rem);
  }
  p {
    font-size: var(--hd-text-font-size, 1.5rem);
    line-height: var(--hd-text-line-height, 1.6);
    color: var(--hd-text-color-custom, var(--hd-text-color, #f8fafc));
    margin: 0;
    letter-spacing: 0.01em;
  }
  @media print {
    p {
      color: #000000 !important;
    }
  }
</style>
<p><slot></slot></p>
`;

export class HdText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
