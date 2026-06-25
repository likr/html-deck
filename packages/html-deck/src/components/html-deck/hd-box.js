export class HdBox extends HTMLElement {
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
          border-radius: var(--hd-box-border-radius);
          margin-bottom: var(--hd-box-margin-bottom);
          font-size: var(--hd-box-font-size);
          height: 100%;
          background-color: var(--hd-box-background-color);
          color: var(--hd-box-text-color);
          border: 1px solid var(--hd-box-border-color);
          overflow: hidden;
        }

        :host([variant="main"]) {
          --hd-box-background-color: var(--hd-main-color-muted);
          --hd-box-text-color: var(--hd-main-text-color-muted);
          --hd-box-border-color: var(--hd-main-text-color-muted);
          --hd-box-heading-background-color: var(--hd-main-color);
          --hd-box-heading-text-color: var(--hd-main-text-color);
          --hd-box-heading-border-color: var(--hd-main-text-color-muted);
        }

        :host([variant="accent"]) {
          --hd-box-background-color: var(--hd-accent-color-muted);
          --hd-box-text-color: var(--hd-accent-text-color-muted);
          --hd-box-border-color: var(--hd-accent-text-color-muted);
          --hd-box-heading-background-color: var(--hd-accent-color);
          --hd-box-heading-text-color: var(--hd-accent-text-color);
          --hd-box-heading-border-color: var(--hd-accent-text-color-muted);
        }


        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-box-padding) !important;
          background-color: var(--hd-box-heading-background-color) !important;
          color: var(--hd-box-heading-text-color) !important;
          border-bottom: 1px solid var(--hd-box-heading-border-color) !important;
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
          padding: var(--hd-box-padding);
        }
      </style>
      <slot name="heading"></slot>
      <div class="body-container">
        <slot></slot>
      </div>
    `;
  }
}
