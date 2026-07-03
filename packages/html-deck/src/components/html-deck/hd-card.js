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
          background: var(--hd-card-body-background);
          color: var(--hd-card-body-text-color);
          border-width: var(--hd-card-border-width);
          border-style: var(--hd-card-border-style);
          border-color: var(--hd-card-border-color);
          box-shadow: var(--hd-card-box-shadow);
          overflow: hidden;

          /* Defaults: Inherit from active slide properties */
          --hd-card-heading-background-color: var(--hd-slide-heading-background-color);
          --hd-card-heading-background: var(--hd-slide-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-slide-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-slide-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-slide-heading-text-muted-color);

          --hd-card-body-background: var(--hd-slide-body-background);
          --hd-card-body-text-color: var(--hd-slide-text-color);
          --hd-card-body-text-highlight-color: var(--hd-slide-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-slide-text-muted-color);

          --hd-card-border-color: var(--hd-slide-border-color);

          /* Propagate body highlight and muted text variables to child elements */
          --hd-text-color: var(--hd-card-body-text-color);
          --hd-text-highlight-color: var(--hd-card-body-text-highlight-color);
          --hd-text-muted-color: var(--hd-card-body-text-muted-color);
        }

        /* --- Variant: Base --- */
        :host([variant="base"]) {
          --hd-card-heading-background-color: var(--hd-base-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-base-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-base-solid-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-base-solid-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-base-solid-heading-text-muted-color);

          --hd-card-body-background: var(--hd-base-soft-body-background);
          --hd-card-body-text-color: var(--hd-base-soft-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);

          --hd-card-border-color: var(--hd-base-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="base"]),
        :host([variant="base"][surface="solid"]) {
          --hd-card-heading-background-color: var(--hd-base-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-base-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-body-background: var(--hd-base-solid-body-background);
          --hd-card-body-text-color: var(--hd-base-solid-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
          --hd-card-border-color: var(--hd-base-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="base"]),
        :host([variant="base"][surface="soft"]) {
          --hd-card-heading-background-color: var(--hd-base-soft-heading-background-color);
          --hd-card-heading-background: var(--hd-base-soft-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-base-soft-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-base-soft-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-base-soft-heading-text-muted-color);
          --hd-card-body-background: var(--hd-base-soft-body-background);
          --hd-card-border-color: var(--hd-base-soft-border);
        }

        /* --- Variant: Main --- */
        :host([variant="main"]) {
          --hd-card-heading-background-color: var(--hd-main-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-main-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-main-solid-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-main-solid-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-main-solid-heading-text-muted-color);

          --hd-card-body-background: var(--hd-main-soft-body-background);
          --hd-card-body-text-color: var(--hd-main-soft-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-main-soft-body-text-muted-color);

          --hd-card-border-color: var(--hd-main-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="main"]),
        :host([variant="main"][surface="solid"]) {
          --hd-card-heading-background-color: var(--hd-main-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-main-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-body-background: var(--hd-main-solid-body-background);
          --hd-card-body-text-color: var(--hd-main-solid-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-main-solid-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-main-solid-body-text-muted-color);
          --hd-card-border-color: var(--hd-main-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="main"]),
        :host([variant="main"][surface="soft"]) {
          --hd-card-heading-background-color: var(--hd-main-soft-heading-background-color);
          --hd-card-heading-background: var(--hd-main-soft-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-main-soft-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-main-soft-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-main-soft-heading-text-muted-color);
          --hd-card-body-background: var(--hd-main-soft-body-background);
          --hd-card-border-color: var(--hd-main-soft-border);
        }

        /* --- Variant: Accent --- */
        :host([variant="accent"]) {
          --hd-card-heading-background-color: var(--hd-accent-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-accent-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-accent-solid-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-accent-solid-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-accent-solid-heading-text-muted-color);

          --hd-card-body-background: var(--hd-accent-soft-body-background);
          --hd-card-body-text-color: var(--hd-accent-soft-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-accent-soft-body-text-muted-color);

          --hd-card-border-color: var(--hd-accent-soft-border);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="accent"]),
        :host([variant="accent"][surface="solid"]) {
          --hd-card-heading-background-color: var(--hd-accent-solid-heading-background-color);
          --hd-card-heading-background: var(--hd-accent-solid-heading-background, var(--hd-card-heading-background-color));
          --hd-card-body-background: var(--hd-accent-solid-body-background);
          --hd-card-body-text-color: var(--hd-accent-solid-body-text-color);
          --hd-card-body-text-highlight-color: var(--hd-accent-solid-body-text-highlight-color);
          --hd-card-body-text-muted-color: var(--hd-accent-solid-body-text-muted-color);
          --hd-card-border-color: var(--hd-accent-solid-border);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="accent"]),
        :host([variant="accent"][surface="soft"]) {
          --hd-card-heading-background-color: var(--hd-accent-soft-heading-background-color);
          --hd-card-heading-background: var(--hd-accent-soft-heading-background, var(--hd-card-heading-background-color));
          --hd-card-heading-text-color: var(--hd-accent-soft-heading-text-color);
          --hd-card-heading-text-highlight-color: var(--hd-accent-soft-heading-text-highlight-color);
          --hd-card-heading-text-muted-color: var(--hd-accent-soft-heading-text-muted-color);
          --hd-card-body-background: var(--hd-accent-soft-body-background);
          --hd-card-border-color: var(--hd-accent-soft-border);
        }

        ::slotted([slot="heading"]) {
          display: block !important;
          box-sizing: border-box !important;
          padding: var(--hd-card-padding) !important;
          background: var(--hd-card-heading-background) !important;
          color: var(--hd-card-heading-text-color) !important;
          font-family: var(--hd-text-subheading-font) !important;
          font-size: var(--hd-text-subheading-font-size) !important;
          font-weight: var(--hd-text-subheading-font-weight) !important;
          line-height: var(--hd-text-subheading-line-height) !important;
          letter-spacing: var(--hd-text-subheading-letter-spacing) !important;
          text-transform: var(--hd-text-subheading-text-transform) !important;
          text-shadow: var(--hd-text-subheading-text-shadow) !important;
          margin: 0 !important;
          --hd-text-highlight-color: var(--hd-card-heading-text-highlight-color) !important;
          --hd-text-muted-color: var(--hd-card-heading-text-muted-color) !important;
        }

        .body-container {
          box-sizing: border-box;
          width: 100%;
          flex-grow: 1;
          padding: var(--hd-card-padding);
          border-top: none;
        }

        :host([has-heading]) .body-container {
          border-top: var(--hd-card-border-width) var(--hd-card-border-style) var(--hd-card-border-color);
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
