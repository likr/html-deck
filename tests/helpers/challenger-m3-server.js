import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const deckJs = fs.readFileSync(path.join(rootDir, 'packages/html-deck/dist/html-deck.js'), 'utf8');

const server = http.createServer((req, res) => {
  if (req.url === '/html-deck.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(deckJs);
  } else if (req.url === '/valid') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/html-deck.js"></script>
</head>
<body>
  <hd-deck>
    <hd-slide>
      <h1>Clean Presentation</h1>
      <p>This is a completely valid slide that should pass all audits cleanly.</p>
    </hd-slide>
  </hd-deck>
</body>
</html>`);
  } else if (req.url === '/svg') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/html-deck.js"></script>
</head>
<body>
  <hd-deck>
    <hd-slide>
      <h1>Inline SVG Presentation</h1>
      <svg class="diagram-icon hd-ignore" width="120" height="120" viewBox="0 0 120 120">
        <circle class="node-circle" cx="60" cy="60" r="40" />
        <path class="flow-arrow" d="M 20 60 L 100 60" />
      </svg>
      <p>Inline SVG diagrams properly loaded.</p>
    </hd-slide>
  </hd-deck>
</body>
</html>`);
  } else if (req.url === '/svg-overflow') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/html-deck.js"></script>
</head>
<body>
  <hd-deck>
    <hd-slide>
      <h1>SVG Overflow Test</h1>
      <div style="position: relative; width: 100%; height: 300px;">
        <svg class="overflow-svg" width="200" height="200" viewBox="0 0 200 200" style="position: absolute; top: -100px; left: -100px;">
          <circle class="danger-circle" cx="100" cy="100" r="80" />
        </svg>
      </div>
    </hd-slide>
  </hd-deck>
</body>
</html>`);
  } else if (req.url === '/contrast-fail') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src="/html-deck.js"></script>
</head>
<body>
  <hd-deck>
    <hd-slide>
      <h1>Contrast Fail Test</h1>
      <p style="color: #cccccc; background-color: #ffffff;">This low contrast text fails WCAG.</p>
    </hd-slide>
  </hd-deck>
</body>
</html>`);
  } else if (req.url === '/no-deck') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<body>
  <h1>Page without hd-deck</h1>
</body>
</html>`);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log(`SERVER_READY:${port}`);
});
