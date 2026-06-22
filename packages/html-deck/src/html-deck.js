// HTML-Deck Main Module Entry File
// Registers deck custom elements.

import './html-deck.css';

import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlide } from './components/html-deck/hd-slide.js';
import { HdLayoutStandard } from './components/html-deck/hd-layout-standard.js';
import { HdLayoutSplit } from './components/html-deck/hd-layout-split.js';
import { HdLayoutCover } from './components/html-deck/hd-layout-cover.js';
import { HdGrid } from './components/html-deck/hd-grid.js';
import { HdFlex } from './components/html-deck/hd-flex.js';
import { HdText } from './components/html-deck/hd-text.js';
import { HdList } from './components/html-deck/hd-list.js';
import { HdNotes } from './components/html-deck/hd-notes.js';
import { HdFootnote } from './components/html-deck/hd-footnote.js';
import { HdCallout } from './components/html-deck/hd-callout.js';

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide', HdSlide);
customElements.define('hd-layout-standard', HdLayoutStandard);
customElements.define('hd-layout-split', HdLayoutSplit);
customElements.define('hd-layout-cover', HdLayoutCover);
customElements.define('hd-grid', HdGrid);
customElements.define('hd-flex', HdFlex);
customElements.define('hd-text', HdText);
customElements.define('hd-list', HdList);
customElements.define('hd-notes', HdNotes);
customElements.define('hd-footnote', HdFootnote);
customElements.define('hd-callout', HdCallout);

