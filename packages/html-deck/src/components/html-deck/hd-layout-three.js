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
          width: calc(100% + var(--hd-slide-padding-left) + var(--hd-slide-padding-right));
          margin-top: calc(-1 * var(--hd-slide-padding-top));
          margin-left: calc(-1 * var(--hd-slide-padding-left));
          margin-right: calc(-1 * var(--hd-slide-padding-right));
          padding-top: var(--hd-layout-heading-padding-top);
          padding-bottom: var(--hd-layout-heading-padding-bottom);
          padding-left: var(--hd-slide-padding-left);
          padding-right: var(--hd-slide-padding-right);
          background-color: var(--hd-layout-heading-bg);
          color: var(--hd-layout-heading-color);
          border-top: var(--hd-layout-heading-border-top);
          border-bottom: var(--hd-layout-heading-border-bottom);
          box-shadow: var(--hd-layout-heading-shadow);
          text-align: var(--hd-layout-heading-text-align);
          margin-bottom: var(--hd-layout-heading-margin);
          box-sizing: border-box;
          height: var(--hd-layout-heading-height);
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
        .three-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
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
    `;
  }
}
