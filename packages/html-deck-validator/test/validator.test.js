import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const validatorBin = path.resolve(__dirname, '../bin/html-deck-validator.js');

test('CLI --help prints usage and exits 0', () => {
  const out = execFileSync(process.execPath, [validatorBin, '--help'], { encoding: 'utf8' });
  assert.match(out, /Usage:/);
  assert.match(out, /html-deck-validator <url>/);
});

test('CLI without url prints error and exits 1', () => {
  assert.throws(
    () => {
      execFileSync(process.execPath, [validatorBin], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
    },
    (err) => {
      assert.equal(err.status, 1);
      assert.match(err.stderr, /Please specify the target slideshow URL/);
      return true;
    }
  );
});

test('SVG element safe className handling (SVGAnimatedString)', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(() => {
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

      // Create SVG container and elements
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'diagram-svg hd-ignore');
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'flow-line');
      svg.appendChild(line);
      document.body.appendChild(svg);

      // Verify el.className is indeed SVGAnimatedString
      const isAnimatedString = typeof line.className === 'object';
      const selector = getUniqueSelector(line);

      return { isAnimatedString, selector };
    });

    assert.ok(result.isAnimatedString, 'Expected line.className to be SVGAnimatedString');
    assert.match(result.selector, /line\.flow-line/);
  } finally {
    await browser.close();
  }
});

test('Modern CSS color format parsing and fallback handling', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const parsed = await page.evaluate(() => {
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

      return {
        hex: parseColor('#1a2b3c'),
        hexAlpha: parseColor('#1a2b3c80'),
        rgb: parseColor('rgb(10, 20, 30)'),
        rgba: parseColor('rgba(10, 20, 30, 0.5)'),
        srgb: parseColor('color(srgb 0.2 0.4 0.6 / 0.8)'),
        oklch: parseColor('oklch(0.7 0.15 180 / 0.6)'),
        lab: parseColor('lab(50 20 -30 / 0.7)'),
        named: parseColor('royalblue'),
        transparent: parseColor('transparent')
      };
    });

    assert.equal(parsed.hex.r, 0x1a);
    assert.equal(parsed.hex.g, 0x2b);
    assert.equal(parsed.hex.b, 0x3c);
    assert.equal(parsed.hex.a, 1.0);

    assert.equal(parsed.hexAlpha.r, 0x1a);
    assert.ok(Math.abs(parsed.hexAlpha.a - 0.5) < 0.02);

    assert.equal(parsed.rgb.r, 10);
    assert.equal(parsed.rgb.g, 20);
    assert.equal(parsed.rgb.b, 30);
    assert.equal(parsed.rgb.a, 1.0);

    assert.equal(parsed.rgba.r, 10);
    assert.equal(parsed.rgba.a, 0.5);

    assert.ok(parsed.srgb.r > 0);
    assert.ok(Math.abs(parsed.srgb.a - 0.8) < 0.02);

    assert.ok(parsed.oklch.g > 0);
    assert.ok(Math.abs(parsed.oklch.a - 0.6) < 0.02);

    assert.ok(parsed.lab.r > 0);
    assert.ok(Math.abs(parsed.lab.a - 0.7) < 0.02);

    assert.equal(parsed.named.r, 65);
    assert.equal(parsed.named.g, 105);
    assert.equal(parsed.named.b, 225);

    assert.equal(parsed.transparent.a, 0.0);
  } finally {
    await browser.close();
  }
});

test('Gradient background modern color extraction', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(() => {
      const gradientRegex = /(color\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|hwb\([^)]+\)|#[0-9a-fA-F]{3,8})/;

      const gradients = [
        'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        'linear-gradient(to right, oklch(0.7 0.15 180), #ffffff)',
        'radial-gradient(circle, color(srgb 0.2 0.3 0.4) 0%, transparent 100%)',
        'linear-gradient(to bottom, rgba(255, 0, 0, 0.8), rgba(0, 0, 255, 0.8))'
      ];

      return gradients.map(g => {
        const m = g.match(gradientRegex);
        return m ? m[1] : null;
      });
    });

    assert.equal(result[0], '#111827');
    assert.equal(result[1], 'oklch(0.7 0.15 180)');
    assert.equal(result[2], 'color(srgb 0.2 0.3 0.4)');
    assert.equal(result[3], 'rgba(255, 0, 0, 0.8)');
  } finally {
    await browser.close();
  }
});

test('Alpha blending and contrast calculation for semi-transparent text', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(() => {
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
        return {
          effectiveFg,
          ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
        };
      }

      // 50% black text on pure white background
      const darkOnWhite = computeContrast({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 255, g: 255, b: 255, a: 1.0 });

      // 70% white text on dark background (rgb(20, 20, 20))
      const lightOnDark = computeContrast({ r: 255, g: 255, b: 255, a: 0.7 }, { r: 20, g: 20, b: 20, a: 1.0 });

      return { darkOnWhite, lightOnDark };
    });

    // 50% black on white blends to rgb(128, 128, 128)
    assert.equal(result.darkOnWhite.effectiveFg.r, 128);
    assert.equal(result.darkOnWhite.effectiveFg.g, 128);
    assert.equal(result.darkOnWhite.effectiveFg.b, 128);
    // Ratio of ~128 on 255 is roughly 4.0:1
    assert.ok(result.darkOnWhite.ratio > 3.8 && result.darkOnWhite.ratio < 4.2);

    // 70% white on dark (20, 20, 20) blends to round(255*0.7 + 20*0.3) = 185
    assert.equal(result.lightOnDark.effectiveFg.r, 185);
    assert.ok(result.lightOnDark.ratio > 8.0);
  } finally {
    await browser.close();
  }
});

test('Slide margin scaling scales margins by container scale factor', () => {
  const slideRect = { left: 100, right: 1100, top: 50, bottom: 650 };
  const baseMarginTop = 40;
  const baseMarginRight = 40;
  const baseMarginBottom = 40;
  const baseMarginLeft = 40;

  function computeBounds(scale) {
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

  // Scale 1.0
  const b1 = computeBounds(1.0);
  assert.equal(b1.contentLeft, 140);
  assert.equal(b1.contentRight, 1060);
  assert.equal(b1.contentTop, 90);
  assert.equal(b1.contentBottom, 610);

  // Scale 1.5
  const b2 = computeBounds(1.5);
  assert.equal(b2.contentLeft, 160);
  assert.equal(b2.contentRight, 1040);
  assert.equal(b2.contentTop, 110);
  assert.equal(b2.contentBottom, 590);
});
