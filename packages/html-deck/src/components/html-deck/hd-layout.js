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
      </style>
      <div class="title-area">
        <slot name="title"></slot>
      </div>
      <slot name="before"></slot>
      <div class="body-area">
        <slot></slot>
      </div>
      <slot name="after"></slot>
    `;
  }
}
