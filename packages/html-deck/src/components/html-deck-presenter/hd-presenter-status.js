export class HdPresenterStatus extends HTMLElement {
  static get observedAttributes() {
    return [];
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
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.channel = null;
    this.presenter = null;
  }

  setupChannel() {
    if (this.channel) {
      this.channel.removeEventListener('message', this.handleMessage);
      this.channel.close();
      this.channel = null;
    }
    const presenter = this.closest('hd-presenter');
    const channelName = (presenter && presenter.getAttribute('presenter-channel')) || 'hd-deck-channel';
    this.channel = new BroadcastChannel(channelName);
    this.channel.addEventListener('message', this.handleMessage);
  }

  handleChannelChange(event) {
    this.setupChannel();
    if (this.channel) {
      this.channel.postMessage({ type: 'request-sync' });
    }
  }

  connectedCallback() {
    this.setupChannel();
    if (this.channel) {
      this.channel.postMessage({ type: 'request-sync' });
    }

    this.presenter = this.closest('hd-presenter');
    if (this.presenter) {
      this.presenter.addEventListener('presenter-channel-change', this.handleChannelChange);
    }
  }

  disconnectedCallback() {
    if (this.presenter) {
      this.presenter.removeEventListener('presenter-channel-change', this.handleChannelChange);
      this.presenter = null;
    }
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
