export class HdCard extends HTMLElement {
  static get observedAttributes() {
    return ['variant'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: var(--hd-card-border-radius, 8px);
          padding: var(--hd-card-padding, 16px);
          margin-bottom: var(--hd-card-margin-bottom, 16px);
          height: auto;
          background-color: var(--hd-base-color-muted);
          color: var(--hd-base-text-color);
          border: 1px solid var(--hd-base-text-color-muted);
        }

        :host([variant="main"]) {
          background-color: var(--hd-main-color-muted);
          color: var(--hd-main-text-color-muted);
          border: 1px solid var(--hd-main-color);
        }

        :host([variant="accent"]) {
          background-color: var(--hd-accent-color-muted);
          color: var(--hd-accent-text-color-muted);
          border: 1px solid var(--hd-accent-color);
        }

        .heading-container {
          margin-bottom: var(--hd-gap-2, 8px);
          width: 100%;
        }

        .heading-container:not(:has(slot[name="heading"]::slotted(*))) {
          display: none;
        }

        .heading-container ::slotted(*) {
          font-family: var(--hd-text-subheading-font) !important;
          color: var(--hd-text-subheading-color) !important;
          font-size: var(--hd-text-subheading-font-size) !important;
          font-weight: var(--hd-text-subheading-font-weight) !important;
          line-height: var(--hd-text-subheading-line-height) !important;
          letter-spacing: var(--hd-text-subheading-letter-spacing) !important;
          text-transform: var(--hd-text-subheading-text-transform) !important;
          text-shadow: var(--hd-text-subheading-text-shadow) !important;
          margin: 0 !important;
        }

        :host([variant="main"]) .heading-container ::slotted(*) {
          color: var(--hd-main-text-color-muted) !important;
        }

        :host([variant="accent"]) .heading-container ::slotted(*) {
          color: var(--hd-accent-text-color-muted) !important;
        }

        .body-container {
          width: 100%;
          flex-grow: 1;
        }
      </style>
      <div class="heading-container">
        <slot name="heading"></slot>
      </div>
      <div class="body-container">
        <slot></slot>
      </div>
    `;
  }
}
