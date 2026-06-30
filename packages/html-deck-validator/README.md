# html-deck-validator

Automated layout and accessibility validation tool for the `html-deck` WebComponents slideshow library. 

This package uses Playwright to render slides inside a headless browser, traverse all slides, and report violations. It terminates with a non-zero exit code if issues are found, making it ideal for CI/CD environments.

## Installation

Add this package to your devDependencies:

```bash
npm install -D html-deck-validator
npx playwright install chromium
```

## Usage

Start your slide server, then run the validation command against your running slideshow URL:

```bash
# General
npx html-deck-validator <url>

# Example
npx html-deck-validator http://localhost:5173/slides/ramen/index.html
```

## Checks Performed

1. **Color Contrast**: Calculates computed text and background styles (including alpha channel blend resolution and Shadow DOM slots bridging) to verify WCAG AA compliance (4.5:1 for regular text, 3.0:1 for large/bold text).
2. **Boundary Overflow**: Checks if slide content leaf elements physically expand outside the bounding box canvas of their parent slide container.
3. **Element Overlap**: Inspects pairs of visible leaf elements to ensure they do not collide or render directly on top of each other (excluding standard parent-child nodes and `pointer-events: none` background elements).
