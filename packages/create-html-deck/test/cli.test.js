import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliBin = path.resolve(__dirname, '../bin/create-html-deck.js');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));

const tmpBase = path.resolve(__dirname, '../../..', '.tmp-test-cli');

test.beforeEach(() => {
  if (fs.existsSync(tmpBase)) {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
  fs.mkdirSync(tmpBase, { recursive: true });
});

test.after(() => {
  if (fs.existsSync(tmpBase)) {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('--version and -v print version and exit 0', () => {
  const out1 = execFileSync(process.execPath, [cliBin, '--version'], { encoding: 'utf8' });
  assert.equal(out1.trim(), pkg.version);

  const out2 = execFileSync(process.execPath, [cliBin, '-v'], { encoding: 'utf8' });
  assert.equal(out2.trim(), pkg.version);
});

test('--help and -h print usage information and exit 0', () => {
  const out1 = execFileSync(process.execPath, [cliBin, '--help'], { encoding: 'utf8' });
  assert.match(out1, /Usage:/);
  assert.match(out1, /--presenter/);
  assert.match(out1, /-v, --version/);

  const out2 = execFileSync(process.execPath, [cliBin, '-h'], { encoding: 'utf8' });
  assert.match(out2, /Usage:/);
});

test('no arguments prints help and exits 0', () => {
  const out = execFileSync(process.execPath, [cliBin], { encoding: 'utf8' });
  assert.match(out, /Usage:/);
});

test('missing targetDir with options prints error and exits 1', () => {
  assert.throws(
    () => {
      execFileSync(process.execPath, [cliBin, '--presenter'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
    },
    (err) => {
      assert.equal(err.status, 1);
      assert.match(err.stderr, /Please specify a project directory name/);
      return true;
    }
  );
});

test('rejects non-empty directory with error', () => {
  const targetDir = path.join(tmpBase, 'non-empty-target');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'dummy.txt'), 'hello');

  assert.throws(
    () => {
      execFileSync(process.execPath, [cliBin, targetDir], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
    },
    (err) => {
      assert.equal(err.status, 1);
      assert.match(err.stderr, /is not empty/);
      return true;
    }
  );
});

test('allows existing empty directory', () => {
  const targetDir = path.join(tmpBase, 'empty-target');
  fs.mkdirSync(targetDir, { recursive: true });

  const out = execFileSync(process.execPath, [cliBin, targetDir], { encoding: 'utf8' });
  assert.match(out, /Success! Scaffolded HTML-Deck project/);
  assert.ok(fs.existsSync(path.join(targetDir, 'package.json')));
  assert.ok(fs.existsSync(path.join(targetDir, 'vite.config.js')));
  assert.ok(fs.existsSync(path.join(targetDir, 'index.html')));
});

test('supports flags placed before target directory', () => {
  const targetDir = path.join(tmpBase, 'flag-before-target');
  const out = execFileSync(process.execPath, [cliBin, '--presenter', targetDir], { encoding: 'utf8' });
  assert.match(out, /Success! Scaffolded HTML-Deck project/);
  assert.ok(fs.existsSync(path.join(targetDir, 'presenter.html')));

  const viteConfig = fs.readFileSync(path.join(targetDir, 'vite.config.js'), 'utf8');
  assert.match(viteConfig, /rollupOptions/);
  assert.match(viteConfig, /presenter\.html/);
});

test('supports flags placed after target directory', () => {
  const targetDir = path.join(tmpBase, 'flag-after-target');
  const out = execFileSync(process.execPath, [cliBin, targetDir, '--presenter'], { encoding: 'utf8' });
  assert.match(out, /Success! Scaffolded HTML-Deck project/);
  assert.ok(fs.existsSync(path.join(targetDir, 'presenter.html')));
});

test('scaffolds without presenter: single-page config, no presenter.html', () => {
  const targetDir = path.join(tmpBase, 'standard-deck');
  execFileSync(process.execPath, [cliBin, targetDir], { encoding: 'utf8' });

  assert.ok(fs.existsSync(path.join(targetDir, 'index.html')));
  assert.ok(!fs.existsSync(path.join(targetDir, 'presenter.html')));

  const viteConfig = fs.readFileSync(path.join(targetDir, 'vite.config.js'), 'utf8');
  assert.doesNotMatch(viteConfig, /rollupOptions/);
  assert.doesNotMatch(viteConfig, /presenter/);
});

test('sanitizes projectName in package.json', () => {
  const targetDir = path.join(tmpBase, 'My AwEsOmE Slides Deck!!');
  execFileSync(process.execPath, [cliBin, targetDir], { encoding: 'utf8' });

  const pkgJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
  assert.equal(pkgJson.name, 'my-awesome-slides-deck');
});

test('supports --aspect and --lang options', () => {
  const targetDir = path.join(tmpBase, 'custom-options');
  execFileSync(process.execPath, [cliBin, targetDir, '--aspect', '4:3', '--lang', 'ja'], { encoding: 'utf8' });

  const indexHtml = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf8');
  assert.match(indexHtml, /<html lang="ja">/);
  assert.match(indexHtml, /aspect-ratio="4:3"/);
});
