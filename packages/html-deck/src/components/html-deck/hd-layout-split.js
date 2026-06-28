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
          display: none;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          padding: var(--hd-layout-heading-padding);
          background: var(--hd-solid-background-color);
          color: var(--hd-solid-text-color);
          box-shadow: var(--hd-layout-heading-box-shadow, none);
          text-align: var(--hd-layout-heading-text-align, left);
        }
        :host([has-heading]) .heading-area {
          display: flex;
        }
        .heading-divider {
          display: none;
          border: none;
          height: var(--hd-layout-heading-divider-height, 1px);
          background: var(--hd-solid-text-color);
          box-shadow: var(--hd-layout-heading-divider-box-shadow, none);
          margin: 0;
          width: 100%;
        }
        :host([has-heading]) .heading-divider {
          display: var(--hd-layout-heading-divider-display, none);
        }
        .layout-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          width: 100%;
          box-sizing: border-box;
          padding: var(--hd-layout-body-padding);
          padding-top: var(--hd-slide-margin-top);
        }
        :host([has-heading]) .layout-content {
          padding-top: var(--hd-gap-3);
        }
        .heading-area ::slotted(*) {
          font-family: var(--hd-text-heading-font);
          font-size: var(--hd-text-heading-font-size);
          color: var(--hd-solid-text-color);
          text-shadow: var(--hd-layout-heading-text-shadow, none);
          margin: 0;
        }
        ::slotted([slot="before"]) {
          margin-bottom: var(--hd-layout-before-margin) !important;
        }
        ::slotted([slot="after"]) {
          margin-top: var(--hd-layout-after-margin) !important;
        }
        .split-container {
          display: grid;
          grid-template-columns: var(--hd-layout-split-ratio);
          gap: var(--hd-layout-split-gap);
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
      <div class="layout-content">
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
      </div>
    `;

    // Set up slotchange listener to toggle has-heading host attribute
    const headingSlot = this.shadowRoot.querySelector('slot[name="heading"]');
    if (headingSlot) {
      const updateHeading = () => {
        const hasHeading = headingSlot.assignedElements().length > 0;
        if (hasHeading) {
          this.setAttribute('has-heading', '');
        } else {
          this.removeAttribute('has-heading');
        }
      };
      headingSlot.addEventListener('slotchange', updateHeading);
      updateHeading();
    }
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
        container.style.setProperty('--hd-layout-split-ratio', `minmax(0, ${parts[0]}fr) minmax(0, ${parts[1]}fr)`);
        return;
      }
    }
    // Fallback
    container.style.setProperty('--hd-layout-split-ratio', 'minmax(0, 1fr) minmax(0, 1fr)');
  }
}
