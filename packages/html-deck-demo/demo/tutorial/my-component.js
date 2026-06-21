// Define a WebComponent in Vanilla JS
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<p>Hello, World!</p>`;
  }
}
customElements.define('my-component', MyComponent);
