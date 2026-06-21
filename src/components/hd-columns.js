const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: var(--hd-columns-gap, 40px);
    margin-bottom: var(--hd-columns-margin-bottom, 1.5rem);
  }
</style>
<slot></slot>
`;

export class HdColumns extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}
