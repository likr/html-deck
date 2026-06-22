import { HdBaseSlide } from './hd-base-slide.js';

const LAYOUT_HTML = `
  <style>
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
      width: 100%;
      flex-grow: 1;
    }
    .title-area {
      margin-bottom: 16px;
      width: 100%;
    }
    .subtitle-area {
      margin-bottom: 24px;
      width: 100%;
    }
    .meta-area {
      width: 100%;
    }
    /* Hide page number by default on cover slides */
    #page-num {
      display: none !important;
    }
  </style>
  <div class="cover-container">
    <div class="title-area">
      <slot name="title"></slot>
    </div>
    <div class="subtitle-area">
      <slot name="subtitle"></slot>
    </div>
    <div class="meta-area">
      <slot name="meta"></slot>
    </div>
  </div>
`;

export class HdSlideCover extends HdBaseSlide {
  constructor() {
    super(LAYOUT_HTML);
  }

  // Override to ensure page number remains hidden by default
  updatePageNumber() {
    const pageNumEl = this.shadowRoot.getElementById('page-num');
    if (!pageNumEl) return;

    // Only show page number if show-page-number attribute is explicitly set
    if (this.hasAttribute('show-page-number')) {
      super.updatePageNumber();
    } else {
      pageNumEl.style.display = 'none';
    }
  }
}
