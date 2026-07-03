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
          background: var(--hd-box-body-background);
          color: var(--hd-box-body-text-color);
          border-width: var(--hd-box-border-width);
          border-style: var(--hd-box-border-style);
          border-color: var(--hd-box-border-color);
          box-shadow: var(--hd-box-box-shadow);
          overflow: hidden;

          /* Defaults: Inherit from active slide properties */
          --hd-box-heading-background-color: var(--hd-slide-heading-background-color);
          --hd-box-heading-background: var(--hd-slide-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-slide-heading-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-slide-heading-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-slide-heading-text-muted-color);

          --hd-box-body-background: var(--hd-slide-body-background);
          --hd-box-body-text-color: var(--hd-slide-text-color);
          --hd-box-body-text-highlight-color: var(--hd-slide-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-slide-text-muted-color);

          --hd-box-border-color: var(--hd-slide-border-color);

          /* Propagate body highlight and muted text variables to child elements */
          --hd-text-color: var(--hd-box-body-text-color);
          --hd-text-highlight-color: var(--hd-box-body-text-highlight-color);
          --hd-text-muted-color: var(--hd-box-body-text-muted-color);
        }

        /* --- Variant: Base --- */
        :host([variant="base"]) {
          --hd-box-heading-background-color: var(--hd-base-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-base-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-base-solid-heading-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-base-solid-heading-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-base-solid-heading-text-muted-color);

          --hd-box-body-background: var(--hd-base-soft-body-background);
          --hd-box-body-text-color: var(--hd-base-soft-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);

          --hd-box-border-color: var(--hd-base-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="base"]),
        :host([variant="base"][surface="solid"]) {
          --hd-box-heading-background-color: var(--hd-base-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-base-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-body-background: var(--hd-base-solid-body-background);
          --hd-box-body-text-color: var(--hd-base-solid-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
          --hd-box-border-color: var(--hd-base-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="base"]),
        :host([variant="base"][surface="soft"]) {
          --hd-box-heading-background-color: var(--hd-base-soft-heading-background-color);
          --hd-box-heading-background: var(--hd-base-soft-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-base-soft-heading-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-base-soft-heading-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-base-soft-heading-text-muted-color);
          --hd-box-body-background: var(--hd-base-soft-body-background);
          --hd-box-border-color: var(--hd-base-soft-border);
        }

        /* --- Variant: Main --- */
        :host([variant="main"]) {
          --hd-box-heading-background-color: var(--hd-main-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-main-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-main-solid-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-main-solid-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-main-solid-text-muted-color);

          --hd-box-body-background: var(--hd-main-soft-body-background);
          --hd-box-body-text-color: var(--hd-main-soft-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-main-soft-body-text-muted-color);

          --hd-box-border-color: var(--hd-main-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="main"]),
        :host([variant="main"][surface="solid"]) {
          --hd-box-heading-background-color: var(--hd-main-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-main-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-body-background: var(--hd-main-solid-body-background);
          --hd-box-body-text-color: var(--hd-main-solid-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-main-solid-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-main-solid-body-text-muted-color);
          --hd-box-border-color: var(--hd-main-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="main"]),
        :host([variant="main"][surface="soft"]) {
          --hd-box-heading-background-color: var(--hd-main-soft-heading-background-color);
          --hd-box-heading-background: var(--hd-main-soft-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-main-soft-heading-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-main-soft-heading-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-main-soft-heading-text-muted-color);
          --hd-box-body-background: var(--hd-main-soft-body-background);
          --hd-box-border-color: var(--hd-main-soft-border);
        }

        /* --- Variant: Accent --- */
        :host([variant="accent"]) {
          --hd-box-heading-background-color: var(--hd-accent-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-accent-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-accent-solid-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-accent-solid-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-accent-solid-text-muted-color);

          --hd-box-body-background: var(--hd-accent-soft-body-background);
          --hd-box-body-text-color: var(--hd-accent-soft-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-accent-soft-body-text-muted-color);

          --hd-box-border-color: var(--hd-accent-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="accent"]),
        :host([variant="accent"][surface="solid"]) {
          --hd-box-heading-background-color: var(--hd-accent-solid-heading-background-color);
          --hd-box-heading-background: var(--hd-accent-solid-heading-background, var(--hd-box-heading-background-color));
          --hd-box-body-background: var(--hd-accent-solid-body-background);
          --hd-box-body-text-color: var(--hd-accent-solid-body-text-color);
          --hd-box-body-text-highlight-color: var(--hd-accent-solid-body-text-highlight-color);
          --hd-box-body-text-muted-color: var(--hd-accent-solid-body-text-muted-color);
          --hd-box-border-color: var(--hd-accent-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="accent"]),
        :host([variant="accent"][surface="soft"]) {
          --hd-box-heading-background-color: var(--hd-accent-soft-heading-background-color);
          --hd-box-heading-background: var(--hd-accent-soft-heading-background, var(--hd-box-heading-background-color));
          --hd-box-heading-text-color: var(--hd-accent-soft-heading-text-color);
          --hd-box-heading-text-highlight-color: var(--hd-accent-soft-heading-text-highlight-color);
          --hd-box-heading-text-muted-color: var(--hd-accent-soft-heading-text-muted-color);
          --hd-box-body-background: var(--hd-accent-soft-body-background);
          --hd-box-border-color: var(--hd-accent-soft-border);
        }

        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-box-padding) !important;
          background: var(--hd-box-heading-background) !important;
          color: var(--hd-box-heading-text-color) !important;
          font-family: var(--hd-text-subheading-font) !important;
          font-size: var(--hd-text-subheading-font-size) !important;
          font-weight: var(--hd-text-subheading-font-weight) !important;
          line-height: var(--hd-text-subheading-line-height) !important;
          letter-spacing: var(--hd-text-subheading-letter-spacing) !important;
          text-transform: var(--hd-text-subheading-text-transform) !important;
          text-shadow: var(--hd-text-subheading-text-shadow) !important;
          margin: 0 !important;
          --hd-text-highlight-color: var(--hd-box-heading-text-highlight-color) !important;
          --hd-text-muted-color: var(--hd-box-heading-text-muted-color) !important;
        }

        .body-container {
          box-sizing: border-box;
          width: 100%;
          flex-grow: 1;
          padding: var(--hd-box-padding);
          border-top: none;
        }

        :host([has-heading]) .body-container {
          border-top: var(--hd-box-border-width) var(--hd-box-border-style) var(--hd-box-border-color) !important;
        }
      </style>
      <slot name="heading"></slot>
      <div class="body-container">
        <slot></slot>
      </div>
    `;

    // Set up slotchange listener to toggle has-heading host attribute
    const headingSlot = this.shadowRoot.querySelector('slot[name="heading"]');
    if (headingSlot) {
      const updateHeading = () => {
        const hasHeading = headingSlot.assignedElements().length > 0;
        if (hasHeading) {
          this.setAttribute('has-heading', '');
        } else {
          this.removeAttribute('has-heading');
        }
      };
      headingSlot.addEventListener('slotchange', updateHeading);
      updateHeading();
    }
  }
}
