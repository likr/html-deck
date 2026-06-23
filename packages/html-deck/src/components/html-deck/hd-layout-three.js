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
        .title-area {
          width: 100%;
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
      <div class="title-area">
        <slot name="title"></slot>
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
