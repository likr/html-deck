export class HdCallout extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'surface'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          border-radius: var(--hd-callout-border-radius);
          padding: var(--hd-callout-padding);
          margin-bottom: var(--hd-callout-margin-bottom);
          font-size: var(--hd-callout-font-size);
          background: var(--hd-callout-background);
          color: var(--hd-callout-text-color);
          border-width: var(--hd-callout-border-width);
          border-style: var(--hd-callout-border-style);
          border-color: var(--hd-callout-border-color);
          box-shadow: var(--hd-callout-box-shadow);
          text-align: left;

          /* Defaults: Inherit from active slide properties */
          --hd-callout-heading-background-color: var(--hd-slide-heading-background-color);
          --hd-callout-heading-background: var(--hd-slide-heading-background, var(--hd-callout-heading-background-color));
          --hd-callout-background: var(--hd-slide-body-background);
          --hd-callout-text-color: var(--hd-slide-text-color);
          --hd-callout-text-highlight-color: var(--hd-slide-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-slide-text-muted-color);
          --hd-callout-border-color: var(--hd-callout-heading-background);

          /* Propagate highlight and muted variables */
          --hd-text-color: var(--hd-callout-text-color);
          --hd-text-highlight-color: var(--hd-callout-text-highlight-color);
          --hd-text-muted-color: var(--hd-callout-text-muted-color);
        }

        /* --- Variant: Base --- */
        :host([variant="base"]) {
          --hd-callout-heading-background-color: var(--hd-base-solid-heading-background-color);
          --hd-callout-heading-background: var(--hd-base-solid-heading-background, var(--hd-callout-heading-background-color));
          --hd-callout-background: var(--hd-base-soft-body-background);
          --hd-callout-text-color: var(--hd-base-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-base-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-callout-heading-background);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="base"]),
        :host([variant="base"][surface="solid"]) {
          --hd-callout-background: var(--hd-base-solid-body-background);
          --hd-callout-text-color: var(--hd-base-solid-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-base-solid-body-text-muted-color);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="base"]),
        :host([variant="base"][surface="soft"]) {
          --hd-callout-background: var(--hd-base-soft-body-background);
          --hd-callout-text-color: var(--hd-base-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-base-soft-body-text-muted-color);
        }

        /* --- Variant: Main --- */
        :host([variant="main"]) {
          --hd-callout-heading-background-color: var(--hd-main-solid-heading-background-color);
          --hd-callout-heading-background: var(--hd-main-solid-heading-background, var(--hd-callout-heading-background-color));
          --hd-callout-background: var(--hd-main-soft-body-background);
          --hd-callout-text-color: var(--hd-main-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-main-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-callout-heading-background);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="main"]),
        :host([variant="main"][surface="solid"]) {
          --hd-callout-background: var(--hd-main-solid-body-background);
          --hd-callout-text-color: var(--hd-main-solid-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-main-solid-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-main-solid-body-text-muted-color);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="main"]),
        :host([variant="main"][surface="soft"]) {
          --hd-callout-background: var(--hd-main-soft-body-background);
          --hd-callout-text-color: var(--hd-main-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-main-soft-body-text-muted-color);
        }

        /* --- Variant: Accent --- */
        :host([variant="accent"]) {
          --hd-callout-heading-background-color: var(--hd-accent-solid-heading-background-color);
          --hd-callout-heading-background: var(--hd-accent-solid-heading-background, var(--hd-callout-heading-background-color));
          --hd-callout-background: var(--hd-accent-soft-body-background);
          --hd-callout-text-color: var(--hd-accent-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-accent-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-callout-heading-background);
        }
        :host-context(hd-slide[surface="solid"]):host([variant="accent"]),
        :host([variant="accent"][surface="solid"]) {
          --hd-callout-background: var(--hd-accent-solid-body-background);
          --hd-callout-text-color: var(--hd-accent-solid-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-accent-solid-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-accent-solid-body-text-muted-color);
        }
        :host-context(hd-slide[surface="soft"]):host([variant="accent"]),
        :host([variant="accent"][surface="soft"]) {
          --hd-callout-background: var(--hd-accent-soft-body-background);
          --hd-callout-text-color: var(--hd-accent-soft-body-text-color);
          --hd-callout-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
          --hd-callout-text-muted-color: var(--hd-accent-soft-body-text-muted-color);
        }
      </style>
      <slot></slot>
    `;
  }
}
