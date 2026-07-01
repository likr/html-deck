// HTML-Deck Presenter Entry File
// Registers all presenter components used in the presenter view dashboard.

import cssText from './html-deck-presenter.css?inline';

// Dynamically inject global presenter stylesheet if not already present
if (typeof document !== 'undefined') {
    const styleId = 'hd-presenter-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = cssText;
        document.head.appendChild(style);
    }
}

import { HdPresenterTimer } from './components/html-deck-presenter/hd-presenter-timer.js';
import { HdPresenterClock } from './components/html-deck-presenter/hd-presenter-clock.js';
import { HdPresenterStatus } from './components/html-deck-presenter/hd-presenter-status.js';
import { HdPresenterPreview } from './components/html-deck-presenter/hd-presenter-preview.js';
import { HdPresenterNotes } from './components/html-deck-presenter/hd-presenter-notes.js';
import { HdPresenterScript } from './components/html-deck-presenter/hd-presenter-script.js';
import { HdPresenterControls } from './components/html-deck-presenter/hd-presenter-controls.js';
import { HdPresenterCard } from './components/html-deck-presenter/hd-presenter-card.js';
import { HdPresenter } from './components/html-deck-presenter/hd-presenter.js';
import { HdPresenterLogo } from './components/html-deck-presenter/hd-presenter-logo.js';
import { HdPresenterSlideButton } from './components/html-deck-presenter/hd-presenter-slide-button.js';

customElements.define('hd-presenter-timer', HdPresenterTimer);
customElements.define('hd-presenter-clock', HdPresenterClock);
customElements.define('hd-presenter-status', HdPresenterStatus);
customElements.define('hd-presenter-preview', HdPresenterPreview);
customElements.define('hd-presenter-notes', HdPresenterNotes);
customElements.define('hd-presenter-script', HdPresenterScript);
customElements.define('hd-presenter-controls', HdPresenterControls);
customElements.define('hd-presenter-card', HdPresenterCard);
customElements.define('hd-presenter', HdPresenter);
customElements.define('hd-presenter-logo', HdPresenterLogo);
customElements.define('hd-presenter-slide-button', HdPresenterSlideButton);
