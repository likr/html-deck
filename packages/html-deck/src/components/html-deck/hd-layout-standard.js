export class HdLayoutStandard extends HTMLElement {
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
          padding: var(--hd-slide-padding);
        }
        .header-area {
          width: 100%;
        }
        .title-area {
          width: 100%;
        }
        .body-area {
          flex-grow: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
        }
        .footer-area {
          width: 100%;
        }
      </style>
      <div class="header-area">
        <slot name="header"></slot>
      </div>
      <div class="title-area">
        <slot name="title"></slot>
      </div>
      <div class="body-area">
        <slot></slot>
      </div>
      <div class="footer-area">
        <slot name="footer"></slot>
      </div>
    `;
  }
}
