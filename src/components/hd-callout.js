const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    border-left: var(--hd-callout-border-width, 3px) solid var(--hd-callout-border-color, var(--hd-primary, #3b82f6));
    padding-left: var(--hd-callout-padding-left, 12px);
    margin-bottom: var(--hd-callout-margin-bottom, 12px);
    text-align: left;
  }
  :host([type="primary"]) {
    --hd-callout-border-color: var(--hd-primary, #3b82f6);
  }
  :host([type="secondary"]) {
    --hd-callout-border-color: var(--hd-secondary, #a855f7);
  }
  :host([type="accent"]) {
    --hd-callout-border-color: var(--hd-accent, #10b981);
  }
  :host([type="danger"]) {
    --hd-callout-border-color: var(--hd-danger, #ef4444);
  }
  :host([type="warning"]) {
    --hd-callout-border-color: var(--hd-warning, #f59e0b);
  }
</style>
<slot></slot>
`;

export class HdCallout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
