const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    position: absolute;
    bottom: var(--hd-footnote-bottom, 12px);
    left: var(--hd-footnote-left, 16px);
    font-size: var(--hd-footnote-font-size, var(--hd-page-number-font-size, 9px));
    color: var(--hd-footnote-color, var(--hd-muted-color, #64748b));
    opacity: var(--hd-footnote-opacity, 0.85);
    font-family: var(--hd-body-font, inherit);
    z-index: 10;
    user-select: none;
    line-height: 1.4;
  }
  :host([inline]) {
    position: static;
    display: block;
    margin-top: var(--hd-footnote-inline-margin-top, 8px);
    bottom: auto;
    left: auto;
  }
  @media print {
    :host {
      bottom: var(--hd-footnote-print-bottom, 12px);
      left: var(--hd-footnote-print-left, 16px);
    }
    :host([inline]) {
      position: static;
      margin-top: var(--hd-footnote-inline-margin-top, 8px);
    }
  }
</style>
<slot></slot>
`;

export class HdFootnote extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
