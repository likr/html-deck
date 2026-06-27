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
          font-family: var(--hd-presenter-font);
        }
        .timer-val {
          font-size: var(--hd-presenter-timer-size);
          font-weight: bold;
          color: var(--hd-presenter-text-color);
        }
        .reset-btn {
          background: rgba(from var(--hd-presenter-text-color) r g b / 0.1);
          border: 1px solid var(--hd-presenter-border-color);
          color: var(--hd-presenter-text-color);
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }
        .reset-btn:hover {
          background: rgba(from var(--hd-presenter-text-color) r g b / 0.2);
        }
      </style>
      <div class="timer-val" id="timer">00:00:00</div>
      <button class="reset-btn" id="reset">Reset</button>
    `;
  }

  connectedCallback() {
    this.start();
    this.shadowRoot.getElementById('reset').addEventListener('click', () => this.start());
    
    const presenter = this.closest('hd-presenter');
    const channelName = (presenter && presenter.getAttribute('presenter-channel')) || 'hd-deck-channel';
    const channel = new BroadcastChannel(channelName);
    channel.postMessage({ type: 'request-sync' });
    channel.close();
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
