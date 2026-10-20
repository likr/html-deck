import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cliBin = path.resolve(rootDir, 'packages/create-html-deck/bin/create-html-deck.js');
const validatorBin = path.resolve(rootDir, 'packages/html-deck-validator/bin/html-deck-validator.js');
const serverScript = path.resolve(rootDir, 'tests/helpers/challenger-m3-server.js');
const pkgCreate = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'packages/create-html-deck/package.json'), 'utf8'));

const tmpBase = path.resolve(rootDir, '.tmp-challenger-m3');

function cleanTmpBase() {
  if (fs.existsSync(tmpBase)) {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
}

test.beforeEach(() => {
  cleanTmpBase();
  fs.mkdirSync(tmpBase, { recursive: true });
});

test.after(() => {
  cleanTmpBase();
});

function runNode(bin, args = [], options = {}) {
  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd: options.cwd || rootDir,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    timeout: options.timeout || 30000
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

// ============================================================================
// Adversarial Scenario 1: create-html-deck mixed flag order
// ============================================================================
test('Scenario 1: create-html-deck with mixed flag orders and option placement', async (t) => {
  await t.test('1.1: --presenter <dir>', () => {
    const dir = path.join(tmpBase, 'order-flag-first');
    const res = runNode(cliBin, ['--presenter', dir]);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    assert.ok(fs.existsSync(path.join(dir, 'presenter.html')), 'presenter.html must exist');
    assert.ok(fs.existsSync(path.join(dir, 'index.html')), 'index.html must exist');
    const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(indexContent, /presenter-url="presenter\.html"/);
    const viteConfig = fs.readFileSync(path.join(dir, 'vite.config.js'), 'utf8');
    assert.match(viteConfig, /rollupOptions/);
    assert.match(viteConfig, /presenter: resolve\(__dirname, 'presenter\.html'\)/);
  });

  await t.test('1.2: <dir> --presenter', () => {
    const dir = path.join(tmpBase, 'order-flag-last');
    const res = runNode(cliBin, [dir, '--presenter']);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    assert.ok(fs.existsSync(path.join(dir, 'presenter.html')), 'presenter.html must exist');
    const viteConfig = fs.readFileSync(path.join(dir, 'vite.config.js'), 'utf8');
    assert.match(viteConfig, /rollupOptions/);
  });

  await t.test('1.3: --aspect 4:3 --presenter <dir>', () => {
    const dir = path.join(tmpBase, 'order-aspect-presenter-dir');
    const res = runNode(cliBin, ['--aspect', '4:3', '--presenter', dir]);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    assert.ok(fs.existsSync(path.join(dir, 'presenter.html')));
    const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(indexContent, /aspect-ratio="4:3"/);
    assert.match(indexContent, /presenter-url="presenter\.html"/);
  });

  await t.test('1.4: <dir> --aspect 4:3 --presenter', () => {
    const dir = path.join(tmpBase, 'order-dir-aspect-presenter');
    const res = runNode(cliBin, [dir, '--aspect', '4:3', '--presenter']);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(indexContent, /aspect-ratio="4:3"/);
  });

  await t.test('1.5: --aspect=4:3 <dir> --presenter', () => {
    const dir = path.join(tmpBase, 'order-aspect-equals');
    const res = runNode(cliBin, ['--aspect=4:3', dir, '--presenter']);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(indexContent, /aspect-ratio="4:3"/);
    assert.ok(fs.existsSync(path.join(dir, 'presenter.html')));
  });

  await t.test('1.6: --presenter --lang=ja <dir> --aspect 4:3', () => {
    const dir = path.join(tmpBase, 'order-complex-interleaved');
    const res = runNode(cliBin, ['--presenter', '--lang=ja', dir, '--aspect', '4:3']);
    assert.equal(res.status, 0, `Expected exit 0, got ${res.status}: ${res.stderr}`);
    const indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(indexContent, /<html lang="ja">/);
    assert.match(indexContent, /aspect-ratio="4:3"/);
    assert.ok(fs.existsSync(path.join(dir, 'presenter.html')));
  });

  await t.test('1.7: missing target directory with only flags fails cleanly with code 1', () => {
    const res = runNode(cliBin, ['--aspect', '4:3', '--presenter']);
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Please specify a project directory name/);
  });

  await t.test('1.8: sanitizes project name in package.json', () => {
    const dir = path.join(tmpBase, 'ADVERSARIAL Deck Presentation 2026!');
    const res = runNode(cliBin, [dir]);
    assert.equal(res.status, 0);
    const pkgJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    assert.equal(pkgJson.name, 'adversarial-deck-presentation-2026');
  });
});

// ============================================================================
// Adversarial Scenario 2: create-html-deck on existing non-empty directory
// ============================================================================
test('Scenario 2: create-html-deck refuses to overwrite existing non-empty directory', async (t) => {
  await t.test('2.1: directory containing existing files is rejected without modifications', () => {
    const dir = path.join(tmpBase, 'non-empty-dir');
    fs.mkdirSync(dir, { recursive: true });
    const sentinelFile = path.join(dir, 'important-data.json');
    fs.writeFileSync(sentinelFile, JSON.stringify({ keep: 'me' }));

    const res = runNode(cliBin, [dir, '--presenter']);
    assert.equal(res.status, 1, 'CLI must exit with code 1 on non-empty directory');
    assert.match(res.stderr, /Directory ".*" is not empty/);

    // Verify sentinel was untouched and no template files were created
    assert.ok(fs.existsSync(sentinelFile));
    assert.equal(fs.readFileSync(sentinelFile, 'utf8'), JSON.stringify({ keep: 'me' }));
    assert.ok(!fs.existsSync(path.join(dir, 'package.json')), 'Must not create package.json in non-empty dir');
    assert.ok(!fs.existsSync(path.join(dir, 'index.html')), 'Must not create index.html in non-empty dir');
    assert.ok(!fs.existsSync(path.join(dir, 'vite.config.js')), 'Must not create vite.config.js in non-empty dir');
  });

  await t.test('2.2: directory containing a subdirectory is rejected', () => {
    const dir = path.join(tmpBase, 'dir-with-subdir');
    fs.mkdirSync(path.join(dir, 'child-dir'), { recursive: true });

    const res = runNode(cliBin, [dir]);
    assert.equal(res.status, 1);
    assert.match(res.stderr, /is not empty/);
  });

  await t.test('2.3: target exists as a regular file (not directory) is rejected', () => {
    const filePath = path.join(tmpBase, 'existing-file.txt');
    fs.writeFileSync(filePath, 'i am a file');

    const res = runNode(cliBin, [filePath]);
    assert.equal(res.status, 1);
    assert.match(res.stderr, /already exists and is not a directory/);
  });

  await t.test('2.4: existing empty directory is allowed', () => {
    const dir = path.join(tmpBase, 'clean-empty-dir');
    fs.mkdirSync(dir, { recursive: true });

    const res = runNode(cliBin, [dir]);
    assert.equal(res.status, 0);
    assert.ok(fs.existsSync(path.join(dir, 'package.json')));
    assert.ok(fs.existsSync(path.join(dir, 'index.html')));
  });
});

// ============================================================================
// Adversarial Scenario 3: create-html-deck with --version and --help
// ============================================================================
test('Scenario 3: create-html-deck --version and --help flags', async (t) => {
  await t.test('3.1: --version prints exact package version and exits 0', () => {
    const res = runNode(cliBin, ['--version']);
    assert.equal(res.status, 0);
    assert.equal(res.stdout.trim(), pkgCreate.version);
    assert.equal(res.stderr, '');
  });

  await t.test('3.2: -v prints exact package version and exits 0', () => {
    const res = runNode(cliBin, ['-v']);
    assert.equal(res.status, 0);
    assert.equal(res.stdout.trim(), pkgCreate.version);
    assert.equal(res.stderr, '');
  });

  await t.test('3.3: --help prints usage, options, and exits 0', () => {
    const res = runNode(cliBin, ['--help']);
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage:/);
    assert.match(res.stdout, /--aspect/);
    assert.match(res.stdout, /--lang/);
    assert.match(res.stdout, /--presenter/);
    assert.match(res.stdout, /-v, --version/);
    assert.match(res.stdout, /-h, --help/);
  });

  await t.test('3.4: -h prints usage and exits 0', () => {
    const res = runNode(cliBin, ['-h']);
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage:/);
  });

  await t.test('3.5: no arguments prints usage and exits 0', () => {
    const res = runNode(cliBin, []);
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage:/);
  });

  await t.test('3.6: --version accompanied by targetDir does not create dir', () => {
    const dir = path.join(tmpBase, 'uncreated-dir-version');
    const res = runNode(cliBin, ['--version', dir]);
    assert.equal(res.status, 0);
    assert.equal(res.stdout.trim(), pkgCreate.version);
    assert.ok(!fs.existsSync(dir), 'Directory must not be created when --version is supplied');
  });

  await t.test('3.7: targetDir accompanied by --help does not create dir', () => {
    const dir = path.join(tmpBase, 'uncreated-dir-help');
    const res = runNode(cliBin, [dir, '--help']);
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage:/);
    assert.ok(!fs.existsSync(dir), 'Directory must not be created when --help is supplied');
  });
});

