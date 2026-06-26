export class HdPresenterStatus extends HTMLElement {
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
          font-family: var(--hd-presenter-font);
          font-size: var(--hd-presenter-status-size);
          font-weight: 700;
          color: var(--hd-presenter-text-color);
          text-align: center;
        }
      </style>
      <div id="status">Slide 0 / 0</div>
    `;
    this.handleMessage = this.handleMessage.bind(this);
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
    this.channel.postMessage({ type: 'request-sync' });
  }

  disconnectedCallback() {
    if (this.channel) {
      this.channel.removeEventListener('message', this.handleMessage);
      this.channel.close();
      this.channel = null;
    }
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
