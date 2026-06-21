const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--hd-slide-bg, var(--hd-bg, #ffffff));
    color: var(--hd-slide-text-color, var(--hd-text-color, #1e293b));
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
  }

  :host([active]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Individual Slide Style Overrides */
  :host([invert]) {
    --hd-slide-bg: var(--hd-text-color, #1e293b);
    --hd-slide-text-color: var(--hd-bg, #ffffff);
    --hd-heading-color-1: var(--hd-bg, #ffffff);
    --hd-heading-color-2: var(--hd-bg, #ffffff);
    --hd-heading-color-3: var(--hd-bg, #ffffff);
    --hd-list-color: var(--hd-bg, #ffffff);
    --hd-math-color: var(--hd-bg, #ffffff);
    --hd-link-color: var(--hd-secondary, #a855f7);
  }

  :host([bg="primary"]) {
    --hd-slide-bg: var(--hd-primary, #3b82f6);
    --hd-slide-text-color: #ffffff;
    --hd-heading-color-1: #ffffff;
    --hd-heading-color-2: #ffffff;
    --hd-heading-color-3: #ffffff;
    --hd-list-color: #ffffff;
    --hd-math-color: #ffffff;
    --hd-link-color: #ffffff;
  }

  :host([bg="secondary"]) {
    --hd-slide-bg: var(--hd-secondary, #a855f7);
    --hd-slide-text-color: #ffffff;
    --hd-heading-color-1: #ffffff;
    --hd-heading-color-2: #ffffff;
    --hd-heading-color-3: #ffffff;
    --hd-list-color: #ffffff;
    --hd-math-color: #ffffff;
    --hd-link-color: #ffffff;
  }

  /* Transitions */
  :host([transition-style="fade"]) {
    transition: opacity 0.4s ease, visibility 0.4s ease;
  }
  
  :host([transition-style="none"]) {
    transition: none;
  }

  /* Slide Content Box styling - padding lives here, not on :host */
  .slide-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: var(--hd-slide-padding, 30px 40px);
  }

  /* Layout variations */
  
  /* 1. Title Layout (Centered) */
  :host([layout="title"]) .slide-content {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  /* 2. Title-Body Layout */
  :host([layout="title-body"]) .slide-content {
    justify-content: flex-start;
    align-items: stretch;
  }
  :host([layout="title-body"]) .body-area {
    margin-top: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  /* 3. Split Layout */
  :host([layout="split"]) .slide-content {
    display: flex;
    flex-direction: column;
  }
  :host([layout="split"]) .split-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    flex-grow: 1;
    margin-top: 20px;
    align-items: stretch;
  }

  /* 4. Blank Layout */
  :host([layout="blank"]) .slide-content {
    padding: 0;
  }

  /* Sizing and alignment layout-root wrapper */
  #layout-root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  /* Vertical alignment centering */
  :host([center]) .body-area {
    justify-content: center;
  }
  :host([center]) .split-container {
    align-items: center;
  }
  :host([center]) #layout-root.layout-blank {
    justify-content: center;
  }

  /* Print optimization */
  @media print {
    :host {
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative !important;
      width: 100vw !important;
      height: 100vh !important;
      page-break-after: always !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      background-color: var(--hd-slide-bg, var(--hd-bg, #ffffff)) !important;
      color: var(--hd-slide-text-color, var(--hd-text-color, #1e293b)) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slide-content {
      display: flex !important;
      height: 100% !important;
      box-sizing: border-box !important;
    }
    #layout-root {
      display: flex !important;
      height: 100% !important;
    }
  }
</style>
<div class="slide-content">
  <div id="layout-root">
    <!-- Render content dynamically based on layout -->
  </div>
</div>
`;

export class HdSlide extends HTMLElement {
  static get observedAttributes() {
    return ['layout', 'active', 'transition-style'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this.renderLayout();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'layout' && oldValue !== newValue) {
      this.renderLayout();
    }
  }

  renderLayout() {
    const layout = this.getAttribute('layout') || 'title-body';
    const root = this.shadowRoot.getElementById('layout-root');
    if (!root) return;

    // Clear current layout DOM structure
    root.className = `layout-${layout}`;
    root.innerHTML = '';

    if (layout === 'title') {
      root.innerHTML = `
        <slot name="title"></slot>
        <slot name="subtitle"></slot>
        <slot></slot>
      `;
    } else if (layout === 'title-body') {
      root.innerHTML = `
        <div class="title-area">
          <slot name="title"></slot>
        </div>
        <div class="body-area">
          <slot></slot>
        </div>
      `;
    } else if (layout === 'split') {
      root.innerHTML = `
        <div class="title-area">
          <slot name="title"></slot>
        </div>
        <div class="split-container">
          <div class="left-pane">
            <slot name="left"></slot>
          </div>
          <div class="right-pane">
            <slot name="right"></slot>
          </div>
        </div>
        <slot></slot> <!-- general fallback slot -->
      `;
    } else {
      // blank or custom
      root.innerHTML = `<slot></slot>`;
    }
  }
}
