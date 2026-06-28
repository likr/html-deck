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
          background: var(--hd-background-color);
          color: var(--hd-text-color);
          border-width: var(--hd-callout-border-width);
          border-style: var(--hd-callout-border-style);
          border-color: var(--hd-border-color);
          box-shadow: var(--hd-callout-box-shadow);
          text-align: left;

          --hd-background-color: var(--hd-body-background-color);
          --hd-text-color: var(--hd-body-text-color);
          --hd-text-highlight-color: var(--hd-body-text-highlight-color);
          --hd-text-muted-color: var(--hd-body-text-muted-color);
        }

        /* Variant base */
        :host([variant="base"]) {
          --hd-soft-background-color: var(--hd-base-soft-background-color);
          --hd-soft-text-color: var(--hd-base-soft-text-color);
          --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color);
          --hd-solid-background-color: var(--hd-base-solid-background-color);
          --hd-solid-text-color: var(--hd-base-solid-text-color);
          --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color);
          --hd-border-color: var(--hd-border-color-default);
        }

        :host([variant="base"][inverted]) {
          --hd-soft-background-color: var(--hd-base-soft-background-color-inverted);
          --hd-soft-text-color: var(--hd-base-soft-text-color-inverted);
          --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color-inverted);
          --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color-inverted);
          --hd-solid-background-color: var(--hd-base-solid-background-color-inverted);
          --hd-solid-text-color: var(--hd-base-solid-text-color-inverted);
          --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color-inverted);
          --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color-inverted);
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
          --hd-border-color: var(--hd-border-color-default);
        }

        :host([variant="main"][inverted]) {
          --hd-soft-background-color: var(--hd-main-soft-background-color-inverted);
          --hd-soft-text-color: var(--hd-main-soft-text-color-inverted);
          --hd-soft-text-highlight-color: var(--hd-main-soft-text-highlight-color-inverted);
          --hd-soft-text-muted-color: var(--hd-main-soft-text-muted-color-inverted);
          --hd-solid-background-color: var(--hd-main-solid-background-color-inverted);
          --hd-solid-text-color: var(--hd-main-solid-text-color-inverted);
          --hd-solid-text-highlight-color: var(--hd-main-solid-text-highlight-color-inverted);
          --hd-solid-text-muted-color: var(--hd-main-solid-text-muted-color-inverted);
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
          --hd-border-color: var(--hd-border-color-default);
        }

        :host([variant="accent"][inverted]) {
          --hd-soft-background-color: var(--hd-accent-soft-background-color-inverted);
          --hd-soft-text-color: var(--hd-accent-soft-text-color-inverted);
          --hd-soft-text-highlight-color: var(--hd-accent-soft-text-highlight-color-inverted);
          --hd-soft-text-muted-color: var(--hd-accent-soft-text-muted-color-inverted);
          --hd-solid-background-color: var(--hd-accent-solid-background-color-inverted);
          --hd-solid-text-color: var(--hd-accent-solid-text-color-inverted);
          --hd-solid-text-highlight-color: var(--hd-accent-solid-text-highlight-color-inverted);
          --hd-solid-text-muted-color: var(--hd-accent-solid-text-muted-color-inverted);
        }

        /* Surface Overrides */
        :host([surface="soft"]) {
          --hd-solid-background-color: var(--hd-soft-background-color);
          --hd-solid-text-color: var(--hd-soft-text-color);
          --hd-solid-text-highlight-color: var(--hd-soft-text-highlight-color);
          --hd-solid-text-muted-color: var(--hd-soft-text-muted-color);
          --hd-border-color: var(--hd-border-color-surfaced);
        }

        :host([surface="solid"]) {
          --hd-soft-background-color: var(--hd-solid-background-color);
          --hd-soft-text-color: var(--hd-solid-text-color);
          --hd-soft-text-highlight-color: var(--hd-solid-text-highlight-color);
          --hd-soft-text-muted-color: var(--hd-solid-text-muted-color);
          --hd-border-color: var(--hd-border-color-surfaced);
        }
      </style>
      <slot></slot>
    `;
  }
}
