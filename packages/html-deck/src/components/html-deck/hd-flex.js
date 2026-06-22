const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host {
    display: flex;
    flex-direction: var(--hd-flex-direction, row);
    gap: var(--hd-flex-gap, var(--hd-gap-md, 16px));
    align-items: var(--hd-flex-align, stretch);
    justify-content: var(--hd-flex-justify, flex-start);
    width: 100%;
    box-sizing: border-box;
  }
</style>
<slot></slot>
`;

export class HdFlex extends HTMLElement {
  static get observedAttributes() {
    return ['direction', 'gap', 'align', 'justify'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this.updateLayout();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.updateLayout();
  }

  updateLayout() {
    const direction = this.getAttribute('direction') || 'row';
    const gap = this.getAttribute('gap') || 'md';
    const align = this.getAttribute('align') || 'stretch';
    const justify = this.getAttribute('justify') || 'flex-start';

    this.style.setProperty('--hd-flex-direction', direction);
    this.style.setProperty('--hd-flex-align', align);
    this.style.setProperty('--hd-flex-justify', justify);

    const presetGaps = ['xs', 'sm', 'md', 'lg', 'xl'];
    if (presetGaps.includes(gap)) {
      this.style.setProperty('--hd-flex-gap', `var(--hd-gap-${gap})`);
    } else {
      this.style.setProperty('--hd-flex-gap', gap);
    }
  }
}
