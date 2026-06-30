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
        <div class="slide-overlay"></div>
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
    background: var(--hd-background-color);
    color: var(--hd-text-color);
    font-family: var(--hd-body-font);
    font-size: var(--hd-size-3);
    font-weight: var(--hd-text-body-font-weight);
    line-height: var(--hd-text-body-line-height);
    letter-spacing: var(--hd-text-body-letter-spacing);
    border: var(--hd-slide-border-width) var(--hd-slide-border-style) var(--hd-border-color);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;

    --hd-background-color: var(--hd-body-background-color);
    --hd-text-color: var(--hd-body-text-color);
    --hd-text-highlight-color: var(--hd-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-body-text-muted-color);
    --hd-border-color: var(--hd-border-color-default);
  }

  :host([inverted]) {
    --hd-soft-background-color: var(--hd-base-soft-background-color-inverted);
    --hd-soft-text-color: var(--hd-base-soft-text-color-inverted);
    --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color-inverted);
    --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color-inverted);

    --hd-solid-background-color: var(--hd-main-solid-background-color-inverted);
    --hd-solid-text-color: var(--hd-main-solid-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-main-solid-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-main-solid-text-muted-color-inverted);
  }

  :host([variant="base"]) {
    --hd-soft-background-color: var(--hd-base-soft-background-color);
    --hd-soft-text-color: var(--hd-base-soft-text-color);
    --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color);
    --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color);

    --hd-solid-background-color: var(--hd-base-solid-background-color);
    --hd-solid-text-color: var(--hd-base-solid-text-color);
    --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color);
  }
  :host([variant="base"][inverted]) {
    --hd-soft-background-color: var(--hd-base-soft-background-color-inverted);
    --hd-soft-text-color: var(--hd-base-soft-text-color-inverted);
    --hd-soft-text-highlight-color: var(--hd-base-soft-text-highlight-color-inverted);
    --hd-soft-text-muted-color: var(--hd-base-soft-text-muted-color-inverted);

    --hd-solid-background-color: var(--hd-base-solid-background-color-inverted);
    --hd-solid-text-color: var(--hd-base-solid-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-base-solid-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-base-solid-text-muted-color-inverted);
  }

  :host([variant="main"]) {
    --hd-soft-background-color: var(--hd-main-soft-background-color);
    --hd-soft-text-color: var(--hd-main-soft-text-color);
    --hd-soft-text-highlight-color: var(--hd-main-soft-text-highlight-color);
    --hd-soft-text-muted-color: var(--hd-main-soft-text-muted-color);

    --hd-solid-background-color: var(--hd-main-solid-background-color);
    --hd-solid-text-color: var(--hd-main-solid-text-color);
    --hd-solid-text-highlight-color: var(--hd-main-solid-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-main-solid-text-muted-color);
  }
  :host([variant="main"][inverted]) {
    --hd-soft-background-color: var(--hd-main-soft-background-color-inverted);
    --hd-soft-text-color: var(--hd-main-soft-text-color-inverted);
    --hd-soft-text-highlight-color: var(--hd-main-soft-text-highlight-color-inverted);
    --hd-soft-text-muted-color: var(--hd-main-soft-text-muted-color-inverted);

    --hd-solid-background-color: var(--hd-main-solid-background-color-inverted);
    --hd-solid-text-color: var(--hd-main-solid-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-main-solid-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-main-solid-text-muted-color-inverted);
  }

  :host([variant="accent"]) {
    --hd-soft-background-color: var(--hd-accent-soft-background-color);
    --hd-soft-text-color: var(--hd-accent-soft-text-color);
    --hd-soft-text-highlight-color: var(--hd-accent-soft-text-highlight-color);
    --hd-soft-text-muted-color: var(--hd-accent-soft-text-muted-color);

    --hd-solid-background-color: var(--hd-accent-solid-background-color);
    --hd-solid-text-color: var(--hd-accent-solid-text-color);
    --hd-solid-text-highlight-color: var(--hd-accent-solid-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-accent-solid-text-muted-color);
  }
  :host([variant="accent"][inverted]) {
    --hd-soft-background-color: var(--hd-accent-soft-background-color-inverted);
    --hd-soft-text-color: var(--hd-accent-soft-text-color-inverted);
    --hd-soft-text-highlight-color: var(--hd-accent-soft-text-highlight-color-inverted);
    --hd-soft-text-muted-color: var(--hd-accent-soft-text-muted-color-inverted);

    --hd-solid-background-color: var(--hd-accent-solid-background-color-inverted);
    --hd-solid-text-color: var(--hd-accent-solid-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-accent-solid-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-accent-solid-text-muted-color-inverted);
  }

  /* --- Surface Overrides --- */
  :host([surface="soft"]) {
    --hd-solid-background-color: var(--hd-soft-background-color);
    --hd-solid-text-color: var(--hd-soft-text-color);
    --hd-solid-text-highlight-color: var(--hd-soft-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-soft-text-muted-color);
    --hd-border-color: var(--hd-border-color-surfaced);
  }
  :host([surface="soft"][inverted]) {
    --hd-solid-background-color: var(--hd-soft-background-color);
    --hd-solid-text-color: var(--hd-soft-text-color);
    --hd-solid-text-highlight-color: var(--hd-soft-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-soft-text-muted-color);
    --hd-border-color: var(--hd-border-color-surfaced);
  }

  :host([surface="solid"]) {
    --hd-soft-background-color: var(--hd-solid-background-color);
    --hd-soft-text-color: var(--hd-solid-text-color);
    --hd-soft-text-highlight-color: var(--hd-solid-text-highlight-color);
    --hd-soft-text-muted-color: var(--hd-solid-text-muted-color);
    --hd-border-color: var(--hd-border-color-surfaced);
  }
  :host([surface="solid"][inverted]) {
    --hd-soft-background-color: var(--hd-solid-background-color);
    --hd-soft-text-color: var(--hd-solid-text-color);
    --hd-soft-text-highlight-color: var(--hd-solid-text-highlight-color);
    --hd-soft-text-muted-color: var(--hd-solid-text-muted-color);
    --hd-border-color: var(--hd-border-color-surfaced);
  }

  /* --- Heading Attribute Customizations --- */
  :host([heading="base"]) {
    --hd-solid-background-color: var(--hd-base-soft-background-color);
    --hd-solid-text-color: var(--hd-base-soft-text-color);
    --hd-solid-text-highlight-color: var(--hd-base-soft-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-base-soft-text-muted-color);
  }
  :host([heading="base"][inverted]) {
    --hd-solid-background-color: var(--hd-base-soft-background-color-inverted);
    --hd-solid-text-color: var(--hd-base-soft-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-base-soft-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-base-soft-text-muted-color-inverted);
  }

  :host([heading="main"]) {
    --hd-solid-background-color: var(--hd-main-soft-background-color);
    --hd-solid-text-color: var(--hd-main-soft-text-color);
    --hd-solid-text-highlight-color: var(--hd-main-soft-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-main-soft-text-muted-color);
  }
  :host([heading="main"][inverted]) {
    --hd-solid-background-color: var(--hd-main-soft-background-color-inverted);
    --hd-solid-text-color: var(--hd-main-soft-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-main-soft-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-main-soft-text-muted-color-inverted);
  }

  :host([heading="accent"]) {
    --hd-solid-background-color: var(--hd-accent-soft-background-color);
    --hd-solid-text-color: var(--hd-accent-soft-text-color);
    --hd-solid-text-highlight-color: var(--hd-accent-soft-text-highlight-color);
    --hd-solid-text-muted-color: var(--hd-accent-soft-text-muted-color);
  }
  :host([heading="accent"][inverted]) {
    --hd-solid-background-color: var(--hd-accent-soft-background-color-inverted);
    --hd-solid-text-color: var(--hd-accent-soft-text-color-inverted);
    --hd-solid-text-highlight-color: var(--hd-accent-soft-text-highlight-color-inverted);
    --hd-solid-text-muted-color: var(--hd-accent-soft-text-muted-color-inverted);
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
    color: var(--hd-body-text-muted-color);
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
      background-color: var(--hd-background-color) !important;
      color: var(--hd-text-color) !important;
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

    /* Variables mapping: body */
    --hd-background-color: var(--hd-body-background-color);
    --hd-text-color: var(--hd-body-text-color);
    --hd-text-highlight-color: var(--hd-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-body-text-muted-color);

    color: var(--hd-text-muted-color) !important;
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;
    user-select: none !important;
  }

  :host([heading]) ::slotted([slot="header"]) {
    /* Variables mapping: heading */
    --hd-background-color: var(--hd-heading-background-color);
    --hd-text-color: var(--hd-heading-text-color);
    --hd-text-highlight-color: var(--hd-heading-text-highlight-color);
    --hd-text-muted-color: var(--hd-heading-text-muted-color);
  }

  ::slotted([slot="footer"]) {
    display: block !important;
    position: absolute !important;
    bottom: var(--hd-peripheral-offset) !important;
    left: var(--hd-slide-margin-left) !important;
    right: var(--hd-slide-margin-right) !important;
    font-family: var(--hd-text-peripheral-font) !important;

    /* Variables mapping: body */
    --hd-background-color: var(--hd-body-background-color);
    --hd-text-color: var(--hd-body-text-color);
    --hd-text-highlight-color: var(--hd-body-text-highlight-color);
    --hd-text-muted-color: var(--hd-body-text-muted-color);

    color: var(--hd-text-muted-color) !important;
    font-size: var(--hd-text-peripheral-font-size) !important;
    font-weight: var(--hd-text-peripheral-font-weight) !important;
    line-height: var(--hd-text-peripheral-line-height) !important;
    letter-spacing: var(--hd-text-peripheral-letter-spacing) !important;
    text-transform: var(--hd-text-peripheral-text-transform) !important;
    text-shadow: var(--hd-text-peripheral-text-shadow) !important;
    z-index: 10 !important;
  }


  .slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: var(--hd-slide-overlay-background, none);
    mix-blend-mode: var(--hd-slide-overlay-mix-blend-mode, normal);
    opacity: var(--hd-slide-overlay-opacity, 1);
    z-index: 100;
  }
`;

