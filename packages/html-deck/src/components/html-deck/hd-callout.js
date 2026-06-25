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
          border-width: var(--hd-callout-border-width);
          border-style: var(--hd-callout-border-style);
          border-color: var(--hd-callout-border-color);
          box-shadow: var(--hd-callout-box-shadow);
          text-align: left;
        }

        :host([variant="main"]) {
          --hd-callout-background-color: var(--hd-main-soft-background-color);
          --hd-callout-text-color: var(--hd-main-soft-text-color);
          --hd-callout-border-color: var(--hd-main-solid-background-color);
        }

        :host([variant="accent"]) {
          --hd-callout-background-color: var(--hd-accent-soft-background-color);
          --hd-callout-text-color: var(--hd-accent-soft-text-color);
          --hd-callout-border-color: var(--hd-accent-solid-background-color);
        }

      </style>
      <slot></slot>
    `;
  }
}