// ============================================================================
// Adversarial Scenario 4: vite build on scaffolded --presenter deck
// ============================================================================
test('Scenario 4: vite build on scaffolded --presenter deck creates dist/index.html and dist/presenter.html', async () => {
  const scaffoldDir = path.join(tmpBase, 'scaffold-build-test');
  
  // 1. Scaffold presentation with --presenter
  const scaffoldRes = runNode(cliBin, [scaffoldDir, '--presenter', '--aspect', '16:9']);
  assert.equal(scaffoldRes.status, 0, `Scaffolding failed: ${scaffoldRes.stderr}`);
  assert.ok(fs.existsSync(path.join(scaffoldDir, 'index.html')));
  assert.ok(fs.existsSync(path.join(scaffoldDir, 'presenter.html')));
  assert.ok(fs.existsSync(path.join(scaffoldDir, 'vite.config.js')));

  // 2. Link node_modules from monorepo root so vite and html-deck are resolvable
  const targetNodeModules = path.join(scaffoldDir, 'node_modules');
  const rootNodeModules = path.join(rootDir, 'node_modules');
  fs.symlinkSync(rootNodeModules, targetNodeModules, 'dir');

  // Also ensure html-deck package is resolvable inside the scaffolded project
  const htmlDeckPkgDir = path.join(rootDir, 'packages/html-deck');
  const htmlDeckSymlink = path.join(targetNodeModules, 'html-deck');
  if (!fs.existsSync(htmlDeckSymlink)) {
    fs.symlinkSync(htmlDeckPkgDir, htmlDeckSymlink, 'dir');
  }

  // 3. Run vite build
  const viteBin = path.join(rootNodeModules, 'vite/bin/vite.js');
  const buildRes = runNode(viteBin, ['build'], { cwd: scaffoldDir });
  assert.equal(buildRes.status, 0, `vite build failed: ${buildRes.stderr}\n${buildRes.stdout}`);

  // 4. Confirm dist/index.html and dist/presenter.html exist and are valid
  const distDir = path.join(scaffoldDir, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist/ directory must be created');

  const distIndex = path.join(distDir, 'index.html');
  assert.ok(fs.existsSync(distIndex), 'dist/index.html must exist');
  const indexHtml = fs.readFileSync(distIndex, 'utf8');
  assert.ok(indexHtml.length > 50, 'dist/index.html must not be empty');
  assert.match(indexHtml, /<hd-deck/i, 'dist/index.html must contain hd-deck');

  const distPresenter = path.join(distDir, 'presenter.html');
  assert.ok(fs.existsSync(distPresenter), 'dist/presenter.html must exist');
  const presenterHtml = fs.readFileSync(distPresenter, 'utf8');
  assert.ok(presenterHtml.length > 50, 'dist/presenter.html must not be empty');
  assert.match(presenterHtml, /hd-presenter/i, 'dist/presenter.html must contain presenter elements');

  // 5. Clean up scaffold directory
  fs.rmSync(scaffoldDir, { recursive: true, force: true });
  assert.ok(!fs.existsSync(scaffoldDir), 'scaffold directory cleaned up');
});

// ============================================================================
// Adversarial Scenario 5: html-deck-validator inline SVG elements
// ============================================================================
test('Scenario 5: html-deck-validator on inline SVG elements does not throw TypeError on className.trim', async () => {
  // Test in actual browser environment simulating html-deck-validator page execution
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();

    const evaluationResult = await page.evaluate(() => {
      // Replicate validator's getUniqueSelector
      function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
          let selector = el.nodeName.toLowerCase();
          const rawClass = typeof el.className === 'string'
            ? el.className
            : (typeof el.className === 'object' && el.className?.baseVal ? el.className.baseVal : (el.getAttribute?.('class') || ''));
          if (rawClass && typeof rawClass === 'string') {
            const classes = rawClass.trim().split(/\s+/).filter(c => c && !c.startsWith('hd-'));
            if (classes.length) {
              selector += '.' + classes[0];
            }
          }
          path.unshift(selector);
          el = el.parentElement || (el.getRootNode && el.getRootNode().host);
        }
        return path.slice(-3).join(' > ');
      }

      // Replicate validator leaf element finder
      function getVisibleLeafElements(root) {
        const elements = [];
        function traverse(node) {
          if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0 || style.pointerEvents === 'none') {
            return;
          }
          const isLeaf = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'SPAN', 'IMG', 'VIDEO', 'A', 'HD-CODEBLOCK', 'HD-CALLOUT', 'BUTTON'].includes(node.tagName) 
            || node.children.length === 0;

          if (isLeaf) {
            elements.push({
              element: node,
              tagName: node.tagName,
              rect: node.getBoundingClientRect(),
              text: (node.innerText || node.textContent || '').trim()
            });
          }

          for (let i = 0; i < node.children.length; i++) {
            traverse(node.children[i]);
          }
          if (node.shadowRoot) {
            for (let i = 0; i < node.shadowRoot.children.length; i++) {
              traverse(node.shadowRoot.children[i]);
            }
          }
        }
        traverse(root);
        return elements;
      }

      // Create complex SVG trees
      const container = document.createElement('div');
      container.id = 'svg-test-container';
      container.innerHTML = `
        <svg class="icon hd-ignore" viewBox="0 0 100 100" width="100" height="100">
          <circle class="circle-item" cx="50" cy="50" r="40" />
          <path class="path-item" d="M 10 10 L 90 90" />
        </svg>
        <svg id="bare-svg" viewBox="0 0 50 50">
          <g>
            <rect x="0" y="0" width="50" height="50" />
            <text class="svg-label">SVG Text</text>
          </g>
        </svg>
      `;
      document.body.appendChild(container);

      const leafElements = getVisibleLeafElements(container);
      const selectors = [];
      const classTypes = [];

      for (const item of leafElements) {
        classTypes.push({
          tagName: item.tagName,
          classNameType: typeof item.element.className,
          isSVGAnimatedString: item.element.className && typeof item.element.className === 'object' && 'baseVal' in item.element.className
        });
        // Call getUniqueSelector on every leaf element
        const sel = getUniqueSelector(item.element);
        selectors.push({ tagName: item.tagName, selector: sel });
      }

      return { leafElementsCount: leafElements.length, classTypes, selectors };
    });

    assert.ok(evaluationResult.leafElementsCount >= 4, 'Must identify SVG leaf elements');
    
    // Check that circle and path have SVGAnimatedString as className
    const circleInfo = evaluationResult.classTypes.find(c => c.tagName.toUpperCase() === 'CIRCLE');
    assert.ok(circleInfo, 'Circle element found');
    assert.equal(circleInfo.classNameType, 'object');
    assert.ok(circleInfo.isSVGAnimatedString, 'circle.className is SVGAnimatedString');

    // Confirm selectors generated safely
    const circleSel = evaluationResult.selectors.find(s => s.tagName.toUpperCase() === 'CIRCLE');
    assert.ok(circleSel.selector.includes('circle.circle-item'), `Selector generated: ${circleSel.selector}`);

    const textSel = evaluationResult.selectors.find(s => s.tagName.toUpperCase() === 'TEXT');
    assert.ok(textSel.selector.includes('text.svg-label'), `Selector generated: ${textSel.selector}`);

  } finally {
    await browser.close();
  }
});

