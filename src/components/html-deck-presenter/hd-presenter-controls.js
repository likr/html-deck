const channel = new BroadcastChannel('hd-deck-channel');

export class HdPresenterControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: 16px;
          width: 100%;
        }
        .btn {
          flex: 1;
          background-color: var(--hd-presenter-btn-bg, #3b82f6);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 14px 20px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s, transform 0.1s;
        }
        .btn:hover {
          background-color: var(--hd-presenter-btn-hover-bg, #2563eb);
        }
        .btn:active {
          transform: scale(0.98);
        }
        .btn-secondary {
          background-color: var(--hd-presenter-btn-sec-bg, rgba(255, 255, 255, 0.08));
          border: 1px solid var(--hd-presenter-btn-sec-border, rgba(255, 255, 255, 0.08));
        }
        .btn-secondary:hover {
          background-color: var(--hd-presenter-btn-sec-hover-bg, rgba(255, 255, 255, 0.15));
        }
      </style>
      <button class="btn btn-secondary" id="prev">◀ Previous</button>
      <button class="btn" id="next">Next ▶</button>
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
