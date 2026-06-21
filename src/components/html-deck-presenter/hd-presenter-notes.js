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
