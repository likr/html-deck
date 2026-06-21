// HTML-Deck Main Module Entry File
// Loads PrismJS and KaTeX dependencies synchronously, and registers deck custom elements.

import '../vendor/katex/katex.min.js';
import '../vendor/prismjs/prism.js';

import { loadGlobalCSS, fetchCSS } from './utils/loader.js';

import { HdDeck } from './components/html-deck/hd-deck.js';
import { HdSlide } from './components/html-deck/hd-slide.js';
import { HdHeading } from './components/html-deck/hd-heading.js';
import { HdText } from './components/html-deck/hd-text.js';
import { HdList } from './components/html-deck/hd-list.js';
import { HdColumns } from './components/html-deck/hd-columns.js';
import { HdColumn } from './components/html-deck/hd-column.js';
import { HdCodeblock } from './components/html-deck/hd-codeblock.js';
import { HdMath } from './components/html-deck/hd-math.js';
import { HdNotes } from './components/html-deck/hd-notes.js';
import { HdImage } from './components/html-deck/hd-image.js';
import { HdTable } from './components/html-deck/hd-table.js';
import { HdTitleSlide } from './components/html-deck/hd-title-slide.js';
import { HdFootnote } from './components/html-deck/hd-footnote.js';
import { HdCallout } from './components/html-deck/hd-callout.js';

// Load KaTeX global stylesheet immediately (needed for @font-face rules)
loadGlobalCSS('vendor/katex/katex.min.css');

// Pre-fetch CSS stylesheets for math and code components to avoid layout shifts and lazy load delay
export const katexCSSTextPromise = fetchCSS('vendor/katex/katex.min.css');
export const prismCSSTextPromise = fetchCSS('vendor/prismjs/prism.css');

// Register presentation custom elements
customElements.define('hd-deck', HdDeck);
customElements.define('hd-slide', HdSlide);
customElements.define('hd-heading', HdHeading);
customElements.define('hd-text', HdText);
customElements.define('hd-list', HdList);
customElements.define('hd-columns', HdColumns);
customElements.define('hd-column', HdColumn);
customElements.define('hd-codeblock', HdCodeblock);
customElements.define('hd-math', HdMath);
customElements.define('hd-notes', HdNotes);
customElements.define('hd-image', HdImage);
customElements.define('hd-table', HdTable);
customElements.define('hd-title-slide', HdTitleSlide);
customElements.define('hd-footnote', HdFootnote);
customElements.define('hd-callout', HdCallout);
