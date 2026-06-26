export class HdPresenterNotes extends HTMLElement {
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
          font-size: var(--hd-presenter-notes-size);
          line-height: 1.6;
          color: var(--hd-presenter-text-color);
        }
        .empty-notes {
          color: var(--hd-presenter-text-muted-color);
          font-style: italic;
        }
        p {
          margin-top: 0;
          margin-bottom: 24px;
        }
        ul, ol {
          margin-top: 0;
          margin-bottom: 24px;
          padding-left: 32px;
        }
        li {
          margin-bottom: 12px;
        }
      </style>
      <div id="notes">
        <div class="empty-notes">No speaker notes provided.</div>
      </div>
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
