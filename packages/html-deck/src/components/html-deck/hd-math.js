function resolveAssetUrl(assetName, moduleUrl) {
  if (moduleUrl.includes('/src/')) {
    return new URL(`../../../dist/${assetName}`, moduleUrl).href;
  }
  if (moduleUrl.includes('/node_modules/.vite/deps/')) {
    const match = moduleUrl.match(/^(.*)\/node_modules\/\.vite\/deps\//);
    if (match) {
      return `${match[1]}/node_modules/html-deck/dist/${assetName}`;
    }
  }
  return new URL(`./${assetName}`, moduleUrl).href;
}

export class HdMath extends HTMLElement {
  static get observedAttributes() {
    return ['block'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Resolve the KaTeX CSS URL dynamically.
    // The built katex.min.css is copied to dist/ at build time.
    const katexCssUrl = resolveAssetUrl('katex.min.css', import.meta.url);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${katexCssUrl}">
      <style>
        :host {
          display: inline-block;
          color: var(--hd-math-color, inherit);
        }
        :host([block]) {
          display: block;
          text-align: center;
          margin: var(--hd-math-block-margin, 12px 0);
        }
      </style>
      <span id="math-output"></span>
    `;
  }

  connectedCallback() {
    this.renderMath();

    // Inject KaTeX CSS globally if not already present, to register @font-face rules globally.
    // Web fonts must be declared in the global context for the browser to register them.
    const katexCssUrl = resolveAssetUrl('katex.min.css', import.meta.url);
    const linkId = 'global-katex-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = katexCssUrl;
      document.head.appendChild(link);
    }

    // Observe textContent changes in Light DOM
    this.observer = new MutationObserver(() => {
      this.renderMath();
    });
    this.observer.observe(this, { childList: true, characterData: true, subtree: true });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'block' && oldValue !== newValue) {
      this.renderMath();
    }
  }

  renderMath() {
    const output = this.shadowRoot.getElementById('math-output');
    if (!output || !window.katex) return;

    const isBlock = this.hasAttribute('block');
    let formulaText = this.textContent.trim();

    // Decode HTML entities
    const doc = new DOMParser().parseFromString(formulaText, 'text/html');
    formulaText = doc.documentElement.textContent || formulaText;

    try {
      window.katex.render(formulaText, output, {
        displayMode: isBlock,
        throwOnError: false
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      output.textContent = formulaText;
    }
  }
}
