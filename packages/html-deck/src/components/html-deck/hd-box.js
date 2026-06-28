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
          background: var(--hd-background-color);
          color: var(--hd-text-color);
          border-width: var(--hd-box-border-width);
          border-style: var(--hd-box-border-style);
          border-color: var(--hd-border-color);
          box-shadow: var(--hd-box-box-shadow);
          overflow: hidden;

          --hd-soft-background-color: var(--hd-base-soft-background-color);
          --hd-soft-text-color: var(--hd-base-soft-text-color);
          --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color);
          --hd-solid-background-color: var(--hd-base-solid-background-color);
          --hd-solid-text-color: var(--hd-base-solid-text-color);
          --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color);
          --hd-background-color: var(--hd-body-background-color);
          --hd-text-color: var(--hd-body-text-color);
          --hd-text-highlight-color: var(--hd-body-text-highlight-color);
          --hd-text-muted-color: var(--hd-body-text-muted-color);
          --hd-border-color: var(--hd-solid-background-color);
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

        /* Surface Overrides */
        :host([surface="soft"]) {
          --hd-solid-background-color: var(--hd-soft-background-color);
          --hd-solid-text-color: var(--hd-soft-text-color);
          --hd-solid-text-highlight-color: var(--hd-soft-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-soft-text-muted-color);
          --hd-border-color: var(--hd-soft-background-color);
        }

        :host([surface="solid"]) {
          --hd-soft-background-color: var(--hd-solid-background-color);
          --hd-soft-text-color: var(--hd-solid-text-color);
          --hd-soft-text-highlight-color: var(--hd-solid-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-solid-text-muted-color);
          --hd-border-color: var(--hd-solid-background-color);
        }

        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-box-padding) !important;
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
