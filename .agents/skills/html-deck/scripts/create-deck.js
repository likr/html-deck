#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
Usage:
  node create-deck.js <output-filename.html> [options]

Options:
  --aspect <ratio>   Specify aspect ratio. Examples: 16:9 (default), 4:3, 1.6
  --presenter        Include presenter view URL referencing demo/presenter.html
  -h, --help         Show this help information
  `);
  process.exit(0);
}

const outputFile = args[0];
if (!outputFile) {
  console.error('Error: Please specify an output filename.');
  process.exit(1);
}

// Parse args
const aspectIndex = args.indexOf('--aspect');
const aspectRatio = aspectIndex !== -1 ? args[aspectIndex + 1] : '16:9';
const hasPresenter = args.includes('--presenter');

// Determine correct relative path to src/html-deck.js
// Assuming user runs this command from the project root
let relativeScriptPath = './src/html-deck.js';
let relativePresenterPath = './demo/presenter.html';

// Calculate if output directory is nested, adjust relative path
const absoluteOutputDir = path.resolve(path.dirname(outputFile));
const projectRoot = process.cwd();
if (absoluteOutputDir !== projectRoot) {
  const relativeDepth = path.relative(absoluteOutputDir, projectRoot);
  relativeScriptPath = path.join(relativeDepth, 'src/html-deck.js');
  relativePresenterPath = path.join(relativeDepth, 'demo/presenter.html');
}

const presenterAttr = hasPresenter ? ` presenter-url="${relativePresenterPath}"` : '';

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Presentation - html-deck</title>
  
  <!-- Load HTML-Deck Library Script -->
  <script type="module" src="${relativeScriptPath}"></script>

  <!-- Style variables definition -->
  <style>
    :root {
      /* Base slide layout style tokens */
      --hd-slide-bg: #0b0f19;
      --hd-text-color: #f1f5f9;
      --hd-primary: #3b82f6;
      --hd-secondary: #f43f5e;
      --hd-font-family: system-ui, -apple-system, sans-serif;
      --hd-slide-padding: 80px 100px;
    }
    
    .accent {
      color: var(--hd-primary);
    }
  </style>
</head>
<body>

  <!-- Slide Deck Container -->
  <hd-deck transition="fade" aspect-ratio="${aspectRatio}"${presenterAttr}>

    <!-- Slide 1: Welcome -->
    <hd-slide layout="title" title="Title Slide">
      <hd-heading level="1">Welcome to <span class="accent">My Slides</span></hd-heading>
      <hd-text>A buildless presentation generated via html-deck boilerplate</hd-text>
      <hd-notes>
        <h2>Notes for Slide 1</h2>
        <p>Introduce yourself and state the goals of this deck.</p>
      </hd-notes>
    </hd-slide>

    <!-- Slide 2: Split Layout Example -->
    <hd-slide layout="split" title="Split Panel Slide">
      <hd-heading slot="title" level="2">declarative Splitting</hd-heading>
      
      <div slot="left">
        <hd-heading level="3">Left Area</hd-heading>
        <hd-text>Insert text or bullet points on the left pane.</hd-text>
        <hd-list>
          <li>Item A</li>
          <li>Item B</li>
        </hd-list>
      </div>

      <div slot="right">
        <hd-heading level="3">Right Area</hd-heading>
        <hd-text>Insert code blocks, images, or notes on the right pane.</hd-text>
        <hd-codeblock language="javascript">
const message = "Hello from html-deck!";
console.log(message);
        </hd-codeblock>
      </div>

      <hd-notes>
        <h2>Notes for Slide 2</h2>
        <p>Explain the left column and right column highlights.</p>
      </hd-notes>
    </hd-slide>

  </hd-deck>

</body>
</html>
`;

try {
  fs.writeFileSync(outputFile, template, 'utf8');
  console.log(`Success: Generated html-deck boilerplate presentation at ${outputFile}`);
  console.log(`Aspect ratio configured: ${aspectRatio}`);
  if (hasPresenter) {
    console.log(`Presenter URL linked: ${relativePresenterPath}`);
  }
} catch (error) {
  console.error(`Error: Failed to write file: ${error.message}`);
  process.exit(1);
}
