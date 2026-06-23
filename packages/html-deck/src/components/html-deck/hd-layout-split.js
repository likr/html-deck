export class HdLayoutSplit extends HTMLElement {
  static get observedAttributes() {
    return ['ratio'];
  }

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
          box-shadow: var(--hd-layout-heading-shadow);
          text-align: var(--hd-layout-heading-text-align);
          box-sizing: border-box;
          height: var(--hd-layout-heading-height);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .heading-divider {
          display: var(--hd-layout-heading-hr-display);
          border: none;
          height: var(--hd-layout-heading-hr-height);
          background-color: var(--hd-layout-heading-hr-color);
          box-shadow: var(--hd-layout-heading-hr-shadow);
          margin-top: 0;
          margin-bottom: var(--hd-layout-heading-margin);
          margin-left: calc(-1 * var(--hd-slide-padding-left));
          margin-right: calc(-1 * var(--hd-slide-padding-right));
          width: calc(100% + var(--hd-slide-padding-left) + var(--hd-slide-padding-right));
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
        .split-container {
          display: grid;
          grid-template-columns: var(--hd-split-ratio);
          gap: 30px;
          flex-grow: 1;
          align-items: stretch;
          width: 100%;
        }
        .left-pane, .right-pane {
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
      <slot name="before"></slot>
      <div class="split-container" id="split-container">
        <div class="left-pane">
          <slot name="left"></slot>
        </div>
        <div class="right-pane">
          <slot name="right"></slot>
        </div>
      </div>
      <slot name="after"></slot>
    `;
  }

  connectedCallback() {
    this.updateRatio();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'ratio' && oldValue !== newValue) {
      this.updateRatio();
    }
  }

  updateRatio() {
    const container = this.shadowRoot.getElementById('split-container');
    if (!container) return;

    const ratioAttr = this.getAttribute('ratio') || '1:1';
    if (ratioAttr.includes(':')) {
      const parts = ratioAttr.split(':').map(Number);
      if (parts.length === 2 && !parts.some(isNaN)) {
        container.style.setProperty('--hd-split-ratio', `minmax(0, ${parts[0]}fr) minmax(0, ${parts[1]}fr)`);
        return;
      }
    }
    // Fallback
    container.style.setProperty('--hd-split-ratio', 'minmax(0, 1fr) minmax(0, 1fr)');
  }
}
