// Declarative Presenter Components for HTML-Deck
// These elements automatically sync with the main deck via BroadcastChannel.

const channel = new BroadcastChannel('hd-deck-channel');

// Request initial sync when any presenter component mounts
function requestSync() {
  channel.postMessage({ type: 'request-sync' });
}

// 1. HD Presenter Timer
export class HdPresenterTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.startTime = Date.now();
    this.timerInterval = null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: var(--hd-presenter-font, monospace);
        }
        .timer-val {
          font-size: var(--hd-presenter-timer-size, 1.8rem);
          font-weight: bold;
          color: var(--hd-presenter-timer-color, #ffffff);
        }
        .reset-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s;
        }
        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      </style>
      <div class="timer-val" id="timer">00:00:00</div>
      <button class="reset-btn" id="reset">Reset</button>
    `;
  }

  connectedCallback() {
    this.start();
    this.shadowRoot.getElementById('reset').addEventListener('click', () => this.start());
    requestSync();
  }

  disconnectedCallback() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  start() {
    this.startTime = Date.now();
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    const timerVal = this.shadowRoot.getElementById('timer');
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const totalSecs = Math.floor(elapsed / 1000);
      const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSecs % 60).padStart(2, '0');
      timerVal.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }
}

// 2. HD Presenter Clock
export class HdPresenterClock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.clockInterval = null;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--hd-presenter-font, monospace);
          font-size: var(--hd-presenter-clock-size, 1.8rem);
          font-weight: bold;
          color: var(--hd-presenter-clock-color, #ffffff);
        }
      </style>
      <div id="clock">12:00:00 PM</div>
    `;
  }

  connectedCallback() {
    const update = () => {
      const now = new Date();
      this.shadowRoot.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    this.clockInterval = setInterval(update, 1000);
    update();
  }

  disconnectedCallback() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}

// 3. HD Presenter Status
export class HdPresenterStatus extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-size: var(--hd-presenter-status-size, 2rem);
          font-weight: 700;
          color: var(--hd-presenter-status-color, #ffffff);
          text-align: center;
        }
      </style>
      <div id="status">Slide 0 / 0</div>
    `;
    this.handleMessage = this.handleMessage.bind(this);
  }

  connectedCallback() {
    channel.addEventListener('message', this.handleMessage);
    requestSync();
  }

  disconnectedCallback() {
    channel.removeEventListener('message', this.handleMessage);
  }

  handleMessage(event) {
    const { type, index, total } = event.data;
    if (type === 'sync') {
      this.shadowRoot.getElementById('status').textContent = `Slide ${index + 1} / ${total}`;
    }
  }
}

// 4. HD Presenter Preview
export class HdPresenterPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-size: var(--hd-presenter-preview-size, 1.4rem);
          font-weight: 600;
          color: var(--hd-presenter-preview-color, #10b981);
        }
      </style>
      <div id="preview">None</div>
    `;
    this.handleMessage = this.handleMessage.bind(this);
  }

  connectedCallback() {
    channel.addEventListener('message', this.handleMessage);
    requestSync();
  }

  disconnectedCallback() {
    channel.removeEventListener('message', this.handleMessage);
  }

  handleMessage(event) {
    const { type, nextTitle } = event.data;
    if (type === 'sync') {
      this.shadowRoot.getElementById('preview').textContent = nextTitle || 'End of Presentation';
    }
  }
}

// 5. HD Presenter Notes
export class HdPresenterNotes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-size: var(--hd-presenter-notes-size, 1.5rem);
          line-height: 1.6;
          color: var(--hd-presenter-notes-color, #e2e8f0);
        }
        .empty-notes {
          color: #64748b;
          font-style: italic;
        }
        p {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        ul, ol {
          margin-top: 0;
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        li {
          margin-bottom: 0.75rem;
        }
      </style>
      <div id="notes">
        <div class="empty-notes">No speaker notes provided.</div>
      </div>
    `;
    this.handleMessage = this.handleMessage.bind(this);
  }

  connectedCallback() {
    channel.addEventListener('message', this.handleMessage);
    requestSync();
  }

  disconnectedCallback() {
    channel.removeEventListener('message', this.handleMessage);
  }

  handleMessage(event) {
    const { type, notes } = event.data;
    if (type === 'sync') {
      const container = this.shadowRoot.getElementById('notes');
      if (notes && notes.trim() !== '') {
        container.innerHTML = notes;
      } else {
        container.innerHTML = '<div class="empty-notes">No speaker notes for this slide.</div>';
      }
    }
  }
}

// 6. HD Presenter Controls
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
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      channel.postMessage({ type: 'nav', action: 'next' });
    } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      event.preventDefault();
      channel.postMessage({ type: 'nav', action: 'prev' });
    }
  }
}
