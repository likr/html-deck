export class HdTable extends HTMLElement {
  static get observedAttributes() {
    return ['scrollable'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: var(--hd-table-margin-bottom, 1rem);
          width: 100%;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--hd-scrollbar-thumb, rgba(0, 0, 0, 0.2)) transparent;
        }

        /* Scrollable option height styling */
        :host([scrollable]) .table-wrapper {
          max-height: var(--scroll-height, 250px);
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--hd-body-font, inherit);
          font-size: var(--hd-table-font-size, 0.75rem);
          color: var(--hd-table-text-color, var(--hd-slide-text-color, var(--hd-text-color, #1e293b)));
          background-color: var(--hd-table-bg, transparent);
        }

        th, td {
          padding: var(--hd-table-cell-padding, 0.4rem 0.6rem);
          text-align: var(--hd-table-align, left);
          border-bottom: 1px solid var(--hd-table-border-color, var(--hd-border, rgba(0, 0, 0, 0.1)));
        }

        th {
          font-weight: 700;
          background-color: var(--hd-table-header-bg, var(--hd-primary-muted, rgba(59, 130, 246, 0.05)));
          color: var(--hd-table-header-text-color, var(--hd-slide-text-color, var(--hd-text-color, #1e293b)));
          border-bottom: 2px solid var(--hd-table-border-color, var(--hd-border, rgba(0, 0, 0, 0.15)));
        }

        tr:nth-child(even) {
          background-color: var(--hd-table-stripe-bg, rgba(0, 0, 0, 0.02));
        }

        /* Hover effect */
        tr:hover {
          background-color: var(--hd-table-hover-bg, rgba(59, 130, 246, 0.03));
        }
      </style>
      <div class="table-wrapper">
        <div id="table-container"></div>
      </div>
      <slot id="table-slot" style="display: none;"></slot>
    `;
  }

  connectedCallback() {
    this.updateScrollable();

    const slot = this.shadowRoot.getElementById('table-slot');
    slot.addEventListener('slotchange', () => {
      const assigned = slot.assignedElements();
      const table = assigned.find(el => el.tagName === 'TABLE');
      const container = this.shadowRoot.getElementById('table-container');
      container.innerHTML = '';
      if (table) {
        const cloned = table.cloneNode(true);
        container.appendChild(cloned);
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
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
}
