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
import {
  HdPresenterTimer,
  HdPresenterClock,
  HdPresenterStatus,
  HdPresenterPreview,
  HdPresenterNotes,
  HdPresenterControls
} from './components/hd-presenter.js';

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

customElements.define('hd-presenter-timer', HdPresenterTimer);
customElements.define('hd-presenter-clock', HdPresenterClock);
customElements.define('hd-presenter-status', HdPresenterStatus);
customElements.define('hd-presenter-preview', HdPresenterPreview);
customElements.define('hd-presenter-notes', HdPresenterNotes);
customElements.define('hd-presenter-controls', HdPresenterControls);
