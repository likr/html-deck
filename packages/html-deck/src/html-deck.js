// HTML-Deck Main Module Entry File
// Registers deck custom elements.

import './html-deck.css';

import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlideStandard } from './components/html-deck/hd-slide-standard.js';
import { HdSlideSplit } from './components/html-deck/hd-slide-split.js';
import { HdSlideCover } from './components/html-deck/hd-slide-cover.js';
import { HdSlideBlank } from './components/html-deck/hd-slide-blank.js';
import { HdGrid } from './components/html-deck/hd-grid.js';
import { HdFlex } from './components/html-deck/hd-flex.js';
import { HdText } from './components/html-deck/hd-text.js';
import { HdList } from './components/html-deck/hd-list.js';
import { HdNotes } from './components/html-deck/hd-notes.js';
import { HdFootnote } from './components/html-deck/hd-footnote.js';
import { HdCallout } from './components/html-deck/hd-callout.js';

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide-standard', HdSlideStandard);
customElements.define('hd-slide-split', HdSlideSplit);
customElements.define('hd-slide-cover', HdSlideCover);
customElements.define('hd-slide-blank', HdSlideBlank);
customElements.define('hd-grid', HdGrid);
customElements.define('hd-flex', HdFlex);
customElements.define('hd-text', HdText);
customElements.define('hd-list', HdList);
customElements.define('hd-notes', HdNotes);
customElements.define('hd-footnote', HdFootnote);
customElements.define('hd-callout', HdCallout);

