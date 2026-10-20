export class HdCallout extends HTMLElement {
  static get observedAttributes() {
    return [];
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
          background: var(--hd-callout-body-background);
          color: var(--hd-callout-body-text-color);
          border-width: var(--hd-callout-border-width);
          border-style: var(--hd-callout-border-style);
          border-color: var(--hd-callout-border-color);
          box-shadow: var(--hd-callout-box-shadow);
          text-align: left;

          /* Defaults: Inherit from active slide properties */
          --hd-callout-body-background-color: var(--hd-slide-body-background-color);
          --hd-callout-body-background: var(--hd-slide-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-slide-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-slide-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-slide-body-text-muted-color);

          --hd-callout-border-color: var(--hd-slide-border-color);

          /* Token bridging on :host */
          --hd-background-color: var(--hd-callout-body-background, var(--hd-callout-body-background-color));
          --hd-text-color: var(--hd-callout-body-text-color);
          --hd-text-highlight-color: var(--hd-callout-body-text-highlight-color);
          --hd-text-muted-color: var(--hd-callout-body-text-muted-color);
          --hd-border-color: var(--hd-callout-border-color);
        }

        /* Surface Standalone Selectors */
        :host([surface="soft"]) {
          --hd-callout-body-background-color: var(--hd-base-soft-body-background-color);
          --hd-callout-body-background: var(--hd-base-soft-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-base-soft-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-base-soft-border);
        }
        :host([surface="solid"]) {
          --hd-callout-body-background-color: var(--hd-base-solid-body-background-color);
          --hd-callout-body-background: var(--hd-base-solid-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-base-solid-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
          --hd-callout-border-color: var(--hd-base-solid-border);
        }

        /* --- Variant: Base --- */
        :host([variant="base"]),
        :host([variant="base"][surface="soft"]) {
          --hd-callout-body-background-color: var(--hd-base-soft-body-background-color);
          --hd-callout-body-background: var(--hd-base-soft-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-base-soft-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-base-soft-border);
        }
        :host([variant="base"][surface="solid"]) {
          --hd-callout-body-background-color: var(--hd-base-solid-body-background-color);
          --hd-callout-body-background: var(--hd-base-solid-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-base-solid-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
          --hd-callout-border-color: var(--hd-base-solid-border);
        }

        /* --- Variant: Main --- */
        :host([variant="main"]),
        :host([variant="main"][surface="soft"]) {
          --hd-callout-body-background-color: var(--hd-main-soft-body-background-color);
          --hd-callout-body-background: var(--hd-main-soft-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-main-soft-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-main-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-main-soft-border);
        }
        :host([variant="main"][surface="solid"]) {
          --hd-callout-body-background-color: var(--hd-main-solid-body-background-color);
          --hd-callout-body-background: var(--hd-main-solid-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-main-solid-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-main-solid-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-main-solid-body-text-muted-color);
          --hd-callout-border-color: var(--hd-main-solid-border);
        }

        /* --- Variant: Accent --- */
        :host([variant="accent"]),
        :host([variant="accent"][surface="soft"]) {
          --hd-callout-body-background-color: var(--hd-accent-soft-body-background-color);
          --hd-callout-body-background: var(--hd-accent-soft-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-accent-soft-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-accent-soft-body-text-muted-color);
          --hd-callout-border-color: var(--hd-accent-soft-border);
        }
        :host([variant="accent"][surface="solid"]) {
          --hd-callout-body-background-color: var(--hd-accent-solid-body-background-color);
          --hd-callout-body-background: var(--hd-accent-solid-body-background, var(--hd-callout-body-background-color));
          --hd-callout-body-text-color: var(--hd-accent-solid-body-text-color);
          --hd-callout-body-text-highlight-color: var(--hd-accent-solid-body-text-highlight-color);
          --hd-callout-body-text-muted-color: var(--hd-accent-solid-body-text-muted-color);
          --hd-callout-border-color: var(--hd-accent-solid-border);
        }
      </style>
      <slot></slot>
    `;
  }
}
