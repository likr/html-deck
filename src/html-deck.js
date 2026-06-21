// HTML-Deck Main Module Entry File
// Loads PrismJS and KaTeX dependencies synchronously, and registers deck custom elements.

import '../vendor/katex/katex.min.js';
import '../vendor/prismjs/prism.js';

import { loadGlobalCSS, fetchCSS } from './utils/loader.js';

import { HdDeck } from './components/hd-deck.js';
import { HdSlide } from './components/hd-slide.js';
import { HdHeading } from './components/hd-heading.js';
import { HdText } from './components/hd-text.js';
import { HdList } from './components/hd-list.js';
import { HdColumns } from './components/hd-columns.js';
import { HdColumn } from './components/hd-column.js';
import { HdCodeblock } from './components/hd-codeblock.js';
import { HdMath } from './components/hd-math.js';
import { HdNotes } from './components/hd-notes.js';
import { HdImage } from './components/hd-image.js';
import { HdTable } from './components/hd-table.js';
import { HdTitleSlide } from './components/hd-title-slide.js';

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
