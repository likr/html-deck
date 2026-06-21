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
    --hd-muted-color: var(--hd-bg, rgba(255, 255, 255, 0.7));
  }

  :host([bg="primary"]) {
    --hd-slide-bg: var(--hd-primary, #3b82f6);
    --hd-slide-text-color: #ffffff;
    --hd-muted-color: rgba(255, 255, 255, 0.8);
  }

  :host([bg="secondary"]) {
    --hd-slide-bg: var(--hd-secondary, #a855f7);
    --hd-slide-text-color: #ffffff;
    --hd-muted-color: rgba(255, 255, 255, 0.8);
  }

  /* Transitions */
  :host([transition-style="fade"]) {
    transition: opacity 0.4s ease, visibility 0.4s ease;
  }
  
  :host([transition-style="none"]) {
    transition: none;
  }

  /* Slide Content Box styling - Plain, left-aligned, stacked by default */
  .slide-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: var(--hd-title-slide-padding, var(--hd-slide-padding, 40px 50px));
    justify-content: var(--hd-title-slide-justify, center);
    align-items: var(--hd-title-slide-align-items, flex-start);
    text-align: var(--hd-title-slide-text-align, left);
  }

  .title-section {
    margin-top: var(--hd-title-slide-title-margin-top, auto);
    margin-bottom: var(--hd-title-slide-title-margin-bottom, 0.5rem);
    width: 100%;
  }

  ::slotted([slot="title"]) {
    margin: 0 0 0.5rem 0 !important;
    font-size: var(--hd-title-slide-title-size, 2.5rem);
    font-weight: 800;
    line-height: 1.2;
    color: var(--hd-title-slide-title-color, var(--hd-heading-color-1, var(--hd-primary, #3b82f6)));
    font-family: var(--hd-heading-font, inherit);
  }

  ::slotted([slot="subtitle"]) {
    margin: 0 !important;
    font-size: var(--hd-title-slide-subtitle-size, 1.2rem);
    font-weight: 400;
    color: var(--hd-title-slide-subtitle-color, var(--hd-muted-color, #64748b));
    font-family: var(--hd-body-font, inherit);
  }

  .divider {
    width: var(--hd-title-slide-divider-width, 100%);
    height: var(--hd-title-slide-divider-height, 1px);
    background: var(--hd-title-slide-divider-bg, var(--hd-border-color, rgba(0, 0, 0, 0.1)));
    margin: var(--hd-title-slide-divider-margin, 1rem 0);
    opacity: var(--hd-title-slide-divider-opacity, 0.6);
  }

  .meta-section {
    display: flex;
    flex-direction: var(--hd-title-slide-meta-direction, column);
    flex-wrap: wrap;
    justify-content: var(--hd-title-slide-meta-justify, flex-start);
    align-items: var(--hd-title-slide-meta-align-items, flex-start);
    gap: var(--hd-title-slide-meta-gap, 0.5rem);
    margin-bottom: var(--hd-title-slide-meta-margin-bottom, auto);
    font-size: var(--hd-title-slide-meta-size, 0.75rem);
    color: var(--hd-title-slide-meta-color, var(--hd-muted-color, #64748b));
    font-family: var(--hd-body-font, inherit);
    width: 100%;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    align-items: var(--hd-title-slide-meta-item-align-items, flex-start);
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
  }
</style>
<div class="slide-content">
  <div class="title-section">
    <slot name="title"></slot>
    <slot name="subtitle"></slot>
  </div>
  
  <div class="divider"></div>
  
  <div class="meta-section">
    <div class="meta-item">
      <slot name="presenter"></slot>
    </div>
    <div class="meta-item">
      <slot name="location"></slot>
    </div>
    <div class="meta-item">
      <slot name="date"></slot>
    </div>
  </div>
  
  <slot></slot>
</div>
`;

export class HdTitleSlide extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'transition-style'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