// ============================================================================
// Adversarial Scenario 6: html-deck-validator on scaled presentations
// ============================================================================
test('Scenario 6: html-deck-validator scales slide margins by container scale factor', () => {
  // Test margin scaling formula and overflow detection logic under multiple scale factors
  const slideRect = { left: 100, right: 1060, top: 50, bottom: 590, width: 960, height: 540 };
  const baseMarginTop = 40;
  const baseMarginRight = 40;
  const baseMarginBottom = 40;
  const baseMarginLeft = 40;

  function calculateBounds(scale) {
    const marginTop = baseMarginTop * scale;
    const marginRight = baseMarginRight * scale;
    const marginBottom = baseMarginBottom * scale;
    const marginLeft = baseMarginLeft * scale;

    return {
      contentLeft: slideRect.left + marginLeft,
      contentRight: slideRect.right - marginRight,
      contentTop: slideRect.top + marginTop,
      contentBottom: slideRect.bottom - marginBottom
    };
  }

  function checkOverflow(rect, bounds) {
    return (
      rect.left < bounds.contentLeft - 1.5 ||
      rect.right > bounds.contentRight + 1.5 ||
      rect.top < bounds.contentTop - 1.5 ||
      rect.bottom > bounds.contentBottom + 1.5
    );
  }

  // At scale 1.0
  const b1 = calculateBounds(1.0);
  assert.equal(b1.contentTop, 90);
  assert.equal(b1.contentBottom, 550);
  assert.equal(b1.contentLeft, 140);
  assert.equal(b1.contentRight, 1020);

  // At scale 0.5 (smaller viewport / scaled down)
  const b05 = calculateBounds(0.5);
  assert.equal(b05.contentTop, 70); // 50 + 20
  assert.equal(b05.contentBottom, 570); // 590 - 20
  assert.equal(b05.contentLeft, 120); // 100 + 20
  assert.equal(b05.contentRight, 1040); // 1060 - 20

  // At scale 1.5 (larger viewport / scaled up)
  const b15 = calculateBounds(1.5);
  assert.equal(b15.contentTop, 110); // 50 + 60
  assert.equal(b15.contentBottom, 530); // 590 - 60
  assert.equal(b15.contentLeft, 160); // 100 + 60
  assert.equal(b15.contentRight, 1000); // 1060 - 60

  // An element whose unscaled top distance is 15px (inside base margin 40px -> overflow)
  const elInsideMargin = { left: 200, right: 800, top: slideRect.top + 15, bottom: 400 };
  assert.equal(checkOverflow(elInsideMargin, b05), true, 'Element violating scaled margin must trigger overflow');

  // An element whose unscaled top distance is 50px (outside base margin 40px -> valid)
  // At scale 0.5: screen distance from slide top is 25px.
  // With scaled margin (20px): 25px > 20px -> correctly VALID!
  // If margin was unscaled (40px): 25px < 40px would produce a FALSE POSITIVE overflow!
  const elValidAt05 = { left: 200, right: 800, top: slideRect.top + 25, bottom: 400 };
  assert.equal(checkOverflow(elValidAt05, b05), false, 'Valid element must NOT trigger false overflow under scale 0.5');

  // At scale 1.5: screen distance of 50px unscaled is 75px.
  // With scaled margin (60px): 75px > 60px -> correctly VALID!
  const elValidAt15 = { left: 200, right: 800, top: slideRect.top + 75, bottom: 400 };
  assert.equal(checkOverflow(elValidAt15, b15), false, 'Valid element must NOT trigger false overflow under scale 1.5');

  // At scale 1.5: an element whose unscaled top distance is 35px (inside 40px base margin).
  // Screen distance is 35 * 1.5 = 52.5px.
  // With scaled margin (60px): 52.5px < 60px -> correctly FLAGGED as overflow!
  // If margin was unscaled (40px): 52.5px > 40px would produce a FALSE NEGATIVE (silent pass)!
  const elViolatingAt15 = { left: 200, right: 800, top: slideRect.top + 52.5, bottom: 400 };
  assert.equal(checkOverflow(elViolatingAt15, b15), true, 'Element violating margin must be caught under scale 1.5');
});

