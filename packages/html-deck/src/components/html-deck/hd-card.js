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
          margin-bottom: var(--hd-card-margin-bottom);
          font-size: var(--hd-card-font-size);
          height: auto;
          background-color: var(--hd-card-background-color);
          color: var(--hd-card-text-color);
          border: 1px solid var(--hd-card-border-color);
          overflow: hidden;
        }

        :host([variant="main"]) {
          --hd-card-background-color: var(--hd-main-color-muted);
          --hd-card-text-color: var(--hd-main-text-color-muted);
          --hd-card-border-color: var(--hd-main-text-color-muted);
          --hd-card-heading-background-color: var(--hd-main-color);
          --hd-card-heading-text-color: var(--hd-main-text-color);
          --hd-card-heading-border-color: var(--hd-main-text-color-muted);
        }

        :host([variant="accent"]) {
          --hd-card-background-color: var(--hd-accent-color-muted);
          --hd-card-text-color: var(--hd-accent-text-color-muted);
          --hd-card-border-color: var(--hd-accent-text-color-muted);
          --hd-card-heading-background-color: var(--hd-accent-color);
          --hd-card-heading-text-color: var(--hd-accent-text-color);
          --hd-card-heading-border-color: var(--hd-accent-text-color-muted);
        }


        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-card-padding) !important;
          background-color: var(--hd-card-heading-background-color) !important;
          color: var(--hd-card-heading-text-color) !important;
          border-bottom: 1px solid var(--hd-card-heading-border-color) !important;
          font-family: var(--hd-text-subheading-font) !important;
          font-size: var(--hd-text-subheading-font-size) !important;
          font-weight: var(--hd-text-subheading-font-weight) !important;
          line-height: var(--hd-text-subheading-line-height) !important;
          letter-spacing: var(--hd-text-subheading-letter-spacing) !important;
          text-transform: var(--hd-text-subheading-text-transform) !important;
          text-shadow: var(--hd-text-subheading-text-shadow) !important;
          margin: 0 !important;
        }

        .body-container {
          box-sizing: border-box;
          width: 100%;
          flex-grow: 1;
          padding: var(--hd-card-padding);
        }
      </style>
      <slot name="heading"></slot>
      <div class="body-container">
        <slot></slot>
      </div>
    `;
  }
}
