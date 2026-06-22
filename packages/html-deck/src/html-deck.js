// HTML-Deck Main Module Entry File
// Registers deck custom elements.

import './html-deck.css';


import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlide } from './components/html-deck/hd-slide.js';
import { HdHeading } from './components/html-deck/hd-heading.js';
import { HdText } from './components/html-deck/hd-text.js';
import { HdList } from './components/html-deck/hd-list.js';
import { HdColumns } from './components/html-deck/hd-columns.js';
import { HdColumn } from './components/html-deck/hd-column.js';
import { HdNotes } from './components/html-deck/hd-notes.js';
import { HdImage } from './components/html-deck/hd-image.js';
import { HdTable } from './components/html-deck/hd-table.js';
import { HdTitleSlide } from './components/html-deck/hd-title-slide.js';
import { HdFootnote } from './components/html-deck/hd-footnote.js';
import { HdCallout } from './components/html-deck/hd-callout.js';

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide', HdSlide);
customElements.define('hd-heading', HdHeading);
customElements.define('hd-text', HdText);
customElements.define('hd-list', HdList);
customElements.define('hd-columns', HdColumns);
customElements.define('hd-column', HdColumn);
customElements.define('hd-notes', HdNotes);
customElements.define('hd-image', HdImage);
customElements.define('hd-table', HdTable);
customElements.define('hd-title-slide', HdTitleSlide);
customElements.define('hd-footnote', HdFootnote);
customElements.define('hd-callout', HdCallout);
