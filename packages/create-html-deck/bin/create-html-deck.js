#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
Usage:
  npm create html-deck <project-directory> [options]

Options:
  --aspect <ratio>   Specify aspect ratio. Examples: 16:9 (default), 4:3, 1.6
  --lang <lang>      Specify presentation HTML lang attribute. Examples: ja, en (default)
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
const langIndex = args.indexOf('--lang');
const lang = langIndex !== -1 ? args[langIndex + 1] : 'en';
const hasPresenter = args.includes('--presenter');

const absTargetDir = path.resolve(targetDir);

if (fs.existsSync(absTargetDir)) {
  console.error(`Error: Directory "${targetDir}" already exists.`);
  process.exit(1);
}

console.log(`Scaffolding HTML-Deck project inside: ${absTargetDir}...`);

try {
  fs.mkdirSync(absTargetDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatesDir = path.join(__dirname, '../templates');

  const projectName = path.basename(absTargetDir);
  const channelName = projectName + '-channel';

  // Helper to read and write template files
  const processTemplate = (srcFile, destFile, replacements = {}) => {
    const srcPath = path.join(templatesDir, srcFile);
    let content = fs.readFileSync(srcPath, 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replaceAll(`{{${key}}}`, value);
    }
    fs.writeFileSync(path.join(absTargetDir, destFile), content, 'utf8');
  };

  // 1. package.json
  processTemplate('package.json.tmpl', 'package.json', { projectName });

  // 2. vite.config.js
  processTemplate('vite.config.js.tmpl', 'vite.config.js');

  // 3. style.css
  processTemplate('style.css.tmpl', 'style.css');

  // 4. index.html
  const presenterAttr = hasPresenter ? ` presenter-url="presenter.html" presenter-channel="${channelName}"` : '';
  processTemplate('index.html.tmpl', 'index.html', {
    aspectRatio,
    presenterAttr,
    lang
  });

  // 5. presenter.html (optional)
  if (hasPresenter) {
    processTemplate('presenter.html.tmpl', 'presenter.html', { channelName });
  }

  // 6. README.md
  const presenterUsage = hasPresenter ? `- Press **P** to open the Presenter dashboard view.\n` : '';
  processTemplate('README.md.tmpl', 'README.md', {
    projectName,
    presenterUsage
  });

  console.log(`\nSuccess! Scaffolded HTML-Deck project inside ${targetDir}.`);
  console.log('Next steps:');
  console.log(`  cd ${targetDir}`);
  console.log('  npm install');
  console.log('  npm run dev\n');

} catch (error) {
  console.error(`Error: Failed to write files: ${error.message}`);
  process.exit(1);
}
