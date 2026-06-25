export class HdLayoutCover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          justify-content: var(--hd-layout-cover-justify-content, center);
          align-items: var(--hd-layout-cover-align-items, center);
          text-align: var(--hd-layout-cover-text-align, center);
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          padding-top: var(--hd-slide-margin-top);
          padding-bottom: var(--hd-slide-margin-bottom);
          padding-left: var(--hd-slide-margin-left);
          padding-right: var(--hd-slide-margin-right);
        }
        .cover-container {
          display: flex;
          flex-direction: column;
          justify-content: var(--hd-layout-cover-justify-content, center);
          align-items: var(--hd-layout-cover-align-items, center);
          text-align: var(--hd-layout-cover-text-align, center);
          width: 100%;
          flex-grow: 1;
        }
        .title-area {
          margin-bottom: var(--hd-layout-cover-title-margin-bottom);
          width: 100%;
        }
        .title-area ::slotted(*) {
          font-family: var(--hd-text-title-font);
          font-size: var(--hd-text-title-font-size);
          color: var(--hd-text-title-color);
          font-weight: var(--hd-text-title-font-weight);
          line-height: var(--hd-text-title-line-height);
          letter-spacing: var(--hd-text-title-letter-spacing);
          text-transform: var(--hd-text-title-text-transform);
          text-shadow: var(--hd-layout-cover-title-text-shadow, none);
          margin: 0;
        }
        .subtitle-area {
          margin-bottom: var(--hd-layout-cover-subtitle-margin-bottom);
          width: 100%;
        }
        .subtitle-area ::slotted(*) {
          font-family: var(--hd-text-subheading-font);
          font-size: var(--hd-text-subheading-font-size);
          color: var(--hd-text-subheading-color);
          font-weight: var(--hd-text-subheading-font-weight);
          line-height: var(--hd-text-subheading-line-height);
          letter-spacing: var(--hd-text-subheading-letter-spacing);
          text-transform: var(--hd-text-subheading-text-transform);
          text-shadow: var(--hd-layout-cover-subtitle-text-shadow, none);
          margin: 0;
        }
        .meta-area {
          width: 100%;
        }
        .meta-area ::slotted(*) {
          font-family: var(--hd-text-caption-font);
          font-size: var(--hd-text-caption-font-size);
          color: var(--hd-text-caption-color);
          font-weight: var(--hd-text-caption-font-weight);
          line-height: var(--hd-text-caption-line-height);
          letter-spacing: var(--hd-text-caption-letter-spacing);
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
