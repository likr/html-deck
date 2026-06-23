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
          width: calc(100% + var(--hd-slide-padding-left, 40px) + var(--hd-slide-padding-right, 40px));
          margin-top: calc(-1 * var(--hd-slide-padding-top, 30px));
          margin-left: calc(-1 * var(--hd-slide-padding-left, 40px));
          margin-right: calc(-1 * var(--hd-slide-padding-right, 40px));
          padding-top: calc(var(--hd-slide-padding-top, 30px) + var(--hd-layout-heading-padding-top, 0px));
          padding-bottom: var(--hd-layout-heading-padding-bottom, var(--hd-gap-2));
          padding-left: var(--hd-slide-padding-left, 40px);
          padding-right: var(--hd-slide-padding-right, 40px);
          background-color: var(--hd-layout-heading-bg, transparent);
          color: var(--hd-layout-heading-color, inherit);
          border-top: var(--hd-layout-heading-border-top, none);
          border-bottom: var(--hd-layout-heading-border-bottom, var(--hd-layout-heading-border, none));
          box-shadow: var(--hd-layout-heading-shadow, none);
          text-align: var(--hd-layout-heading-text-align, left);
          margin-bottom: var(--hd-layout-heading-margin, var(--hd-gap-3));
          box-sizing: border-box;
          height: var(--hd-layout-heading-height, auto);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .heading-area ::slotted(*) {
          font-size: var(--hd-layout-heading-font-size);
          color: var(--hd-layout-heading-color);
          text-shadow: var(--hd-layout-heading-text-shadow, none);
          margin: 0;
        }
        ::slotted([slot="before"]) {
          margin-bottom: var(--hd-layout-before-margin, var(--hd-gap-2)) !important;
        }
        ::slotted([slot="after"]) {
          margin-top: var(--hd-layout-after-margin, var(--hd-gap-2)) !important;
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
      <slot name="before"></slot>
      <div class="body-area">
        <slot></slot>
      </div>
      <slot name="after"></slot>
    `;
  }
}
