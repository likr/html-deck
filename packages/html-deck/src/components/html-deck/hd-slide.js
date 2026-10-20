export class HdSlide extends HTMLElement {
  static get observedAttributes() {
    return ['page-index', 'page-total', 'hide-page-number'];
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
        <div class="slide-overlay"></div>
      </div>
    `;

    // Listen for slot changes to dynamically update layout state & page numbers if layout changes
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.updateLayoutState();
      });
    }
  }

  connectedCallback() {
    this.updateLayoutState();
    if (!this._observer) {
      this._observer = new MutationObserver((mutations) => {
        const hasRelevantMutation = mutations.some(m => m.target !== this || m.type === 'childList');
        if (hasRelevantMutation) {
          this.updateLayoutState();
        }
      });
      this._observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['has-heading', 'slot'] });
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'page-index' || name === 'page-total' || name === 'hide-page-number') {
      this.updatePageNumber();
    }
  }

  updateLayoutState() {
    const hasHeading = !!this.querySelector('hd-layout[has-heading], hd-layout-split[has-heading], hd-layout-grid[has-heading], :scope > [slot="heading"], :scope > hd-layout > [slot="heading"], :scope > hd-layout-split > [slot="heading"], :scope > hd-layout-grid > [slot="heading"]');
    const currentlyHas = this.hasAttribute('has-heading');
    if (hasHeading && !currentlyHas) {
      this.setAttribute('has-heading', '');
    } else if (!hasHeading && currentlyHas) {
      this.removeAttribute('has-heading');
    }
    this.updatePageNumber();
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
    background: var(--hd-slide-body-background);
    color: var(--hd-slide-body-text-color);
    font-family: var(--hd-body-font);
    font-size: var(--hd-size-3);
    font-weight: var(--hd-text-body-font-weight);
    line-height: var(--hd-text-body-line-height);
    letter-spacing: var(--hd-text-body-letter-spacing);
    border: var(--hd-slide-border-width) var(--hd-slide-border-style) var(--hd-slide-border-color);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;

    /* Base variables: soft */
    --hd-slide-heading-background-color: var(--hd-base-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-base-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-base-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-base-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-base-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-base-soft-body-background-color);
    --hd-slide-body-background: var(--hd-base-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-base-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-base-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);

    /* Token bridging to light DOM / slotted elements / presenter preview */
    --hd-background-color: var(--hd-slide-body-background, var(--hd-slide-body-background-color));
    --hd-text-color: var(--hd-slide-body-text-color);
    --hd-text-highlight-color: var(--hd-slide-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-slide-body-text-muted-color);
    --hd-border-color: var(--hd-slide-border-color);
  }

  /* Surface default: soft */
  :host([surface="solid"]) {
    --hd-slide-heading-background-color: var(--hd-base-solid-heading-background-color);
    --hd-slide-heading-background: var(--hd-base-solid-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-base-solid-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-base-solid-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-base-solid-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-base-solid-body-background-color);
    --hd-slide-body-background: var(--hd-base-solid-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-base-solid-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
    --hd-slide-border-color: var(--hd-base-solid-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="base"][surface="soft"]) {
    --hd-slide-heading-background-color: var(--hd-base-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-base-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-base-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-base-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-base-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-base-soft-body-background-color);
    --hd-slide-body-background: var(--hd-base-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-base-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-base-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-base-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-base-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="base"][surface="solid"]) {
    --hd-slide-heading-background-color: var(--hd-base-solid-heading-background-color);
    --hd-slide-heading-background: var(--hd-base-solid-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-base-solid-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-base-solid-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-base-solid-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-base-solid-body-background-color);
    --hd-slide-body-background: var(--hd-base-solid-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-base-solid-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-base-solid-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-base-solid-body-text-muted-color);
    --hd-slide-border-color: var(--hd-base-solid-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="main"]) {
    --hd-slide-heading-background-color: var(--hd-main-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-main-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-main-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-main-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-main-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-main-soft-body-background-color);
    --hd-slide-body-background: var(--hd-main-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-main-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-main-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-main-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="main"][surface="soft"]) {
    --hd-slide-heading-background-color: var(--hd-main-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-main-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-main-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-main-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-main-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-main-soft-body-background-color);
    --hd-slide-body-background: var(--hd-main-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-main-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-main-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-main-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-main-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="main"][surface="solid"]) {
    --hd-slide-heading-background-color: var(--hd-main-solid-heading-background-color);
    --hd-slide-heading-background: var(--hd-main-solid-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-main-solid-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-main-solid-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-main-solid-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-main-solid-body-background-color);
    --hd-slide-body-background: var(--hd-main-solid-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-main-solid-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-main-solid-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-main-solid-body-text-muted-color);
    --hd-slide-border-color: var(--hd-main-solid-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="accent"]) {
    --hd-slide-heading-background-color: var(--hd-accent-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-accent-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-accent-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-accent-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-accent-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-accent-soft-body-background-color);
    --hd-slide-body-background: var(--hd-accent-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-accent-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-accent-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-accent-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="accent"][surface="soft"]) {
    --hd-slide-heading-background-color: var(--hd-accent-soft-heading-background-color);
    --hd-slide-heading-background: var(--hd-accent-soft-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-accent-soft-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-accent-soft-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-accent-soft-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-accent-soft-body-background-color);
    --hd-slide-body-background: var(--hd-accent-soft-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-accent-soft-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-accent-soft-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-accent-soft-body-text-muted-color);
    --hd-slide-border-color: var(--hd-accent-soft-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([variant="accent"][surface="solid"]) {
    --hd-slide-heading-background-color: var(--hd-accent-solid-heading-background-color);
    --hd-slide-heading-background: var(--hd-accent-solid-heading-background, var(--hd-slide-heading-background-color));
    --hd-slide-heading-text-color: var(--hd-accent-solid-heading-text-color);
    --hd-slide-heading-text-highlight-color: var(--hd-accent-solid-heading-text-highlight-color);
    --hd-slide-heading-text-muted-color: var(--hd-accent-solid-heading-text-muted-color);
    --hd-slide-body-background-color: var(--hd-accent-solid-body-background-color);
    --hd-slide-body-background: var(--hd-accent-solid-body-background, var(--hd-slide-body-background-color));
    --hd-slide-body-text-color: var(--hd-accent-solid-body-text-color);
    --hd-slide-body-text-highlight-color: var(--hd-accent-solid-body-text-highlight-color);
    --hd-slide-body-text-muted-color: var(--hd-accent-solid-body-text-muted-color);
    --hd-slide-border-color: var(--hd-accent-solid-border);
    --hd-slide-heading-divider-background: var(--hd-slide-border-color);
  }

  :host([active]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Vertical centering alignment */
  :host([center]) .body-area {
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
    z-index: 1;
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
    color: var(--hd-slide-body-text-muted-color);
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
      background-color: var(--hd-slide-body-background) !important;
      color: var(--hd-slide-body-text-color) !important;
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
  ::slotted([slot="script"]),
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
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;
    user-select: none !important;

    /* Default header: on slide body */
    --hd-background-color: var(--hd-slide-body-background, var(--hd-slide-body-background-color));
    --hd-text-color: var(--hd-slide-body-text-color);
    --hd-text-highlight-color: var(--hd-slide-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-slide-body-text-muted-color);
    color: var(--hd-text-muted-color) !important;
  }

  :host([has-heading]) ::slotted([slot="header"]) {
    /* Header on heading banner */
    --hd-background-color: var(--hd-slide-heading-background, var(--hd-slide-heading-background-color));
    --hd-text-color: var(--hd-slide-heading-text-color);
    --hd-text-highlight-color: var(--hd-slide-heading-text-highlight-color);
    --hd-text-muted-color: var(--hd-slide-heading-text-muted-color);
    color: var(--hd-text-muted-color) !important;
  }

  ::slotted([slot="footer"]) {
    display: block !important;
    position: absolute !important;
    bottom: var(--hd-peripheral-offset) !important;
    left: var(--hd-slide-margin-left) !important;
    right: var(--hd-slide-margin-right) !important;
    font-family: var(--hd-text-peripheral-font) !important;
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;

    /* Variables mapping: footer */
    --hd-background-color: var(--hd-slide-body-background, var(--hd-slide-body-background-color));
    --hd-text-color: var(--hd-slide-body-text-color);
    --hd-text-highlight-color: var(--hd-slide-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-slide-body-text-muted-color);
    color: var(--hd-text-muted-color) !important;
  }

  .slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: var(--hd-overlay-background, var(--hd-slide-overlay-background, none));
    mix-blend-mode: var(--hd-slide-overlay-mix-blend-mode, normal);
    opacity: var(--hd-slide-overlay-opacity, 1);
    z-index: var(--hd-slide-overlay-z-index, 100);
  }
`;

