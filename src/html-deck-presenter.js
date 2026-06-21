// HTML-Deck Presenter Entry File
// Registers all presenter components used in the presenter view dashboard.

import {
  HdPresenterTimer,
  HdPresenterClock,
  HdPresenterStatus,
  HdPresenterPreview,
  HdPresenterNotes,
  HdPresenterControls
} from './components/hd-presenter.js';

customElements.define('hd-presenter-timer', HdPresenterTimer);
customElements.define('hd-presenter-clock', HdPresenterClock);
customElements.define('hd-presenter-status', HdPresenterStatus);
customElements.define('hd-presenter-preview', HdPresenterPreview);
customElements.define('hd-presenter-notes', HdPresenterNotes);
customElements.define('hd-presenter-controls', HdPresenterControls);