// ============================================================================
// Adversarial Scenario 7: html-deck-validator modern CSS colors & alpha blending
// ============================================================================
test('Scenario 7: html-deck-validator modern CSS colors and alpha-blending contrast', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(() => {
      const colorCanvas = document.createElement('canvas');
      colorCanvas.width = 1;
      colorCanvas.height = 1;
      const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });

      function parseColor(colorStr) {
        if (!colorStr) return { r: 0, g: 0, b: 0, a: 0.0 };
        colorStr = colorStr.trim();
        if (colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
          return { r: 0, g: 0, b: 0, a: 0.0 };
        }
        if (colorStr.startsWith('#')) {
          let hex = colorStr.slice(1);
          if (hex.length === 3 || hex.length === 4) {
            hex = [...hex].map(c => c + c).join('');
          }
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          let a = 1.0;
          if (hex.length === 8) {
            a = parseInt(hex.slice(6, 8), 16) / 255;
          }
          return { r, g, b, a };
        }
        if (colorStr.startsWith('rgb')) {
          const match = colorStr.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.%]+))?\)/);
          if (match) {
            let alpha = 1.0;
            if (match[4] !== undefined) {
              const aVal = match[4].trim();
              alpha = aVal.endsWith('%') ? parseFloat(aVal) / 100 : parseFloat(aVal);
            }
            return {
              r: parseInt(match[1], 10),
              g: parseInt(match[2], 10),
              b: parseInt(match[3], 10),
              a: alpha
            };
          }
        }
        try {
          colorCtx.clearRect(0, 0, 1, 1);
          colorCtx.fillStyle = 'rgba(0, 0, 0, 0)';
          colorCtx.fillStyle = colorStr;
          colorCtx.fillRect(0, 0, 1, 1);
          const data = colorCtx.getImageData(0, 0, 1, 1).data;
          return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3] / 255
          };
        } catch (e) {
          return { r: 0, g: 0, b: 0, a: 1.0 };
        }
      }

      function getLuminance({ r, g, b }) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function computeContrast(fg, bg) {
        const effectiveFg = (fg.a < 1.0) ? {
          r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
          g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
          b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
          a: 1.0
        } : fg;

        const l1 = getLuminance(effectiveFg);
        const l2 = getLuminance(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return { effectiveFg, ratio };
      }

      // Modern CSS Color Module 4 formats
      const oklchVibrant = parseColor('oklch(0.65 0.24 140)');
      const oklchTranslucent = parseColor('oklch(0.7 0.15 180 / 0.5)');
      const srgbOpaque = parseColor('color(srgb 0.2 0.5 0.8)');
      const srgbTranslucent = parseColor('color(srgb 0.9 0.9 0.9 / 0.7)');

      // Alpha-blended contrast
      // 1. Black 40% on white: blended = 255 * 0.6 = 153 -> fails WCAG AA (4.5:1)
      const black40OnWhite = computeContrast({ r: 0, g: 0, b: 0, a: 0.4 }, { r: 255, g: 255, b: 255, a: 1.0 });

      // 2. Black 85% on white: blended = 255 * 0.15 = 38 -> passes WCAG AA
      const black85OnWhite = computeContrast({ r: 0, g: 0, b: 0, a: 0.85 }, { r: 255, g: 255, b: 255, a: 1.0 });

      // 3. White 80% on dark background (20, 25, 35)
      const white80OnDark = computeContrast({ r: 255, g: 255, b: 255, a: 0.8 }, { r: 20, g: 25, b: 35, a: 1.0 });

      // Gradient parsing test
      const gradientRegex = /(color\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|hwb\([^)]+\)|#[0-9a-fA-F]{3,8})/;
      const oklchGradient = 'linear-gradient(135deg, oklch(0.2 0.05 250) 0%, oklch(0.3 0.08 250) 100%)';
      const extractedFromGradient = oklchGradient.match(gradientRegex)?.[1];
      const parsedGradientBg = parseColor(extractedFromGradient);

      return {
        oklchVibrant,
        oklchTranslucent,
        srgbOpaque,
        srgbTranslucent,
        black40OnWhite,
        black85OnWhite,
        white80OnDark,
        extractedFromGradient,
        parsedGradientBg
      };
    });

    // Check modern color resolution
    assert.ok(result.oklchVibrant.g > 100, 'oklch vibrant green resolved');
    assert.equal(result.oklchVibrant.a, 1.0);

    assert.ok(result.oklchTranslucent.g > 0);
    assert.ok(Math.abs(result.oklchTranslucent.a - 0.5) < 0.02, 'oklch alpha resolved');

    assert.ok(result.srgbOpaque.b > result.srgbOpaque.r);
    assert.ok(Math.abs(result.srgbTranslucent.a - 0.7) < 0.02, 'color(srgb) alpha resolved');

    // Check alpha blending calculations
    assert.equal(result.black40OnWhite.effectiveFg.r, 153);
    assert.ok(result.black40OnWhite.ratio < 3.0, '40% black on white must fail contrast');

    assert.ok(result.black85OnWhite.ratio > 8.0, '85% black on white must pass contrast');
    assert.ok(result.white80OnDark.ratio > 9.0, '80% white on dark must pass contrast');

    // Check gradient color extraction
    assert.equal(result.extractedFromGradient, 'oklch(0.2 0.05 250)');
    assert.ok(result.parsedGradientBg.b > 0, 'gradient background oklch parsed to non-zero blue');
  } finally {
    await browser.close();
  }
});

