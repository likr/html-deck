const channel = new BroadcastChannel('hd-deck-channel');

export class HdPresenterControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          gap: 8px;
          font-family: var(--hd-presenter-font);
        }
        .btn {
          background-color: rgba(from var(--hd-presenter-text-color) r g b / 0.08);
          border: 1px solid var(--hd-presenter-border-color);
          color: var(--hd-presenter-text-color);
          border-radius: 8px;
          padding: var(--hd-presenter-btn-padding);
          font-size: var(--hd-presenter-btn-font-size);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s, transform 0.1s;
          font-family: var(--hd-presenter-font);
        }
        .btn:hover {
          background-color: rgba(from var(--hd-presenter-text-color) r g b / 0.15);
        }
        .btn:active {
          transform: scale(0.98);
        }
        .btn-text {
          display: var(--hd-presenter-btn-text-display, inline);
        }
      </style>
      <button class="btn" id="prev" title="Previous Slide">
        <span>◀</span><span class="btn-text"> Previous</span>
      </button>
      <button class="btn" id="next" title="Next Slide">
        <span class="btn-text">Next </span><span>▶</span>
      </button>
    `;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.getElementById('prev').addEventListener('click', () => {
      channel.postMessage({ type: 'nav', action: 'prev' });
    });
    this.shadowRoot.getElementById('next').addEventListener('click', () => {
      channel.postMessage({ type: 'nav', action: 'next' });
    });
    window.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      channel.postMessage({ type: 'nav', action: 'next' });
    } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      event.preventDefault();
      channel.postMessage({ type: 'nav', action: 'prev' });
    }
  }
}
