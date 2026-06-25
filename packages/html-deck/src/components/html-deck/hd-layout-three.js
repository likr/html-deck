export class HdLayoutThree extends HTMLElement {
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          padding-top: var(--hd-slide-margin-top);
          padding-bottom: var(--hd-layout-heading-padding-bottom);
          padding-left: var(--hd-slide-margin-left);
          padding-right: var(--hd-slide-margin-right);
          background-color: var(--hd-main-color);
          color: var(--hd-main-text-color);
          box-shadow: var(--hd-layout-heading-box-shadow, none);
          text-align: var(--hd-layout-heading-text-align, left);
        }
        /* Hide heading area when heading slot is empty */
        .heading-area:not(:has(slot[name="heading"]::slotted(*))) {
          display: none;
        }
        .heading-divider {
          display: var(--hd-layout-heading-divider-display, none);
          border: none;
          height: var(--hd-layout-heading-divider-height, 1px);
          background-color: var(--hd-slide-border-color);
          box-shadow: var(--hd-layout-heading-divider-box-shadow, none);
          margin: 0;
          width: 100%;
        }
        .heading-area:not(:has(slot[name="heading"]::slotted(*))) + .heading-divider {
          display: none;
        }
        .layout-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          width: 100%;
          box-sizing: border-box;
          padding-top: var(--hd-slide-margin-top);
          padding-bottom: var(--hd-slide-margin-bottom);
          padding-left: var(--hd-slide-margin-left);
          padding-right: var(--hd-slide-margin-right);
        }
        /* When heading is present, remove padding-top and use margin-top */
        .heading-area:has(slot[name="heading"]::slotted(*)) ~ .layout-content {
          padding-top: 0;
          margin-top: var(--hd-layout-heading-margin);
        }
        .heading-area ::slotted(*) {
          font-family: var(--hd-text-heading-font);
          font-size: var(--hd-text-heading-font-size);
          color: var(--hd-main-text-color);
          text-shadow: var(--hd-layout-heading-text-shadow, none);
          margin: 0;
        }
        ::slotted([slot="before"]) {
          margin-bottom: var(--hd-layout-before-margin) !important;
        }
        ::slotted([slot="after"]) {
          margin-top: var(--hd-layout-after-margin) !important;
        }
        .three-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--hd-layout-three-gap);
          flex-grow: 1;
          align-items: stretch;
          width: 100%;
        }
        .left-pane, .middle-pane, .right-pane {
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
        <div class="three-container">
          <div class="left-pane">
            <slot name="left"></slot>
          </div>
          <div class="middle-pane">
            <slot name="middle"></slot>
          </div>
          <div class="right-pane">
            <slot name="right"></slot>
          </div>
        </div>
        <slot name="after"></slot>
      </div>
    `;
  }
}
