export class HdPresenterLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-weight: 800;
          font-size: 20px;
          background: linear-gradient(135deg, var(--hd-presenter-primary-color), var(--hd-presenter-accent-color));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          font-family: var(--hd-presenter-font);
        }
      </style>
      <slot>Presenter View</slot>
    `;
  }
}
