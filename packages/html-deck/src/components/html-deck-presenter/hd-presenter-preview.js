export class HdPresenterPreview extends HTMLElement {
  static get observedAttributes() {
    return ['channel'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        .preview-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #000000;
          border-radius: 8px;
        }
        .preview-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          flex-shrink: 0;
          background-color: var(--hd-base-soft-background-color);
          display: block;
        }
        .end-presentation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-family: var(--hd-presenter-font);
          font-size: var(--hd-presenter-preview-size);
          font-weight: 600;
          color: var(--hd-presenter-accent-color);
        }
      </style>
      <style id="preview-styles"></style>
      <div class="preview-wrapper">
        <div class="preview-container" id="preview-container">
          <slot></slot>
        </div>
      </div>
    `;
    this.handleMessage = this.handleMessage.bind(this);
    this.resizePreview = this.resizePreview.bind(this);
    this.aspectRatio = '16:9';
    this.themeVariables = {};
    this.lastThemeVariablesKey = '';
    this.resizeObserver = null;
    this.channel = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'channel' && this.channel) {
      this.channel.removeEventListener('message', this.handleMessage);
      this.channel.close();
      const channelName = newValue || new URLSearchParams(window.location.search).get('channel') || 'hd-deck-channel';
      this.channel = new BroadcastChannel(channelName);
      this.channel.addEventListener('message', this.handleMessage);
      this.channel.postMessage({ type: 'request-sync' });
    }
  }

  connectedCallback() {
    const channelName = this.getAttribute('channel') || new URLSearchParams(window.location.search).get('channel') || 'hd-deck-channel';
    this.channel = new BroadcastChannel(channelName);
    this.channel.addEventListener('message', this.handleMessage);
    const wrapper = this.shadowRoot.querySelector('.preview-wrapper');
    if (wrapper) {
      this.resizeObserver = new ResizeObserver(() => this.resizePreview());
      this.resizeObserver.observe(wrapper);
    }
    this.channel.postMessage({ type: 'request-sync' });
  }

  disconnectedCallback() {
    if (this.channel) {
      this.channel.removeEventListener('message', this.handleMessage);
      this.channel.close();
      this.channel = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  handleMessage(event) {
    const { type, activeHTML, nextTitle, nextHTML, aspectRatio, themeVariables } = event.data;
    if (type === 'sync') {
      this.aspectRatio = aspectRatio || '16:9';
      this.themeVariables = themeVariables || {};
      const typeAttr = this.getAttribute('type') || 'next';

      let targetHTML = '';
      if (typeAttr === 'current') {
        targetHTML = activeHTML;
      } else {
        targetHTML = nextHTML;
      }

      if (targetHTML) {
        // Performance Check: Only update style block if variables have actually changed
        const varsKey = JSON.stringify(this.themeVariables);
        if (varsKey !== this.lastThemeVariablesKey) {
          const stylesContainer = this.shadowRoot.getElementById('preview-styles');
          if (stylesContainer) {
            let cssContent = ':host {\n';
            for (const [prop, val] of Object.entries(this.themeVariables)) {
              cssContent += `  ${prop}: ${val};\n`;
            }
            cssContent += '}';
            stylesContainer.textContent = cssContent;
          }
          this.lastThemeVariablesKey = varsKey;
        }

        this.innerHTML = targetHTML;
        const slide = this.querySelector('hd-slide');
        if (slide) {
          slide.setAttribute('active', '');
          slide.setAttribute('transition-style', 'none');
        }

        // Force browser repaint/reflow to avoid GPU compositing bugs under scale transforms (black screen)
        const containerEl = this.shadowRoot.getElementById('preview-container');
        if (containerEl) {
          containerEl.style.display = 'none';
          containerEl.offsetHeight; // trigger reflow
          containerEl.style.display = 'block';
        }

        // Use requestAnimationFrame to ensure styles have been evaluated and layout is ready
        requestAnimationFrame(() => {
          this.resizePreview();
        });
      } else {
        const placeholderText = typeAttr === 'current' ? 'No slide' : (nextTitle || 'End of Presentation');
        this.innerHTML = `<div class="end-presentation">${placeholderText}</div>`;
      }
    }
  }

  resizePreview() {
    const wrapper = this.shadowRoot.querySelector('.preview-wrapper');
    const container = this.shadowRoot.querySelector('.preview-container');
    if (!wrapper || !container) return;

    const wWidth = wrapper.clientWidth;
    const wHeight = wrapper.clientHeight;

    let ratio = 16 / 9;
    const attr = this.aspectRatio || '16:9';
    if (attr.includes(':')) {
      const [w, h] = attr.split(':').map(Number);
      if (w && h) ratio = w / h;
    } else {
      const num = Number(attr);
      if (!isNaN(num) && num > 0) ratio = num;
    }

    const baseHeight = 540;
    const baseWidth = baseHeight * ratio;

    const scaleX = wWidth / baseWidth;
    const scaleY = wHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    container.style.width = `${baseWidth}px`;
    container.style.height = `${baseHeight}px`;
    // Use translate(-50%, -50%) to offset the top/left 50% absolute positioning centering
    container.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
}