// ============================================================================
// Adversarial Scenario 8: Clean browser.close() in all validator test runs
// ============================================================================
test('Scenario 8: clean browser shutdown in all validator test execution paths', async (t) => {
  // Spawn standalone server in child process so event loop is never blocked
  let serverProcess;
  let serverPort;

  await new Promise((resolve, reject) => {
    serverProcess = spawn(process.execPath, [serverScript], { stdio: ['pipe', 'pipe', 'inherit'] });
    serverProcess.stdout.on('data', (d) => {
      const m = d.toString().match(/SERVER_READY:(\d+)/);
      if (m) {
        serverPort = m[1];
        resolve();
      }
    });
    serverProcess.on('error', reject);
  });

  t.after(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  await t.test('8.1: missing hd-deck exits cleanly with error and closes browser', () => {
    const res = runNode(validatorBin, [`http://127.0.0.1:${serverPort}/no-deck`], { timeout: 15000 });
    assert.equal(res.status, 1, 'Validator must exit with code 1 when hd-deck is missing');
    assert.match(res.stderr + res.stdout, /Fatal execution error/);
    assert.match(res.stderr + res.stdout, /waitForSelector/);
  });

  await t.test('8.2: invalid/unreachable URL exits cleanly with error and closes browser', () => {
    const res = runNode(validatorBin, ['http://127.0.0.1:1'], { timeout: 15000 });
    assert.equal(res.status, 1, 'Validator must exit with code 1 on network error');
    assert.match(res.stderr + res.stdout, /Fatal execution error/);
  });

  await t.test('8.3: no URL supplied exits 1 without launching browser', () => {
    const res = runNode(validatorBin, []);
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Please specify the target slideshow URL/);
  });

  await t.test('8.4: --help exits 0 without launching browser', () => {
    const res = runNode(validatorBin, ['--help']);
    assert.equal(res.status, 0);
    assert.match(res.stdout, /Usage:/);
  });

  await t.test('8.5: SVG deck execution completes with code 1 due to violations but zero className.trim crash', () => {
    const res = runNode(validatorBin, [`http://127.0.0.1:${serverPort}/svg-overflow`], { timeout: 15000 });
    assert.equal(res.status, 1);
    assert.doesNotMatch(res.stderr + res.stdout, /TypeError: el\.className\.trim is not a function/);
    assert.match(res.stderr, /svg\.overflow-svg/);
    assert.match(res.stderr, /circle\.danger-circle/);
  });

  await t.test('8.6: contrast violation deck reports violations and exits 1', () => {
    const res = runNode(validatorBin, [`http://127.0.0.1:${serverPort}/contrast-fail`], { timeout: 15000 });
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Contrast Issue/);
  });
});
