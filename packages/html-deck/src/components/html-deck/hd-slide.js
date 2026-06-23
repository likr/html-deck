export class HdSlide extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'transition-style', 'page-index', 'page-total', 'hide-page-number'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        ${HdSlide.baseStyles}
      </style>
      <div class="slide-content">
        <slot name="header"></slot>
        <div class="body-area">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
        <div class="page-number" id="page-num"></div>
      </div>
    `;

    // Listen for slot changes to dynamically update page numbers if layout changes
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.updatePageNumber();
      });
    }
  }

  connectedCallback() {
    this.updatePageNumber();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'page-index' || name === 'page-total' || name === 'hide-page-number') {
      this.updatePageNumber();
    }
  }

  updatePageNumber() {
    const pageNumEl = this.shadowRoot.getElementById('page-num');
    if (!pageNumEl) return;

    const hasCoverLayout = !!this.querySelector('hd-layout-cover');
    const hidePageNum = this.hasAttribute('hide-page-number') || (hasCoverLayout && !this.hasAttribute('show-page-number'));
    const index = this.getAttribute('page-index');
    const total = this.getAttribute('page-total');

    if (hidePageNum || !index || !total) {
      pageNumEl.style.display = 'none';
    } else {
      pageNumEl.style.display = 'block';
      pageNumEl.textContent = `${index} / ${total}`;
    }
  }
}

HdSlide.baseStyles = `
  :host {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--hd-default-background-color);
    color: var(--hd-default-color);
    font-family: var(--hd-body-font);
    font-size: var(--hd-slide-font-size);
    line-height: var(--hd-text-line-height, 1.6);
    letter-spacing: 0.01em;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;
  }

  :host([active]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Vertical centering alignment */
  :host([center]) .slide-content {
    justify-content: center;
    align-items: center;
  }

  /* Transitions */
  :host([transition-style="fade"]) {
    transition: opacity 0.4s ease, visibility 0.4s ease;
  }
  
  :host([transition-style="none"]) {
    transition: none;
  }

  .slide-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: var(--hd-slide-padding);
    position: relative;
  }

  :host([no-padding]) .slide-content {
    padding: 0;
  }

  .body-area {
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .page-number {
    position: absolute;
    bottom: var(--peripheral-footer-bottom, 12px);
    right: 16px;
    font-size: var(--peripheral-font-size, 9px);
    color: var(--hd-page-number-color);
    z-index: 10;
    user-select: none;
    font-family: var(--hd-body-font);
  }

  /* Print Styles */
  @media print {
    .page-number {
      display: none !important;
    }
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
      background-color: var(--hd-default-background-color) !important;
      color: var(--hd-default-color) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slide-content {
      display: flex !important;
      height: 100% !important;
      box-sizing: border-box !important;
    }
  }

  /* Slotted element styles */
  ::slotted([slot="notes"]) {
    display: none !important;
  }

  ::slotted([slot="header"]) {
    display: block !important;
    position: absolute !important;
    top: var(--peripheral-header-top, 12px) !important;
    left: var(--hd-header-left) !important;
    font-size: var(--peripheral-font-size, 9px) !important;
    color: var(--hd-header-color) !important;
    opacity: var(--hd-header-opacity) !important;
    font-family: var(--hd-body-font) !important;
    z-index: 10 !important;
    user-select: none !important;
    line-height: var(--peripheral-line-height, 1) !important;
  }

  ::slotted([slot="footer"]) {
    display: block !important;
    position: absolute !important;
    bottom: var(--peripheral-footer-bottom, 12px) !important;
    left: var(--hd-footer-left) !important;
    font-size: var(--peripheral-font-size, 9px) !important;
    color: var(--hd-footer-color) !important;
    opacity: var(--hd-footer-opacity) !important;
    font-family: var(--hd-body-font) !important;
    z-index: 10 !important;
    user-select: none !important;
    line-height: var(--peripheral-line-height, 1) !important;
  }
`;
