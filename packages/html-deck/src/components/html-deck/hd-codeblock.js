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

export class HdCodeblock extends HTMLElement {
  static get observedAttributes() {
    return ['language', 'scrollable'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Resolve the Prism CSS URL dynamically.
    // The built prism.css is copied to dist/ at build time.
    const prismCssUrl = resolveAssetUrl('prism.css', import.meta.url);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${prismCssUrl}">
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-codeblock-margin-bottom, 12px);
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          font-size: var(--hd-codeblock-font-size, 11px);
          border-radius: 8px;
          overflow: hidden;
        }
        pre {
          margin: 0 !important;
          padding: 12px !important;
          background: var(--hd-codeblock-bg, #f8fafc) !important;
          border: 1px solid var(--hd-codeblock-border, #e2e8f0);
          border-radius: 8px;
          overflow: auto;
        }
        :host([scrollable]) pre {
          max-height: var(--scroll-height, 250px) !important;
          overflow-y: auto !important;
        }
        code {
          font-family: inherit !important;
          text-shadow: none !important;
          color: var(--hd-codeblock-text, #0f172a) !important;
        }
        /* Prism token overrides using CSS variables */
        .token.comment, .token.prolog, .token.doctype, .token.cdata {
          color: var(--hd-token-comment, #64748b) !important;
          font-style: italic;
        }
        .token.punctuation {
          color: var(--hd-token-operator, #475569) !important;
        }
        .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted {
          color: var(--hd-token-number, #2563eb) !important;
        }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted {
          color: var(--hd-token-string, #059669) !important;
        }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
          color: var(--hd-token-operator, #475569) !important;
        }
        .token.atrule, .token.attr-value, .token.keyword {
          color: var(--hd-token-keyword, #d97706) !important;
        }
        .token.function, .token.class-name {
          color: var(--hd-token-function, #7c3aed) !important;
        }
        .token.regex, .token.important, .token.variable {
          color: var(--hd-token-variable, #475569) !important;
        }
      </style>
      <pre><code id="code-output"></code></pre>
    `;
  }

  connectedCallback() {
    this.updateScrollable();
    this.highlight();

    // Observe textContent changes in Light DOM
    this.observer = new MutationObserver(() => {
      this.highlight();
    });
    this.observer.observe(this, { childList: true, characterData: true, subtree: true });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'language') {
      this.highlight();
    }
    if (name === 'scrollable') {
      this.updateScrollable();
    }
  }

  updateScrollable() {
    const scrollable = this.getAttribute('scrollable');
    if (scrollable !== null) {
      let height = '250px';
      if (scrollable !== '' && scrollable !== 'true') {
        height = scrollable;
      }
      this.style.setProperty('--scroll-height', height);
    } else {
      this.style.removeProperty('--scroll-height');
    }
  }

  highlight() {
    const codeOutput = this.shadowRoot.getElementById('code-output');
    if (!codeOutput) return;

    const lang = this.getAttribute('language') || 'javascript';
    codeOutput.className = `language-${lang}`;
    
    // Trim raw code from textContent
    let codeText = this.textContent.trim();
    
    // Decode HTML entities (e.g. &lt; -> <)
    const textarea = document.createElement('textarea');
    textarea.innerHTML = codeText;
    codeText = textarea.value;

    codeOutput.textContent = codeText;
    
    // Trigger Prism highlight
    if (window.Prism) {
      window.Prism.highlightElement(codeOutput);
    }
  }
}
