#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
Usage:
  npm create html-deck <project-directory> [options]

Options:
  --aspect <ratio>   Specify aspect ratio. Examples: 16:9 (default), 4:3, 1.6
  --presenter        Scaffold presenter view page and link it
  -h, --help         Show this help information
  `);
  process.exit(0);
}

const targetDir = args[0];
if (!targetDir) {
  console.error('Error: Please specify a project directory name.');
  process.exit(1);
}

// Parse args
const aspectIndex = args.indexOf('--aspect');
const aspectRatio = aspectIndex !== -1 ? args[aspectIndex + 1] : '16:9';
const hasPresenter = args.includes('--presenter');

const absTargetDir = path.resolve(targetDir);

if (fs.existsSync(absTargetDir)) {
  console.error(`Error: Directory "${targetDir}" already exists.`);
  process.exit(1);
}

console.log(`Scaffolding HTML-Deck project inside: ${absTargetDir}...`);

try {
  fs.mkdirSync(absTargetDir, { recursive: true });

  // 1. package.json
  const packageJson = {
    name: path.basename(absTargetDir),
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    dependencies: {
      "html-deck": "^1.0.0-alpha.1"
    },
    devDependencies: {
      "vite": "^5.0.0"
    }
  };
  fs.writeFileSync(
    path.join(absTargetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );

  // 2. vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  }
});
`;
  fs.writeFileSync(path.join(absTargetDir, 'vite.config.js'), viteConfig, 'utf8');

  // 3. style.css (custom styling variables placeholder)
  const styleCss = `/* Custom overrides for your presentation */
:root {
  --hd-slide-bg: #0f172a;
  --hd-text-color: #f8fafc;
  --hd-primary: #3b82f6;
  --hd-secondary: #f43f5e;
  --hd-font-family: system-ui, -apple-system, sans-serif;
  --hd-slide-padding: 80px 100px;
}

.gradient-title {
  background: linear-gradient(135deg, var(--hd-primary), var(--hd-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;
  fs.writeFileSync(path.join(absTargetDir, 'style.css'), styleCss, 'utf8');

  // 4. index.html (the slide deck)
  const presenterAttr = hasPresenter ? ' presenter-url="presenter.html"' : '';
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Presentation - HTML-Deck</title>

  <!-- Load HTML-Deck Script and CSS utilities -->
  <script type="module">
    import 'html-deck';
    import 'html-deck/css';
  </script>
  
  <!-- Custom Overrides -->
  <link rel="stylesheet" href="./style.css">
</head>
<body>

  <hd-deck transition="fade" aspect-ratio="${aspectRatio}"${presenterAttr}>

    <!-- Slide 1: Title -->
    <hd-slide>
      <hd-layout-cover>
        <h1 slot="title"><span class="gradient-title">Welcome to HTML-Deck</span></h1>
        <hd-text slot="subtitle">A modern WebComponents slideshow platform scaffolded via CLI.</hd-text>
      </hd-layout-cover>
      <hd-notes>
        <h2>Speaker Notes: Slide 1</h2>
        <p>Edit index.html to add your custom content.</p>
      </hd-notes>
    </hd-slide>

    <!-- Slide 2: Markdown & Code -->
    <hd-slide>
      <hd-layout-split ratio="1:1">
        <h2 slot="title">Rich Features & Code Blocks</h2>
        
        <div slot="left">
          <hd-text>You can declare components like lists, tables, callouts, and math:</hd-text>
          <hd-list>
            <li>Interactive layout presets</li>
            <li>Prism code highlighting</li>
            <li>Offline KaTeX equations</li>
          </hd-list>
        </div>

        <div slot="right">
          <pre><code class="language-javascript" id="demo-code"></code></pre>
          <script type="module">
            // Import source code files as text using Vite raw import
            import codeText from './vite.config.js?raw';
            const el = document.getElementById('demo-code');
            el.textContent = codeText;
            setTimeout(() => window.Prism && window.Prism.highlightElement(el), 0);
          </script>
        </div>
      </hd-layout-split>
    </hd-slide>

  </hd-deck>

</body>
</html>
`;
  fs.writeFileSync(path.join(absTargetDir, 'index.html'), indexHtml, 'utf8');

  // 5. presenter.html (optional)
  if (hasPresenter) {
    const presenterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML-Deck - Presenter View</title>
  
  <!-- Load HTML-Deck elements including presenter elements -->
  <script type="module">
    import 'html-deck';
    import 'html-deck/presenter';
  </script>

  <style>
    :root {
      --bg-color: #0f172a;
      --panel-bg: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --accent: #10b981;
      --border-color: rgba(255, 255, 255, 0.08);

      --hd-presenter-font: system-ui, -apple-system, sans-serif;
      --hd-presenter-timer-size: 1.8rem;
      --hd-presenter-clock-size: 1.8rem;
      --hd-presenter-status-size: 2.5rem;
      --hd-presenter-preview-size: 1.4rem;
      --hd-presenter-notes-size: 1.6rem;
      --hd-presenter-btn-bg: var(--primary);
      --hd-presenter-btn-hover-bg: var(--primary-hover);
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: system-ui, -apple-system, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .dashboard {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      grid-template-rows: auto 1fr;
      height: 100%;
      box-sizing: border-box;
    }

    header {
      grid-column: 1 / -1;
      background-color: var(--panel-bg);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-weight: 800;
      font-size: 1.25rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .time-stats {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .stat-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    .left-panel {
      padding: 24px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    .panel-card {
      background-color: var(--panel-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .panel-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-top: 0;
      margin-bottom: 12px;
    }

    .navigation-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      gap: 16px;
    }

    .right-panel {
      padding: 24px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background-color: rgba(15, 23, 42, 0.4);
    }

    .notes-card-content {
      flex-grow: 1;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <header>
      <div class="logo">HD PRESENTATION SYSTEM</div>
      <div class="time-stats">
        <div class="stat-box">
          <div class="stat-label">Elapsed Time</div>
          <hd-presenter-timer></hd-presenter-timer>
        </div>
        <div class="stat-box">
          <div class="stat-label">Current Time</div>
          <hd-presenter-clock></hd-presenter-clock>
        </div>
      </div>
    </header>

    <main class="left-panel">
      <div class="panel-card">
        <h3 class="panel-title">Current Status</h3>
        <hd-presenter-status></hd-presenter-status>
      </div>

      <div class="panel-card" style="flex-grow: 1.2; display: flex; flex-direction: column;">
        <h3 class="panel-title">Current Slide</h3>
        <div style="flex-grow: 1; min-height: 0;">
          <hd-presenter-preview type="current"></hd-presenter-preview>
        </div>
      </div>

      <div class="panel-card" style="flex-grow: 1; display: flex; flex-direction: column;">
        <h3 class="panel-title">Next Slide Preview</h3>
        <div style="flex-grow: 1; min-height: 0;">
          <hd-presenter-preview type="next"></hd-presenter-preview>
        </div>
      </div>

      <div class="navigation-controls">
        <hd-presenter-controls></hd-presenter-controls>
      </div>
    </main>

    <aside class="right-panel">
      <div class="panel-card" style="height: 100%; display: flex; flex-direction: column;">
        <h3 class="panel-title">Speaker Notes</h3>
        <div class="notes-card-content">
          <hd-presenter-notes></hd-presenter-notes>
        </div>
      </div>
    </aside>
  </div>
</body>
</html>
`;
    fs.writeFileSync(path.join(absTargetDir, 'presenter.html'), presenterHtml, 'utf8');
  }

  // 6. README.md
  const readmeMd = `# ${path.basename(absTargetDir)}

An HTML slideshow deck built using the **[HTML-Deck](https://github.com/likr/html-deck)** library and Vite.

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build presentation bundle:
   \`\`\`bash
   npm run build
   \`\`\`

## Presenting

- Navigate with **Space** or **Right-Arrow** / **Left-Arrow**.
${hasPresenter ? '- Press **P** to open the Presenter dashboard view.' : ''}
- Press **Ctrl+P** to print or export to PDF.
`;
  fs.writeFileSync(path.join(absTargetDir, 'README.md'), readmeMd, 'utf8');

  console.log(`\nSuccess! Scaffolded HTML-Deck project inside ${targetDir}.`);
  console.log('Next steps:');
  console.log(`  cd ${targetDir}`);
  console.log('  npm install');
  console.log('  npm run dev\n');

} catch (error) {
  console.error(`Error: Failed to write files: ${error.message}`);
  process.exit(1);
}
