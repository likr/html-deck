export class HdPresenterClock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.clockInterval = null;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--hd-presenter-font, monospace);
          font-size: var(--hd-presenter-clock-size, 1.8rem);
          font-weight: bold;
          color: var(--hd-presenter-clock-color, #ffffff);
        }
      </style>
      <div id="clock">12:00:00 PM</div>
    `;
  }

  connectedCallback() {
    const update = () => {
      const now = new Date();
      this.shadowRoot.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    this.clockInterval = setInterval(update, 1000);
    update();
  }

  disconnectedCallback() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}
