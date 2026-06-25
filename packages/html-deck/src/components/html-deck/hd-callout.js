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
          border-radius: var(--hd-callout-border-radius);
          padding: var(--hd-callout-padding);
          margin-bottom: var(--hd-callout-margin-bottom);
          font-size: var(--hd-callout-font-size);
          background-color: var(--hd-callout-background-color);
          color: var(--hd-callout-text-color);
          border-style: solid;
          border-width: 0 0 0 4px;
          border-color: transparent;
          border-left-color: var(--hd-callout-border-color);
          text-align: left;
        }

        :host([variant="main"]) {
          --hd-callout-background-color: var(--hd-main-color-muted);
          --hd-callout-text-color: var(--hd-main-text-color-muted);
          --hd-callout-border-color: var(--hd-main-text-color-muted);
        }

        :host([variant="accent"]) {
          --hd-callout-background-color: var(--hd-accent-color-muted);
          --hd-callout-text-color: var(--hd-accent-text-color-muted);
          --hd-callout-border-color: var(--hd-accent-text-color-muted);
        }

      </style>
      <slot></slot>
    `;
  }
}
