export class HdSlide extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'transition-style', 'page-index', 'page-total', 'hide-page-number', 'scrollable', 'height', 'invert', 'bg'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        ${HdSlide.baseStyles}
      </style>
      <div class="slide-content">
        <slot></slot>
        <slot name="footnote"></slot>
        <div class="page-number" id="page-num"></div>
      </div>
    `;

    // Listen for slot changes to dynamically update page numbers if layout changes
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.updatePageNumber();
      });
    }
  }

  connectedCallback() {
    this.updatePageNumber();
    this.updateScrollable();
    this.updateColorScheme();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'page-index' || name === 'page-total' || name === 'hide-page-number') {
      this.updatePageNumber();
    }
    if (name === 'scrollable' || name === 'height') {
      this.updateScrollable();
    }
    if (name === 'invert' || name === 'bg') {
      this.updateColorScheme();
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

  updateScrollable() {
    const contentEl = this.shadowRoot.querySelector('.slide-content');
    if (!contentEl) return;

    if (this.hasAttribute('scrollable')) {
      contentEl.style.overflowY = 'auto';
      const height = this.getAttribute('height');
      if (height) {
        contentEl.style.maxHeight = height;
      } else {
        contentEl.style.maxHeight = '100%';
      }
    } else {
      contentEl.style.overflowY = 'hidden';
      contentEl.style.maxHeight = '';
    }
  }

  updateColorScheme() {
    // Left empty: styling is controlled via CSS custom properties on host selectors
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
    background-color: var(--hd-slide-bg);
    color: var(--hd-slide-text-color);
    font-size: var(--hd-slide-font-size);
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

  /* Individual Slide Style Overrides */
  :host([invert]) {
    --hd-slide-bg: var(--hd-text-color);
    --hd-slide-text-color: var(--hd-bg);
    --hd-list-color: var(--hd-bg);
    --hd-math-color: var(--hd-bg);
    --hd-link-color: var(--hd-secondary-color);
  }

  :host([bg="primary"]) {
    --hd-slide-bg: var(--hd-primary-color);
    --hd-slide-text-color: #ffffff;
    --hd-list-color: #ffffff;
    --hd-math-color: #ffffff;
    --hd-link-color: #ffffff;
  }

  :host([bg="secondary"]) {
    --hd-slide-bg: var(--hd-secondary-color);
    --hd-slide-text-color: #ffffff;
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

  .slide-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    position: relative;
  }

  .page-number {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: var(--hd-page-number-font-size);
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
      background-color: var(--hd-slide-bg) !important;
      color: var(--hd-slide-text-color) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slide-content {
      display: flex !important;
      height: 100% !important;
      box-sizing: border-box !important;
      padding: 0 !important;
    }
  }

  /* Slotted element styles */
  ::slotted([slot="notes"]) {
    display: none !important;
  }

  ::slotted([slot="footnote"]) {
    display: block !important;
    position: absolute !important;
    bottom: var(--hd-footnote-bottom) !important;
    left: var(--hd-footnote-left) !important;
    font-size: var(--hd-footnote-font-size) !important;
    color: var(--hd-footnote-color) !important;
    opacity: var(--hd-footnote-opacity) !important;
    font-family: var(--hd-body-font) !important;
    z-index: 10 !important;
    user-select: none !important;
    line-height: 1.4 !important;
  }
`;
