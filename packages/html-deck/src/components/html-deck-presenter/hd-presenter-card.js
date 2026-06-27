export class HdPresenterCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'grow'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background-color: var(--hd-presenter-panel-background-color);
          border: 1px solid var(--hd-presenter-border-color);
          border-radius: 12px;
          padding: var(--hd-presenter-card-padding);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          overflow: hidden;
        }
        .card-title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--hd-presenter-text-muted-color);
          margin-top: 0;
          margin-bottom: 12px;
          font-family: var(--hd-presenter-font);
        }
        .card-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
        }
      </style>
      <h3 class="card-title" id="title-el" style="display: none;"></h3>
      <div class="card-content">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    this.updateTitle();
    this.updateGrow();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && oldValue !== newValue) {
      this.updateTitle();
    }
    if (name === 'grow' && oldValue !== newValue) {
      this.updateGrow();
    }
  }

  updateGrow() {
    const grow = this.getAttribute('grow');
    if (grow) {
      this.style.flexGrow = grow;
    } else {
      this.style.removeProperty('flex-grow');
    }
  }

  updateTitle() {
    const titleEl = this.shadowRoot.getElementById('title-el');
    const titleAttr = this.getAttribute('title');
    if (titleAttr) {
      titleEl.textContent = titleAttr;
      titleEl.style.display = 'block';
    } else {
      titleEl.textContent = '';
      titleEl.style.display = 'none';
    }
  }
}
