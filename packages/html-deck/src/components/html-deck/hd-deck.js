const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000000;
    color: var(--hd-deck-text-color, var(--hd-text-color, #1e293b));
    font-family: var(--hd-body-font, var(--hd-font-family, system-ui, -apple-system, sans-serif));
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .deck-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .deck-container {
    position: relative;
    transform-origin: center center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
  }

  /* Navigation UI controls */
  .controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 100;
    opacity: 0.1;
    transition: opacity 0.3s;
  }

  .controls:hover {
    opacity: 0.9;
  }

  .btn {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--hd-btn-text, #ffffff);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.1s;
    backdrop-filter: blur(4px);
  }

  .btn:hover {
    background: rgba(51, 65, 85, 0.9);
  }

  .btn:active {
    transform: scale(0.95);
  }

  /* Progress bar */
  .progress-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 99;
  }

  .progress-bar {
    height: 100%;
    width: 0%;
    background: var(--hd-primary, #3b82f6);
    transition: width 0.3s ease;
  }

  /* Print Styles */
  @media print {
    :host {
      width: auto !important;
      height: auto !important;
      overflow: visible !important;
      background: none !important;
    }
    .deck-wrapper {
      display: block !important;
      height: auto !important;
      overflow: visible !important;
    }
    .deck-container {
      width: auto !important;
      height: auto !important;
      transform: none !important;
      box-shadow: none !important;
      overflow: visible !important;
      display: block !important;
    }
    .controls, .progress-container {
      display: none !important;
    }
  }
</style>
<div class="deck-wrapper">
  <div class="deck-container">
    <slot></slot>
  </div>
  <div class="controls">
    <button class="btn" id="prev-btn" title="Previous (Left Arrow)">◀</button>
    <button class="btn" id="next-btn" title="Next (Right Arrow / Space)">▶</button>
    <button class="btn" id="fullscreen-btn" title="Fullscreen (F)">⛶</button>
    <button class="btn" id="presenter-btn" title="Presenter View (P)">👤</button>
  </div>
  <div class="progress-container">
    <div class="progress-bar" id="progress"></div>
  </div>
</div>
`;

export class HdDeck extends HTMLElement {
  static get observedAttributes() {
    return ['aspect-ratio', 'presenter-url', 'transition', 'hide-page-number'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));

    this.currentIndex = 0;
    this.slides = [];
    this.resizeObserver = null;
    this.channel = new BroadcastChannel('hd-deck-channel');

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'aspect-ratio') {
      this.setupPrintStyles();
      this.handleResize();
    }
    if (name === 'presenter-url') {
      const presenterBtn = this.shadowRoot.getElementById('presenter-btn');
      if (presenterBtn) {
        if (newValue) {
          presenterBtn.style.display = 'flex';
        } else {
          presenterBtn.style.display = 'none';
        }
      }
    }
    if (name === 'transition') {
      if (this.slides) {
        this.slides.forEach(slide => slide.setAttribute('transition-style', newValue || 'fade'));
      }
    }
    if (name === 'hide-page-number') {
      this.updateSlides();
    }
  }

  connectedCallback() {
    // Automatically set body margin to 0
    document.body.style.margin = '0';

    // Event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    
    const container = this.shadowRoot.querySelector('.deck-container');
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.shadowRoot.querySelector('.deck-wrapper'));

    this.shadowRoot.getElementById('prev-btn').addEventListener('click', () => this.prev());
    this.shadowRoot.getElementById('next-btn').addEventListener('click', () => this.next());
    this.shadowRoot.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
    
    // Show/Hide Presenter button based on presenter-url availability
    const presenterUrl = this.getAttribute('presenter-url');
    const presenterBtn = this.shadowRoot.getElementById('presenter-btn');
    if (presenterUrl) {
      presenterBtn.style.display = 'flex';
      presenterBtn.addEventListener('click', () => this.openPresenter());
    } else {
      presenterBtn.style.display = 'none';
    }

    // BroadcastChannel sync
    this.channel.addEventListener('message', this.handleMessage);

    // Wait for children to be parsed in DOM
    setTimeout(() => {
      this.slides = Array.from(this.querySelectorAll('hd-slide-standard, hd-slide-split, hd-slide-cover, hd-slide-blank'));
      
      // Set transition class
      const transition = this.getAttribute('transition') || 'fade';
      this.slides.forEach(slide => slide.setAttribute('transition-style', transition));

      // Handle hash route if present
      const hash = window.location.hash;
      if (hash.startsWith('#slide-')) {
        const pageNum = parseInt(hash.replace('#slide-', ''), 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.slides.length) {
          this.currentIndex = pageNum - 1;
        }
      }

      this.updateSlides();
      this.handleResize();
      this.setupPrintStyles();
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.channel.removeEventListener('message', this.handleMessage);
    this.channel.close();

    const styleEl = document.getElementById('hd-deck-print-styles');
    if (styleEl) {
      styleEl.remove();
    }
  }

  handleKeyDown(event) {
    // Ignore keys when typing in inputs/textareas
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
      return;
    }

    // Ignore keys when modifier keys are pressed (e.g. Ctrl+P for print, Command+R, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
      case 'Backspace':
        event.preventDefault();
        this.prev();
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        this.openPresenter();
        break;
    }
  }

  handleMessage(event) {
    const { type, action, index } = event.data;
    if (type === 'nav') {
      if (action === 'next') this.next();
      if (action === 'prev') this.prev();
      if (action === 'goto' && typeof index === 'number') this.goto(index);
    } else if (type === 'request-sync') {
      this.syncPresenter();
    }
  }

  setupPrintStyles() {
    const ratio = this.getAspectRatio();
    
    // Scale print page box dimensions based on a standard 5.625-inch height
    // which equals exactly 540px (5.625 * 96 = 540).
    // This perfectly aligns screen base dimensions with print page dimensions.
    const height = 5.625;
    const width = height * ratio;

    let styleEl = document.getElementById('hd-deck-print-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'hd-deck-print-styles';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @page {
        size: ${width}in ${height}in;
        margin: 0;
      }
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
  }

  getAspectRatio() {
    const attr = this.getAttribute('aspect-ratio') || '16:9';
    if (attr.includes(':')) {
      const [w, h] = attr.split(':').map(Number);
      if (w && h) return w / h;
    }
    const num = Number(attr);
    if (!isNaN(num) && num > 0) return num;
    return 16 / 9;
  }

  handleResize() {
    // Skip resize scaling in print mode
    if (window.matchMedia('print').matches) {
      return;
    }

    const wrapper = this.shadowRoot.querySelector('.deck-wrapper');
    const container = this.shadowRoot.querySelector('.deck-container');
    if (!wrapper || !container) return;

    const wWidth = wrapper.clientWidth;
    const wHeight = wrapper.clientHeight;
    
    const ratio = this.getAspectRatio();
    
    // Pin base height to 540px and derive width from ratio to align screen/print resolution.
    const baseHeight = 540;
    const baseWidth = baseHeight * ratio;

    const scaleX = wWidth / baseWidth;
    const scaleY = wHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    container.style.width = `${baseWidth}px`;
    container.style.height = `${baseHeight}px`;
    container.style.transform = `scale(${scale})`;
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.updateSlides();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlides();
    }
  }

  goto(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.updateSlides();
    }
  }

  updateSlides() {
    const hidePageNum = this.hasAttribute('hide-page-number');
    const totalSlides = this.slides.length;

    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.setAttribute('active', '');
      } else {
        slide.removeAttribute('active');
      }

      if (hidePageNum) {
        slide.setAttribute('hide-page-number', '');
      } else {
        slide.removeAttribute('hide-page-number');
      }

      slide.setAttribute('page-index', idx + 1);
      slide.setAttribute('page-total', totalSlides);
    });

    // Update progress bar
    const progress = this.shadowRoot.getElementById('progress');
    if (progress && this.slides.length > 1) {
      const percentage = (this.currentIndex / (this.slides.length - 1)) * 100;
      progress.style.width = `${percentage}%`;
    }

    // Sync hash
    window.location.hash = `slide-${this.currentIndex + 1}`;

    // Sync presenter view
    this.syncPresenter();
  }

  resolveRelativePaths(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);
    
    // Helper to make URLs absolute relative to current deck page
    const makeAbsolute = (attrName) => {
      clone.querySelectorAll(`[${attrName}]`).forEach(el => {
        const val = el.getAttribute(attrName);
        if (val && !val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('/') && !val.startsWith('data:')) {
          try {
            el.setAttribute(attrName, new URL(val, window.location.href).href);
          } catch (e) {
            console.warn(`Failed to resolve relative path for attribute ${attrName}: ${val}`, e);
          }
        }
      });
    };

    // Resolve 'src' and 'href' attributes
    makeAbsolute('src');
    makeAbsolute('href');

    return clone.outerHTML;
  }

  syncPresenter() {
    if (!this.slides || this.slides.length === 0) {
      this.slides = Array.from(this.querySelectorAll('hd-slide-standard, hd-slide-split, hd-slide-cover, hd-slide-blank'));
    }

    const activeSlide = this.slides[this.currentIndex];
    const activeHTML = activeSlide ? this.resolveRelativePaths(activeSlide) : '';
    const notesEl = activeSlide ? activeSlide.querySelector('hd-notes') : null;
    const notesText = notesEl ? notesEl.innerHTML : 'No notes.';

    const nextSlide = this.slides[this.currentIndex + 1];
    const nextTitle = nextSlide ? (nextSlide.getAttribute('title') || `Slide ${this.currentIndex + 2}`) : 'End of Deck';
    const nextHTML = nextSlide ? this.resolveRelativePaths(nextSlide) : '';

    this.channel.postMessage({
      type: 'sync',
      index: this.currentIndex,
      total: this.slides.length,
      notes: notesText,
      activeHTML: activeHTML,
      nextTitle: nextTitle,
      nextHTML: nextHTML,
      aspectRatio: this.getAttribute('aspect-ratio') || '16:9'
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  openPresenter() {
    const presenterUrl = this.getAttribute('presenter-url');
    if (!presenterUrl) return;
    const resolvedUrl = new URL(presenterUrl, window.location.href).href;
    window.open(resolvedUrl, 'Presenter View', 'width=1000,height=700');
    // Request sync immediately after window opens
    setTimeout(() => this.syncPresenter(), 500);
  }
}
