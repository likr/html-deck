export class HdNotes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none !important;
        }
      </style>
      <slot></slot>
    `;
  }
}
