// HTML-Deck Main Module Entry File
// Registers deck custom elements.

import './html-deck.css';

import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlide } from './components/html-deck/hd-slide.js';
import { HdLayout } from './components/html-deck/hd-layout.js';
import { HdLayoutSplit } from './components/html-deck/hd-layout-split.js';
import { HdLayoutCover } from './components/html-deck/hd-layout-cover.js';
import { HdLayoutGrid } from './components/html-deck/hd-layout-grid.js';
import { HdCard } from './components/html-deck/hd-card.js';
import { HdBox } from './components/html-deck/hd-box.js';
import { HdCallout } from './components/html-deck/hd-callout.js';

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide', HdSlide);
customElements.define('hd-layout', HdLayout);
customElements.define('hd-layout-split', HdLayoutSplit);
customElements.define('hd-layout-cover', HdLayoutCover);
customElements.define('hd-layout-grid', HdLayoutGrid);
customElements.define('hd-card', HdCard);
customElements.define('hd-box', HdBox);
customElements.define('hd-callout', HdCallout);


