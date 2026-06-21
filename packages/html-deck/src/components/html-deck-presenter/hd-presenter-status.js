const channel = new BroadcastChannel('hd-deck-channel');

function requestSync() {
  channel.postMessage({ type: 'request-sync' });
}

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
      const displayTotal = total || 0;
      const displayIndex = displayTotal > 0 ? index + 1 : 0;
      this.shadowRoot.getElementById('status').textContent = `Slide ${displayIndex} / ${displayTotal}`;
    }
  }
}
