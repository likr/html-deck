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
    background-color: var(--hd-slide-bg, var(--hd-bg, #ffffff));
    color: var(--hd-slide-text-color, var(--hd-text-color, #1e293b));
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
    font-size: var(--hd-page-number-font-size, 9px);
    color: var(--hd-page-number-color, var(--hd-muted-color, #64748b));
    z-index: 10;
    user-select: none;
    font-family: var(--hd-body-font, inherit);
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
      background-color: var(--hd-slide-bg, var(--hd-bg, #ffffff)) !important;
      color: var(--hd-slide-text-color, var(--hd-text-color, #1e293b)) !important;
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
`;
