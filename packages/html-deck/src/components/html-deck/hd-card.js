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
          background: var(--hd-card-background-color);
          color: var(--hd-card-text-color);
          border-width: var(--hd-card-border-width);
          border-style: var(--hd-card-border-style);
          border-color: var(--hd-card-border-color);
          box-shadow: var(--hd-card-box-shadow);
          overflow: hidden;

          /* Explicit defaults */
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Default theme with surface overrides */
        :host([surface="soft"]) {
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-soft-background-color);
          --hd-card-heading-background-color: var(--hd-base-soft-background-color);
          --hd-card-heading-text-color: var(--hd-base-soft-text-color);
          --hd-card-heading-border-color: var(--hd-base-soft-background-color);
        }

        :host([surface="solid"]) {
          --hd-card-background-color: var(--hd-base-solid-background-color);
          --hd-card-text-color: var(--hd-base-solid-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant default */
        :host([variant="default"]) {
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }
        :host([variant="default"][surface="soft"]) {
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-soft-background-color);
          --hd-card-heading-background-color: var(--hd-base-soft-background-color);
          --hd-card-heading-text-color: var(--hd-base-soft-text-color);
          --hd-card-heading-border-color: var(--hd-base-soft-background-color);
        }
        :host([variant="default"][surface="solid"]) {
          --hd-card-background-color: var(--hd-base-solid-background-color);
          --hd-card-text-color: var(--hd-base-solid-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant base */
        :host([variant="base"]) {
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }
        :host([variant="base"][surface="soft"]) {
          --hd-card-background-color: var(--hd-base-soft-background-color);
          --hd-card-text-color: var(--hd-base-soft-text-color);
          --hd-card-border-color: var(--hd-base-soft-background-color);
          --hd-card-heading-background-color: var(--hd-base-soft-background-color);
          --hd-card-heading-text-color: var(--hd-base-soft-text-color);
          --hd-card-heading-border-color: var(--hd-base-soft-background-color);
        }
        :host([variant="base"][surface="solid"]) {
          --hd-card-background-color: var(--hd-base-solid-background-color);
          --hd-card-text-color: var(--hd-base-solid-text-color);
          --hd-card-border-color: var(--hd-base-solid-background-color);
          --hd-card-heading-background-color: var(--hd-base-solid-background-color);
          --hd-card-heading-text-color: var(--hd-base-solid-text-color);
          --hd-card-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant main */
        :host([variant="main"]) {
          --hd-card-background-color: var(--hd-main-soft-background-color);
          --hd-card-text-color: var(--hd-main-soft-text-color);
          --hd-card-border-color: var(--hd-main-solid-background-color);
          --hd-card-heading-background-color: var(--hd-main-solid-background-color);
          --hd-card-heading-text-color: var(--hd-main-solid-text-color);
          --hd-card-heading-border-color: var(--hd-main-solid-background-color);
        }
        :host([variant="main"][surface="soft"]) {
          --hd-card-background-color: var(--hd-main-soft-background-color);
          --hd-card-text-color: var(--hd-main-soft-text-color);
          --hd-card-border-color: var(--hd-main-soft-background-color);
          --hd-card-heading-background-color: var(--hd-main-soft-background-color);
          --hd-card-heading-text-color: var(--hd-main-soft-text-color);
          --hd-card-heading-border-color: var(--hd-main-soft-background-color);
        }
        :host([variant="main"][surface="solid"]) {
          --hd-card-background-color: var(--hd-main-solid-background-color);
          --hd-card-text-color: var(--hd-main-solid-text-color);
          --hd-card-border-color: var(--hd-main-solid-background-color);
          --hd-card-heading-background-color: var(--hd-main-solid-background-color);
          --hd-card-heading-text-color: var(--hd-main-solid-text-color);
          --hd-card-heading-border-color: var(--hd-main-solid-background-color);
        }

        /* Variant accent */
        :host([variant="accent"]) {
          --hd-card-background-color: var(--hd-accent-soft-background-color);
          --hd-card-text-color: var(--hd-accent-soft-text-color);
          --hd-card-border-color: var(--hd-accent-solid-background-color);
          --hd-card-heading-background-color: var(--hd-accent-solid-background-color);
          --hd-card-heading-text-color: var(--hd-accent-solid-text-color);
          --hd-card-heading-border-color: var(--hd-accent-solid-background-color);
        }
        :host([variant="accent"][surface="soft"]) {
          --hd-card-background-color: var(--hd-accent-soft-background-color);
          --hd-card-text-color: var(--hd-accent-soft-text-color);
          --hd-card-border-color: var(--hd-accent-soft-background-color);
          --hd-card-heading-background-color: var(--hd-accent-soft-background-color);
          --hd-card-heading-text-color: var(--hd-accent-soft-text-color);
          --hd-card-heading-border-color: var(--hd-accent-soft-background-color);
        }
        :host([variant="accent"][surface="solid"]) {
          --hd-card-background-color: var(--hd-accent-solid-background-color);
          --hd-card-text-color: var(--hd-accent-solid-text-color);
          --hd-card-border-color: var(--hd-accent-solid-background-color);
          --hd-card-heading-background-color: var(--hd-accent-solid-background-color);
          --hd-card-heading-text-color: var(--hd-accent-solid-text-color);
          --hd-card-heading-border-color: var(--hd-accent-solid-background-color);
        }


        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-card-padding) !important;
          background: var(--hd-card-heading-background-color) !important;
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
