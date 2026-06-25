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
          border-radius: var(--hd-card-border-radius);
          padding: var(--hd-card-padding);
          margin-bottom: var(--hd-card-margin-bottom);
          font-size: var(--hd-card-font-size);
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

        ::slotted([slot="heading"]) {
          display: block !important;
          font-family: var(--hd-text-subheading-font) !important;
          color: var(--hd-text-subheading-color) !important;
          font-size: var(--hd-text-subheading-font-size) !important;
          font-weight: var(--hd-text-subheading-font-weight) !important;
          line-height: var(--hd-text-subheading-line-height) !important;
          letter-spacing: var(--hd-text-subheading-letter-spacing) !important;
          text-transform: var(--hd-text-subheading-text-transform) !important;
          text-shadow: var(--hd-text-subheading-text-shadow) !important;
          margin: 0 0 var(--hd-gap-2) 0 !important;
        }

        :host([variant="main"]) ::slotted([slot="heading"]) {
          color: var(--hd-main-text-color-muted) !important;
        }

        :host([variant="accent"]) ::slotted([slot="heading"]) {
          color: var(--hd-accent-text-color-muted) !important;
        }

        .body-container {
          width: 100%;
          flex-grow: 1;
        }
      </style>
      <slot name="heading"></slot>
      <div class="body-container">
        <slot></slot>
      </div>
    `;
  }
}
