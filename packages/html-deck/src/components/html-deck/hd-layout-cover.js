export class HdLayoutCover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          justify-content: var(--hd-layout-cover-justify);
          align-items: var(--hd-layout-cover-align);
          text-align: var(--hd-layout-cover-text-align);
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        .cover-container {
          display: flex;
          flex-direction: column;
          justify-content: var(--hd-layout-cover-justify);
          align-items: var(--hd-layout-cover-align);
          text-align: var(--hd-layout-cover-text-align);
          width: 100%;
          flex-grow: 1;
        }
        .title-area {
          margin-bottom: var(--hd-layout-cover-title-margin);
          width: 100%;
        }
        .title-area ::slotted(*) {
          font-size: var(--hd-layout-cover-title-font-size);
          color: var(--hd-layout-cover-title-color);
          text-shadow: var(--hd-layout-cover-title-shadow, none);
          margin: 0;
        }
        .subtitle-area {
          margin-bottom: var(--hd-layout-cover-subtitle-margin);
          width: 100%;
        }
        .subtitle-area ::slotted(*) {
          font-size: var(--hd-layout-cover-subtitle-font-size);
          color: var(--hd-layout-cover-subtitle-color);
          text-shadow: var(--hd-layout-cover-subtitle-shadow, none);
          margin: 0;
        }
        .meta-area {
          width: 100%;
        }
        .meta-area ::slotted(*) {
          font-size: var(--hd-layout-cover-meta-font-size);
          color: var(--hd-layout-cover-meta-color);
          margin: 0;
        }
      </style>
      <slot name="before"></slot>
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
      <slot name="after"></slot>
    `;
  }
}
