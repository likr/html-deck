export class HdPresenterNotes extends HTMLElement {
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
