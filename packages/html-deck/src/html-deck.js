// HTML-Deck Main Module Entry File
// Registers deck custom elements.

import './html-deck.css';

import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlide } from './components/html-deck/hd-slide.js';
import { HdLayoutStandard } from './components/html-deck/hd-layout-standard.js';
import { HdLayoutSplit } from './components/html-deck/hd-layout-split.js';
import { HdLayoutCover } from './components/html-deck/hd-layout-cover.js';

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide', HdSlide);
customElements.define('hd-layout-standard', HdLayoutStandard);
customElements.define('hd-layout-split', HdLayoutSplit);
customElements.define('hd-layout-cover', HdLayoutCover);

