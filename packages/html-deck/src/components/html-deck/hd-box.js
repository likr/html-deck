export class HdBox extends HTMLElement {
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
          border-radius: var(--hd-box-border-radius);
          margin-bottom: var(--hd-box-margin-bottom);
          font-size: var(--hd-box-font-size);
          height: 100%;
          background-color: var(--hd-box-background-color);
          color: var(--hd-box-text-color);
          border-width: var(--hd-box-border-width);
          border-style: var(--hd-box-border-style);
          border-color: var(--hd-box-border-color);
          box-shadow: var(--hd-box-box-shadow);
          overflow: hidden;

          /* Explicit defaults */
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Default theme with surface overrides */
        :host([surface="soft"]) {
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-soft-background-color);
          --hd-box-heading-background-color: var(--hd-base-soft-background-color);
          --hd-box-heading-text-color: var(--hd-base-soft-text-color);
          --hd-box-heading-border-color: var(--hd-base-soft-background-color);
        }

        :host([surface="solid"]) {
          --hd-box-background-color: var(--hd-base-solid-background-color);
          --hd-box-text-color: var(--hd-base-solid-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant default */
        :host([variant="default"]) {
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }
        :host([variant="default"][surface="soft"]) {
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-soft-background-color);
          --hd-box-heading-background-color: var(--hd-base-soft-background-color);
          --hd-box-heading-text-color: var(--hd-base-soft-text-color);
          --hd-box-heading-border-color: var(--hd-base-soft-background-color);
        }
        :host([variant="default"][surface="solid"]) {
          --hd-box-background-color: var(--hd-base-solid-background-color);
          --hd-box-text-color: var(--hd-base-solid-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant base */
        :host([variant="base"]) {
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }
        :host([variant="base"][surface="soft"]) {
          --hd-box-background-color: var(--hd-base-soft-background-color);
          --hd-box-text-color: var(--hd-base-soft-text-color);
          --hd-box-border-color: var(--hd-base-soft-background-color);
          --hd-box-heading-background-color: var(--hd-base-soft-background-color);
          --hd-box-heading-text-color: var(--hd-base-soft-text-color);
          --hd-box-heading-border-color: var(--hd-base-soft-background-color);
        }
        :host([variant="base"][surface="solid"]) {
          --hd-box-background-color: var(--hd-base-solid-background-color);
          --hd-box-text-color: var(--hd-base-solid-text-color);
          --hd-box-border-color: var(--hd-base-solid-background-color);
          --hd-box-heading-background-color: var(--hd-base-solid-background-color);
          --hd-box-heading-text-color: var(--hd-base-solid-text-color);
          --hd-box-heading-border-color: var(--hd-base-solid-background-color);
        }

        /* Variant main */
        :host([variant="main"]) {
          --hd-box-background-color: var(--hd-main-soft-background-color);
          --hd-box-text-color: var(--hd-main-soft-text-color);
          --hd-box-border-color: var(--hd-main-solid-background-color);
          --hd-box-heading-background-color: var(--hd-main-solid-background-color);
          --hd-box-heading-text-color: var(--hd-main-solid-text-color);
          --hd-box-heading-border-color: var(--hd-main-solid-background-color);
        }
        :host([variant="main"][surface="soft"]) {
          --hd-box-background-color: var(--hd-main-soft-background-color);
          --hd-box-text-color: var(--hd-main-soft-text-color);
          --hd-box-border-color: var(--hd-main-soft-background-color);
          --hd-box-heading-background-color: var(--hd-main-soft-background-color);
          --hd-box-heading-text-color: var(--hd-main-soft-text-color);
          --hd-box-heading-border-color: var(--hd-main-soft-background-color);
        }
        :host([variant="main"][surface="solid"]) {
          --hd-box-background-color: var(--hd-main-solid-background-color);
          --hd-box-text-color: var(--hd-main-solid-text-color);
          --hd-box-border-color: var(--hd-main-solid-background-color);
          --hd-box-heading-background-color: var(--hd-main-solid-background-color);
          --hd-box-heading-text-color: var(--hd-main-solid-text-color);
          --hd-box-heading-border-color: var(--hd-main-solid-background-color);
        }

        /* Variant accent */
        :host([variant="accent"]) {
          --hd-box-background-color: var(--hd-accent-soft-background-color);
          --hd-box-text-color: var(--hd-accent-soft-text-color);
          --hd-box-border-color: var(--hd-accent-solid-background-color);
          --hd-box-heading-background-color: var(--hd-accent-solid-background-color);
          --hd-box-heading-text-color: var(--hd-accent-solid-text-color);
          --hd-box-heading-border-color: var(--hd-accent-solid-background-color);
        }
        :host([variant="accent"][surface="soft"]) {
          --hd-box-background-color: var(--hd-accent-soft-background-color);
          --hd-box-text-color: var(--hd-accent-soft-text-color);
          --hd-box-border-color: var(--hd-accent-soft-background-color);
          --hd-box-heading-background-color: var(--hd-accent-soft-background-color);
          --hd-box-heading-text-color: var(--hd-accent-soft-text-color);
          --hd-box-heading-border-color: var(--hd-accent-soft-background-color);
        }
        :host([variant="accent"][surface="solid"]) {
          --hd-box-background-color: var(--hd-accent-solid-background-color);
          --hd-box-text-color: var(--hd-accent-solid-text-color);
          --hd-box-border-color: var(--hd-accent-solid-background-color);
          --hd-box-heading-background-color: var(--hd-accent-solid-background-color);
          --hd-box-heading-text-color: var(--hd-accent-solid-text-color);
          --hd-box-heading-border-color: var(--hd-accent-solid-background-color);
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
