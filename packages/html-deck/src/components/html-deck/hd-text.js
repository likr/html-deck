const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: var(--hd-text-margin-bottom, 8px);
  }
  p {
    font-family: var(--hd-body-font, inherit);
    font-size: var(--hd-text-font-size, 14px);
    line-height: var(--hd-text-line-height, 1.6);
    color: var(--hd-text-color-custom, var(--hd-slide-text-color, var(--hd-text-color, #1e293b)));
    margin: 0;
    letter-spacing: 0.01em;
    text-align: inherit;
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
