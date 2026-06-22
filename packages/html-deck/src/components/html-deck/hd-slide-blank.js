import { HdBaseSlide } from './hd-base-slide.js';

const LAYOUT_HTML = `
  <style>
    /* Override standard slide content padding */
    :host-context(.slide-content), .slide-content {
      padding: 0 !important;
    }
    .blank-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
  </style>
  <div class="blank-container">
    <slot></slot>
  </div>
`;

export class HdSlideBlank extends HdBaseSlide {
  constructor() {
    super(LAYOUT_HTML);
  }
}
