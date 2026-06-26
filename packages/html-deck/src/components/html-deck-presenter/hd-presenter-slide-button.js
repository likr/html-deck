export class HdPresenterSlideButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .btn {
          background-color: rgba(from var(--hd-presenter-text-color) r g b / 0.08);
          border: 1px solid var(--hd-presenter-border-color);
          color: var(--hd-presenter-text-color);
          border-radius: 8px;
          padding: var(--hd-presenter-btn-padding);
          font-size: var(--hd-presenter-btn-font-size);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s, transform 0.1s;
          font-family: var(--hd-presenter-font);
        }
        .btn:hover {
          background-color: rgba(from var(--hd-presenter-text-color) r g b / 0.15);
        }
        .btn:active {
          transform: scale(0.98);
        }
      </style>
      <button class="btn" id="btn-el">
        <slot>Show Slides</slot>
      </button>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('btn-el').addEventListener('click', () => {
      if (window.opener && !window.opener.closed) {
        window.opener.focus();
      } else {
        const channel = new BroadcastChannel('hd-deck-channel');
        channel.postMessage({ type: 'focus-deck' });
        channel.close();
      }
    });
  }
}
