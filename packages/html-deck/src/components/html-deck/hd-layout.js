export class HdLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        .heading-area {
          display: none;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          padding: var(--hd-layout-heading-padding);
          background-color: var(--hd-layout-heading-background-color);
          color: var(--hd-layout-heading-text-color);
          box-shadow: var(--hd-layout-heading-box-shadow, none);
          text-align: var(--hd-layout-heading-text-align, left);
        }
        :host([has-heading]) .heading-area {
          display: flex;
        }
        .heading-divider {
          display: none;
          border: none;
          height: var(--hd-layout-heading-divider-height, 1px);
          background-color: var(--hd-slide-border-color);
          box-shadow: var(--hd-layout-heading-divider-box-shadow, none);
          margin: 0;
          width: 100%;
        }
        :host([has-heading]) .heading-divider {
          display: var(--hd-layout-heading-divider-display, none);
        }
        .layout-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          width: 100%;
          box-sizing: border-box;
          padding: var(--hd-layout-body-padding);
          padding-top: var(--hd-slide-margin-top);
        }
        :host([has-heading]) .layout-content {
          padding-top: var(--hd-gap-3);
        }
        .heading-area ::slotted(*) {
          font-family: var(--hd-text-heading-font);
          font-size: var(--hd-text-heading-font-size);
          color: var(--hd-layout-heading-text-color);
          text-shadow: var(--hd-layout-heading-text-shadow, none);
          margin: 0;
        }
        ::slotted([slot="before"]) {
          margin-bottom: var(--hd-layout-before-margin) !important;
        }
        ::slotted([slot="after"]) {
          margin-top: var(--hd-layout-after-margin) !important;
        }
        .body-area {
          flex-grow: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
        }
      </style>
      <div class="heading-area">
        <slot name="heading"></slot>
      </div>
      <hr class="heading-divider" />
      <div class="layout-content">
        <slot name="before"></slot>
        <div class="body-area">
          <slot></slot>
        </div>
        <slot name="after"></slot>
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
