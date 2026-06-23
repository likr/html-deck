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
        .title-area {
          width: 100%;
        }
        .split-container {
          display: grid;
          grid-template-columns: var(--hd-split-ratio, minmax(0, 1fr) minmax(0, 1fr));
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
      <div class="title-area">
        <slot name="title"></slot>
      </div>
      <div class="split-container" id="split-container">
        <div class="left-pane">
          <slot name="left"></slot>
        </div>
        <div class="right-pane">
          <slot name="right"></slot>
        </div>
      </div>
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
