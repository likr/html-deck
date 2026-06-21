// HTML-Deck Presenter Entry File
// Registers all presenter components used in the presenter view dashboard.

import { HdPresenterTimer } from './components/html-deck-presenter/hd-presenter-timer.js';
import { HdPresenterClock } from './components/html-deck-presenter/hd-presenter-clock.js';
import { HdPresenterStatus } from './components/html-deck-presenter/hd-presenter-status.js';
import { HdPresenterPreview } from './components/html-deck-presenter/hd-presenter-preview.js';
import { HdPresenterNotes } from './components/html-deck-presenter/hd-presenter-notes.js';
import { HdPresenterControls } from './components/html-deck-presenter/hd-presenter-controls.js';

customElements.define('hd-presenter-timer', HdPresenterTimer);
customElements.define('hd-presenter-clock', HdPresenterClock);
customElements.define('hd-presenter-status', HdPresenterStatus);
customElements.define('hd-presenter-preview', HdPresenterPreview);
customElements.define('hd-presenter-notes', HdPresenterNotes);
customElements.define('hd-presenter-controls', HdPresenterControls);
