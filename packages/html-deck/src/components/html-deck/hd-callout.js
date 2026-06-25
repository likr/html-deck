export class HdCallout extends HTMLElement {
  static get observedAttributes() {
    return ['variant'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          border-radius: var(--hd-callout-border-radius, 4px);
          padding: 12px 16px;
          padding-left: var(--hd-callout-padding-left, 12px);
          margin-bottom: var(--hd-callout-margin-bottom, 12px);
          background-color: var(--hd-base-color-muted);
          color: var(--hd-base-text-color);
          border-style: solid;
          border-width: 0 0 0 4px;
          border-color: transparent;
          border-left-color: var(--hd-base-text-color-muted);
          text-align: left;
        }

        :host([variant="main"]) {
          background-color: var(--hd-main-color-muted);
          color: var(--hd-main-text-color-muted);
          border-left-color: var(--hd-main-color);
        }

        :host([variant="accent"]) {
          background-color: var(--hd-accent-color-muted);
          color: var(--hd-accent-text-color-muted);
          border-left-color: var(--hd-accent-color);
        }
      </style>
      <slot></slot>
    `;
  }
}
