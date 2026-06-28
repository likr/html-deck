export class HdCard extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'surface'];
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
          align-self: flex-start;
          background: var(--hd-background-color);
          color: var(--hd-text-color);
          border-width: var(--hd-card-border-width);
          border-style: var(--hd-card-border-style);
          border-color: var(--hd-border-color);
          box-shadow: var(--hd-card-box-shadow);
          overflow: hidden;
        }

        /* Variant default / base */
        :host([variant="default"]), :host([variant="base"]) {
          --hd-soft-background-color: var(--hd-base-soft-background-color);
          --hd-soft-text-color: var(--hd-base-soft-text-color);
          --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color);

          --hd-solid-background-color: var(--hd-base-solid-background-color);
          --hd-solid-text-color: var(--hd-base-solid-text-color);
          --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color);
        }

        /* Variant main */
        :host([variant="main"]) {
          --hd-soft-background-color: var(--hd-main-soft-background-color);
          --hd-soft-text-color: var(--hd-main-soft-text-color);
          --hd-soft-text-highlight-color: var(--hd-main-soft-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-main-soft-text-muted-color);

          --hd-solid-background-color: var(--hd-main-solid-background-color);
          --hd-solid-text-color: var(--hd-main-solid-text-color);
          --hd-solid-text-highlight-color: var(--hd-main-solid-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-main-solid-text-muted-color);
        }

        /* Variant accent */
        :host([variant="accent"]) {
          --hd-soft-background-color: var(--hd-accent-soft-background-color);
          --hd-soft-text-color: var(--hd-accent-soft-text-color);
          --hd-soft-text-highlight-color: var(--hd-accent-soft-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-accent-soft-text-muted-color);

          --hd-solid-background-color: var(--hd-accent-solid-background-color);
          --hd-solid-text-color: var(--hd-accent-solid-text-color);
          --hd-solid-text-highlight-color: var(--hd-accent-solid-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-accent-solid-text-muted-color);
        }

        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-card-padding) !important;
          background: var(--hd-heading-background-color) !important;
          color: var(--hd-heading-text-color) !important;
          border-bottom: 1px solid var(--hd-heading-background-color) !important;
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
