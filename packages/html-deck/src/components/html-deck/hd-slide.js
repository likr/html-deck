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
    background: var(--hd-slide-background-color);
    color: var(--hd-slide-text-color);
    font-family: var(--hd-body-font);
    font-size: var(--hd-size-3);
    line-height: var(--hd-text-body-line-height, 1.6);
    letter-spacing: var(--hd-text-body-letter-spacing, 0.01em);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;
  }

  :host([inverted]) {
    --hd-base-color: var(--hd-base-color-inverted);
    --hd-base-text-color: var(--hd-base-text-color-inverted);
    --hd-main-color: var(--hd-main-color-inverted);
    --hd-main-text-color: var(--hd-main-text-color-inverted);
    --hd-accent-color: var(--hd-accent-color-inverted);
    --hd-accent-text-color: var(--hd-accent-text-color-inverted);

    --hd-base-color-muted: var(--hd-base-color-muted-inverted);
    --hd-base-text-color-muted: var(--hd-base-text-color-muted-inverted);
    --hd-main-color-muted: var(--hd-main-color-muted-inverted);
    --hd-main-text-color-muted: var(--hd-main-text-color-muted-inverted);
    --hd-accent-color-muted: var(--hd-accent-color-muted-inverted);
    --hd-accent-text-color-muted: var(--hd-accent-text-color-muted-inverted);

    /* Explicitly override slide and text type colors to inverted values to fix CSS variable inheritance evaluation */
    --hd-slide-background-color: var(--hd-base-color-inverted);
    --hd-slide-text-color: var(--hd-base-text-color-inverted);
    --hd-slide-border-color: var(--hd-base-text-color-muted-inverted);

    --hd-text-title-color: var(--hd-base-text-color-inverted);
    --hd-text-heading-color: var(--hd-base-text-color-inverted);
    --hd-text-subheading-color: var(--hd-base-text-color-muted-inverted);
    --hd-text-body-color: var(--hd-base-text-color-inverted);
    --hd-text-quote-color: var(--hd-base-text-color-muted-inverted);
    --hd-text-caption-color: var(--hd-base-text-color-muted-inverted);
    --hd-text-peripheral-color: var(--hd-base-text-color-muted-inverted);
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
    padding: 0;
    position: relative;
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
    bottom: var(--hd-peripheral-offset);
    right: var(--hd-peripheral-offset);
    font-family: var(--hd-text-peripheral-font);
    color: var(--hd-text-peripheral-color);
    font-size: var(--hd-text-peripheral-font-size);
    font-weight: var(--hd-text-peripheral-font-weight);
    line-height: var(--hd-text-peripheral-line-height);
    letter-spacing: var(--hd-text-peripheral-letter-spacing);
    text-transform: var(--hd-text-peripheral-text-transform);
    text-shadow: var(--hd-text-peripheral-text-shadow);
    z-index: 10;
    user-select: none;
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
      background-color: var(--hd-slide-background-color) !important;
      color: var(--hd-slide-text-color) !important;
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
    top: var(--hd-peripheral-offset) !important;
    left: var(--hd-slide-margin-left) !important;
    right: var(--hd-slide-margin-right) !important;
    font-family: var(--hd-text-peripheral-font) !important;
    color: var(--hd-text-peripheral-color) !important;
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;
    user-select: none !important;
  }

  ::slotted([slot="footer"]) {
    display: block !important;
    position: absolute !important;
    bottom: var(--hd-peripheral-offset) !important;
    left: var(--hd-slide-margin-left) !important;
    right: var(--hd-slide-margin-right) !important;
    font-family: var(--hd-text-peripheral-font) !important;
    color: var(--hd-text-peripheral-color) !important;
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;
  }
`;

