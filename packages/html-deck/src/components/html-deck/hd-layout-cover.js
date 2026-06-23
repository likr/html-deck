export class HdLayoutCover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          padding: var(--hd-slide-padding);
        }
        .cover-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
          width: 100%;
          flex-grow: 1;
        }
        .title-area {
          margin-bottom: 16px;
          width: 100%;
        }
        .subtitle-area {
          margin-bottom: 24px;
          width: 100%;
        }
        .meta-area {
          width: 100%;
        }
      </style>
      <div class="cover-container">
        <div class="title-area">
          <slot name="title"></slot>
        </div>
        <div class="subtitle-area">
          <slot name="subtitle"></slot>
        </div>
        <div class="meta-area">
          <slot name="meta"></slot>
        </div>
      </div>
    `;
  }
}
