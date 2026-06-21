const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: block;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000000;
    color: var(--hd-text-color, #f8fafc);
    font-family: var(--hd-font-family, system-ui, -apple-system, sans-serif);
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
    color: var(--hd-text-color, #f8fafc);
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
      this.slides = Array.from(this.querySelectorAll('hd-slide'));
      
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
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.channel.removeEventListener('message', this.handleMessage);
    this.channel.close();
  }

  handleKeyDown(event) {
    // Ignore keys when typing in inputs/textareas
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
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
    
    // Width is always 1920, height is derived from aspect ratio.
    const baseWidth = 1920;
    const baseHeight = 1920 / ratio;

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
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.setAttribute('active', '');
      } else {
        slide.removeAttribute('active');
      }
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

  syncPresenter() {
    const activeSlide = this.slides[this.currentIndex];
    const notesEl = activeSlide ? activeSlide.querySelector('hd-notes') : null;
    const notesText = notesEl ? notesEl.innerHTML : 'No notes.';

    const nextSlide = this.slides[this.currentIndex + 1];
    const nextTitle = nextSlide ? (nextSlide.getAttribute('title') || `Slide ${this.currentIndex + 2}`) : 'End of Deck';

    this.channel.postMessage({
      type: 'sync',
      index: this.currentIndex,
      total: this.slides.length,
      notes: notesText,
      nextTitle: nextTitle
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
