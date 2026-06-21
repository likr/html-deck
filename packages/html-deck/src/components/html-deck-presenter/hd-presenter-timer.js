const channel = new BroadcastChannel('hd-deck-channel');

function requestSync() {
  channel.postMessage({ type: 'request-sync' });
}

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
