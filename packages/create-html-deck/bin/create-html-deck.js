#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '../package.json');

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Usage:
  npm create html-deck <project-directory> [options]

Options:
  --aspect <ratio>   Specify aspect ratio. Examples: 16:9 (default), 4:3, 1.6
  --lang <lang>      Specify presentation HTML lang attribute. Examples: ja, en (default)
  --presenter        Scaffold presenter view page and link it
  -v, --version      Show version number
  -h, --help         Show this help information
  `);
}

function printVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(pkg.version);
  } catch (err) {
    console.error('Error: Could not read package version.');
    process.exit(1);
  }
}

if (args.length === 0) {
  printHelp();
  process.exit(0);
}

// Parse args supporting flags placed before or after target directory
let targetDir = null;
let aspectRatio = '16:9';
let lang = 'en';
let hasPresenter = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (arg === '--version' || arg === '-v') {
    printVersion();
    process.exit(0);
  } else if (arg === '--presenter') {
    hasPresenter = true;
  } else if (arg === '--aspect') {
    if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
      aspectRatio = args[++i];
    }
  } else if (arg.startsWith('--aspect=')) {
    aspectRatio = arg.slice('--aspect='.length);
  } else if (arg === '--lang') {
    if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
      lang = args[++i];
    }
  } else if (arg.startsWith('--lang=')) {
    lang = arg.slice('--lang='.length);
  } else if (!arg.startsWith('-')) {
    if (!targetDir) {
      targetDir = arg;
    }
  }
}

if (!targetDir) {
  console.error('Error: Please specify a project directory name.');
  process.exit(1);
}

const absTargetDir = path.resolve(targetDir);

if (fs.existsSync(absTargetDir)) {
  const stat = fs.statSync(absTargetDir);
  if (!stat.isDirectory()) {
    console.error(`Error: "${targetDir}" already exists and is not a directory.`);
    process.exit(1);
  }
  const files = fs.readdirSync(absTargetDir);
  if (files.length > 0) {
    console.error(`Error: Directory "${targetDir}" is not empty.`);
    process.exit(1);
  }
}

// Sanitize/validate projectName for package.json (lowercase, url-friendly)
function sanitizePackageName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]+/, '')
    .replace(/[^a-z0-9~._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'html-deck-presentation';
}

console.log(`Scaffolding HTML-Deck project inside: ${absTargetDir}...`);

try {
  fs.mkdirSync(absTargetDir, { recursive: true });

  const templatesDir = path.join(__dirname, '../templates');
  const rawProjectName = path.basename(absTargetDir);
  const projectName = sanitizePackageName(rawProjectName);
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
  const rollupImport = hasPresenter ? "\nimport { resolve } from 'path';" : '';
  const rollupConfig = hasPresenter
    ? `,\n  build: {\n    rollupOptions: {\n      input: {\n        main: resolve(__dirname, 'index.html'),\n        presenter: resolve(__dirname, 'presenter.html')\n      }\n    }\n  }`
    : '';
  processTemplate('vite.config.js.tmpl', 'vite.config.js', {
    rollupImport,
    rollupConfig
  });

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

