export class HdPresenter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--hd-presenter-background-color);
          color: var(--hd-presenter-text-color);
          font-family: var(--hd-presenter-font);
          box-sizing: border-box;
          padding: var(--hd-presenter-gap);
          gap: var(--hd-presenter-gap);
          overflow: hidden;
        }

        .presenter-header {
          flex-shrink: 0;
          display: flex;
          width: 100%;
        }

        .presenter-header ::slotted(*) {
          width: 100%;
        }

        .presenter-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: var(--hd-presenter-gap);
          min-height: 0;
          width: 100%;
        }

        .presenter-main-split {
          flex-grow: 1;
          display: grid;
          grid-template-columns: var(--hd-presenter-split-ratio);
          gap: var(--hd-presenter-gap);
          min-height: 0;
          width: 100%;
        }

        .presenter-left-col,
        .presenter-right-col {
          display: flex;
          flex-direction: column;
          gap: var(--hd-presenter-gap);
          min-height: 0;
          height: 100%;
          overflow-y: auto;
        }

        .presenter-left-col ::slotted([slot="left"]),
        .presenter-right-col ::slotted([slot="right"]) {
          flex: 1 1 0%;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .presenter-left-col ::slotted(*:not([slot])),
        .presenter-left-col > slot:not([name]) ::slotted(*) {
          flex: 1 1 0%;
          min-height: 0;
        }
      </style>
      <div class="presenter-header">
        <slot name="header"></slot>
      </div>
      <div class="presenter-body">
        <slot name="before"></slot>
        <div class="presenter-main-split">
          <div class="presenter-left-col">
            <slot name="left"></slot>
            <slot></slot>
          </div>
          <div class="presenter-right-col">
            <slot name="right"></slot>
          </div>
        </div>
        <slot name="bottom"></slot>
      </div>
    `;
  }

  connectedCallback() {
    // Inject global body resets to prevent margins/scrollbars on presenter page
    if (!document.getElementById('hd-presenter-global-reset')) {
      const style = document.createElement('style');
      style.id = 'hd-presenter-global-reset';
      style.textContent = `
        body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: var(--hd-presenter-background-color) !important;
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}
