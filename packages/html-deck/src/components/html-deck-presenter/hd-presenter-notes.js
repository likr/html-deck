const channel = new BroadcastChannel('hd-deck-channel');

function requestSync() {
  channel.postMessage({ type: 'request-sync' });
}

export class HdPresenterNotes extends HTMLElement {
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
