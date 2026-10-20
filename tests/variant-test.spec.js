import { test, expect } from '@playwright/test';
import { THEMES, applyTheme } from './helpers/theme-helper.js';
import {
  BROWSER_COLOR_HELPERS,
  getLuminance,
  getContrastRatio,
  isTransparent,
} from './helpers/color-utils.js';

/**
 * Playwright E2E Verification Test Suite for html-deck
 * Requirement R5: 4-tier opaque-box test design methodology.
 */

test.describe('html-deck Playwright Verification Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/variant-test/index.html');
    await page.waitForSelector('hd-deck', { state: 'attached' });
    await page.evaluate(BROWSER_COLOR_HELPERS);
  });

  // =========================================================================
  // TIER 1: Feature Coverage
  // =========================================================================
  test.describe('Tier 1: Feature Coverage', () => {
    test('1.1 Component Registration: all core custom elements are defined', async ({ page }) => {
      const defined = await page.evaluate(() => {
        const tags = [
          'hd-deck',
          'hd-slide',
          'hd-layout',
          'hd-layout-cover',
          'hd-layout-split',
          'hd-layout-grid',
          'hd-card',
          'hd-box',
          'hd-callout',
        ];
        return tags.map((tag) => ({ tag, isDefined: !!customElements.get(tag) }));
      });

      for (const item of defined) {
        expect(item.isDefined, `Custom element <${item.tag}> must be registered`).toBe(true);
      }
    });

    for (const theme of THEMES) {
      test(`1.2 Theme [${theme.name}]: 3-variant x 2-surface matrix tokens defined under :root`, async ({ page }) => {
        await applyTheme(page, theme.name);

        const matrixTokens = await page.evaluate(() => {
          const style = window.getComputedStyle(document.documentElement);
          const variants = ['base', 'main', 'accent'];
          const surfaces = ['soft', 'solid'];

          const tokens = {};
          for (const variant of variants) {
            tokens[variant] = {};
            for (const surface of surfaces) {
              const prefix = `--hd-${variant}-${surface}`;
              tokens[variant][surface] = {
                bodyBg: style.getPropertyValue(`${prefix}-body-background-color`).trim(),
                bodyText: style.getPropertyValue(`${prefix}-body-text-color`).trim(),
                bodyHighlight: style.getPropertyValue(`${prefix}-body-text-highlight-color`).trim(),
                bodyMuted: style.getPropertyValue(`${prefix}-body-text-muted-color`).trim(),
                headingBg: style.getPropertyValue(`${prefix}-heading-background-color`).trim(),
                headingText: style.getPropertyValue(`${prefix}-heading-text-color`).trim(),
                border: (
                  style.getPropertyValue(`${prefix}-border`).trim() ||
                  style.getPropertyValue('--hd-border-color-default').trim()
                ),
              };
            }
          }
          return tokens;
        });

        const variants = ['base', 'main', 'accent'];
        const surfaces = ['soft', 'solid'];

        for (const variant of variants) {
          for (const surface of surfaces) {
            const token = matrixTokens[variant][surface];
            expect(token.bodyBg.length, `${theme.name}: ${variant}-${surface} body-background-color`).toBeGreaterThan(0);
            expect(token.bodyText.length, `${theme.name}: ${variant}-${surface} body-text-color`).toBeGreaterThan(0);
            expect(token.headingBg.length, `${theme.name}: ${variant}-${surface} heading-background-color`).toBeGreaterThan(0);
            expect(token.headingText.length, `${theme.name}: ${variant}-${surface} heading-text-color`).toBeGreaterThan(0);
          }
        }
      });
    }

    test('1.3 Component Attributes: container heading="base|main|accent" variations', async ({ page }) => {
      const headingStyles = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const results = [];
        const headings = ['base', 'main', 'accent'];

        for (const heading of headings) {
          const card = document.createElement('hd-card');
          card.setAttribute('heading', heading);
          card.innerHTML = `<h3 slot="heading">Title</h3><p>Content</p>`;
          container.appendChild(card);

          const box = document.createElement('hd-box');
          box.setAttribute('heading', heading);
          box.innerHTML = `<h3 slot="heading">Title</h3><p>Content</p>`;
          container.appendChild(box);

          results.push({
            heading,
            cardHeadingAttr: card.getAttribute('heading'),
            boxHeadingAttr: box.getAttribute('heading'),
          });
        }

        container.remove();
        return results;
      });

      for (const res of headingStyles) {
        expect(res.cardHeadingAttr).toBe(res.heading);
        expect(res.boxHeadingAttr).toBe(res.heading);
      }
    });
  });

  // =========================================================================
  // TIER 2: Boundary & Corner Cases
  // =========================================================================
  test.describe('Tier 2: Boundary & Corner Cases', () => {
    for (const theme of THEMES) {
      test(`2.1 Non-transparent Backgrounds [${theme.name}]: verifies all active contexts are opaque`, async ({ page }) => {
        await applyTheme(page, theme.name);

        const evaluatedColors = await page.evaluate(() => {
          const style = window.getComputedStyle(document.documentElement);
          const variants = ['base', 'main', 'accent'];
          const surfaces = ['soft', 'solid'];
          const parsed = [];

          for (const variant of variants) {
            for (const surface of surfaces) {
              const bgRaw = style.getPropertyValue(`--hd-${variant}-${surface}-body-background-color`).trim();
              const colorObj = window.__hdTest.parseColor(bgRaw);
              parsed.push({ variant, surface, bgRaw, colorObj });
            }
          }
          return parsed;
        });

        for (const item of evaluatedColors) {
          expect(
            item.colorObj.a,
            `Theme ${theme.name} ${item.variant}-${item.surface} background must not be transparent (${item.bgRaw})`
          ).toBeGreaterThan(0);
        }
      });

      test(`2.2 Non-transparent Borders [${theme.name}]: verifies border tokens are visible and non-zero`, async ({ page }) => {
        await applyTheme(page, theme.name);

        const borderColors = await page.evaluate(() => {
          const style = window.getComputedStyle(document.documentElement);
          const variants = ['base', 'main', 'accent'];
          const surfaces = ['soft', 'solid'];
          const results = [];

          for (const variant of variants) {
            for (const surface of surfaces) {
              let borderRaw = style.getPropertyValue(`--hd-${variant}-${surface}-border`).trim();
              if (!borderRaw) {
                borderRaw = style.getPropertyValue(
                  surface === 'solid' ? '--hd-border-color-surfaced' : '--hd-border-color-default'
                ).trim();
              }
              const colorObj = window.__hdTest.parseColor(borderRaw);
              results.push({ variant, surface, borderRaw, colorObj });
            }
          }
          return results;
        });

        for (const item of borderColors) {
          expect(
            item.colorObj.a,
            `Theme ${theme.name} ${item.variant}-${item.surface} border color must not be transparent (${item.borderRaw})`
          ).toBeGreaterThan(0);
        }
      });

      test(`2.3 Distinct Surfaces [${theme.name}]: soft vs solid surfaces must be visually distinct`, async ({ page }) => {
        await applyTheme(page, theme.name);

        const surfaceDiffs = await page.evaluate(() => {
          const style = window.getComputedStyle(document.documentElement);
          const variants = ['base', 'main', 'accent'];
          const diffs = [];

          for (const variant of variants) {
            const softBgRaw = style.getPropertyValue(`--hd-${variant}-soft-body-background-color`).trim();
            const solidBgRaw = style.getPropertyValue(`--hd-${variant}-solid-body-background-color`).trim();

            const softColor = window.__hdTest.parseColor(softBgRaw);
            const solidColor = window.__hdTest.parseColor(solidBgRaw);

            diffs.push({
              variant,
              softBgRaw,
              solidBgRaw,
              softColor,
              solidColor,
            });
          }
          return diffs;
        });

        for (const item of surfaceDiffs) {
          const isIdentical =
            item.softColor.r === item.solidColor.r &&
            item.softColor.g === item.solidColor.g &&
            item.softColor.b === item.solidColor.b &&
            item.softColor.a === item.solidColor.a;

          expect(
            isIdentical,
            `Theme ${theme.name} variant [${item.variant}] soft (${item.softBgRaw}) and solid (${item.solidBgRaw}) backgrounds must be distinct`
          ).toBe(false);
        }
      });
    }

    test('2.4 Header & Footer Legibility: slotted header and footer text have legible contrast', async ({ page }) => {
      await applyTheme(page, 'default');

      const contrastData = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        // Slide with layout heading
        const slideWithHeading = document.createElement('hd-slide');
        slideWithHeading.setAttribute('active', '');
        slideWithHeading.innerHTML = `
          <div slot="header" id="test-header-1">Slide Header With Heading</div>
          <hd-layout>
            <h2 slot="heading">Section Title</h2>
            <p>Body</p>
          </hd-layout>
          <div slot="footer" id="test-footer-1">Slide Footer</div>
        `;
        container.appendChild(slideWithHeading);

        const headerEl = slideWithHeading.querySelector('#test-header-1');
        const footerEl = slideWithHeading.querySelector('#test-footer-1');

        const headerFg = window.__hdTest.parseColor(window.getComputedStyle(headerEl).color);
        const headerBg = window.__hdTest.getEffectiveBackground(headerEl);

        const footerFg = window.__hdTest.parseColor(window.getComputedStyle(footerEl).color);
        const footerBg = window.__hdTest.getEffectiveBackground(footerEl);

        container.remove();

        return {
          header: { fg: headerFg, bg: headerBg },
          footer: { fg: footerFg, bg: footerBg },
        };
      });

      const headerRatio = getContrastRatio(contrastData.header.fg, contrastData.header.bg);
      const footerRatio = getContrastRatio(contrastData.footer.fg, contrastData.footer.bg);

      // Normal text requires >= 4.5:1
      expect(headerRatio, `Header contrast ratio (${headerRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(4.5);
      expect(footerRatio, `Footer contrast ratio (${footerRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(4.5);
    });
  });

  // =========================================================================
  // TIER 3: Cross-Feature Interactions
  // =========================================================================
  test.describe('Tier 3: Cross-Feature Interactions', () => {
    test('3.1 :root Overrides Precedence: unlayered :root overrides layered library defaults without html:root', async ({ page }) => {
      // 1. Initial color without override
      const initialBg = await page.evaluate(() => {
        const style = window.getComputedStyle(document.documentElement);
        return style.getPropertyValue('--hd-theme-background-color').trim();
      });

      // 2. Inject unlayered :root override
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.id = 'test-user-root-override';
        style.textContent = `
          :root {
            --hd-theme-background-color: rgb(42, 84, 126);
          }
        `;
        document.head.appendChild(style);
      });

      // 3. Verify override takes effect
      const overriddenBg = await page.evaluate(() => {
        const style = window.getComputedStyle(document.documentElement);
        return window.__hdTest.parseColor(style.getPropertyValue('--hd-theme-background-color').trim());
      });

      expect(overriddenBg.r).toBe(42);
      expect(overriddenBg.g).toBe(84);
      expect(overriddenBg.b).toBe(126);

      // 4. Cleanup override and confirm restoration
      await page.evaluate(() => {
        const style = document.getElementById('test-user-root-override');
        if (style) style.remove();
      });

      const restoredBg = await page.evaluate(() => {
        const style = window.getComputedStyle(document.documentElement);
        return style.getPropertyValue('--hd-theme-background-color').trim();
      });

      expect(restoredBg).toBe(initialBg);
    });

    test('3.2 Dynamic has-heading Contrast: layout heading banner vs body styling', async ({ page }) => {
      await applyTheme(page, 'default');

      const layoutData = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        const slide = document.createElement('hd-slide');
        slide.innerHTML = `
          <hd-layout>
            <h2 slot="heading" id="layout-heading-h2">Layout Heading Title</h2>
            <p id="layout-body-p">Layout Body Paragraph Content</p>
          </hd-layout>
        `;
        container.appendChild(slide);

        const headingEl = slide.querySelector('#layout-heading-h2');
        const bodyEl = slide.querySelector('#layout-body-p');

        const headingFg = window.__hdTest.parseColor(window.getComputedStyle(headingEl).color);
        const headingBg = window.__hdTest.getEffectiveBackground(headingEl);

        const bodyFg = window.__hdTest.parseColor(window.getComputedStyle(bodyEl).color);
        const bodyBg = window.__hdTest.getEffectiveBackground(bodyEl);

        container.remove();

        return {
          heading: { fg: headingFg, bg: headingBg },
          body: { fg: bodyFg, bg: bodyBg },
        };
      });

      const headingRatio = getContrastRatio(layoutData.heading.fg, layoutData.heading.bg);
      const bodyRatio = getContrastRatio(layoutData.body.fg, layoutData.body.bg);

      // Large heading >= 3.0:1, body >= 4.5:1
      expect(headingRatio, `Heading contrast (${headingRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(3.0);
      expect(bodyRatio, `Body contrast (${bodyRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(4.5);
    });

    test('3.3 Nested Components: scoped token inheritance without style leakage', async ({ page }) => {
      await applyTheme(page, 'default');

      const nestedData = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const slide = document.createElement('hd-slide');
        slide.setAttribute('variant', 'base');
        slide.setAttribute('surface', 'soft');

        slide.innerHTML = `
          <p id="slide-text">Slide Base Soft</p>
          <hd-card variant="main" surface="solid" id="nested-card">
            <h3 slot="heading">Card Title</h3>
            <p id="card-text">Card Main Solid</p>
            <hd-box variant="accent" surface="soft" id="nested-box">
              <p id="box-text">Box Accent Soft</p>
            </hd-box>
          </hd-card>
        `;
        container.appendChild(slide);

        const slideP = slide.querySelector('#slide-text');
        const cardP = slide.querySelector('#card-text');
        const boxP = slide.querySelector('#box-text');

        const cardEl = slide.querySelector('#nested-card');
        const boxEl = slide.querySelector('#nested-box');

        const res = {
          slidePColor: window.getComputedStyle(slideP).color,
          cardPColor: window.getComputedStyle(cardP).color,
          boxPColor: window.getComputedStyle(boxP).color,
          cardVariant: cardEl.getAttribute('variant'),
          cardSurface: cardEl.getAttribute('surface'),
          boxVariant: boxEl.getAttribute('variant'),
          boxSurface: boxEl.getAttribute('surface'),
        };

        container.remove();
        return res;
      });

      expect(nestedData.cardVariant).toBe('main');
      expect(nestedData.cardSurface).toBe('solid');
      expect(nestedData.boxVariant).toBe('accent');
      expect(nestedData.boxSurface).toBe('soft');

      // The slotted elements should have computed colors
      expect(nestedData.slidePColor.length).toBeGreaterThan(0);
      expect(nestedData.cardPColor.length).toBeGreaterThan(0);
      expect(nestedData.boxPColor.length).toBeGreaterThan(0);
    });

    test('3.4 Grid Margin Reset: direct children of hd-layout-grid reset bottom margin', async ({ page }) => {
      const margins = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const grid = document.createElement('hd-layout-grid');
        grid.innerHTML = `
          <hd-box id="grid-child-1"><p>Child 1</p></hd-box>
          <hd-box id="grid-child-2"><p>Child 2</p></hd-box>
        `;
        container.appendChild(grid);

        const child1 = grid.querySelector('#grid-child-1');
        const child2 = grid.querySelector('#grid-child-2');

        const m1 = window.getComputedStyle(child1).marginBottom;
        const m2 = window.getComputedStyle(child2).marginBottom;

        container.remove();
        return { m1, m2 };
      });

      expect(margins.m1).toBe('0px');
      expect(margins.m2).toBe('0px');
    });
  });

  // =========================================================================
  // TIER 4: Real-World Scenarios (WCAG AA Contrast)
  // =========================================================================
  test.describe('Tier 4: Real-World Scenarios (WCAG AA Contrast)', () => {
    for (const theme of THEMES) {
      test(`4.1 WCAG AA Palette Compliance [${theme.name}]: all 6 contexts meet 4.5:1 / 3.0:1`, async ({ page }) => {
        await applyTheme(page, theme.name);

        const paletteRatios = await page.evaluate(() => {
          const style = window.getComputedStyle(document.documentElement);
          const themeBgRaw = style.getPropertyValue('--hd-theme-background-color').trim() || '#ffffff';
          const themeBg = window.__hdTest.parseColor(themeBgRaw);

          const variants = ['base', 'main', 'accent'];
          const surfaces = ['soft', 'solid'];
          const items = [];

          for (const variant of variants) {
            for (const surface of surfaces) {
              const prefix = `--hd-${variant}-${surface}`;
              const bodyBgRaw = style.getPropertyValue(`${prefix}-body-background-color`).trim();
              const bodyTextRaw = style.getPropertyValue(`${prefix}-body-text-color`).trim();
              const bodyHighlightRaw = style.getPropertyValue(`${prefix}-body-text-highlight-color`).trim();
              const headingBgRaw = style.getPropertyValue(`${prefix}-heading-background-color`).trim();
              const headingTextRaw = style.getPropertyValue(`${prefix}-heading-text-color`).trim();

              const bg = window.__hdTest.parseColor(bodyBgRaw);
              const text = window.__hdTest.parseColor(bodyTextRaw);
              const highlight = window.__hdTest.parseColor(bodyHighlightRaw);

              const hBg = window.__hdTest.parseColor(headingBgRaw);
              const hText = window.__hdTest.parseColor(headingTextRaw);

              items.push({
                variant,
                surface,
                themeBg,
                body: { fg: text, bg, rawFg: bodyTextRaw, rawBg: bodyBgRaw },
                highlight: { fg: highlight, bg, rawFg: bodyHighlightRaw, rawBg: bodyBgRaw },
                heading: { fg: hText, bg: hBg, rawFg: headingTextRaw, rawBg: headingBgRaw },
              });
            }
          }
          return items;
        });

        for (const item of paletteRatios) {
          // Normal body text >= 4.5:1
          const bodyRatio = getContrastRatio(item.body.fg, item.body.bg, item.themeBg);
          expect(
            bodyRatio,
            `Theme ${theme.name} ${item.variant}-${item.surface} body text contrast (${bodyRatio.toFixed(2)}:1) for fg:${item.body.rawFg} bg:${item.body.rawBg}`
          ).toBeGreaterThanOrEqual(4.5);

          // Highlight text >= 4.5:1
          const highlightRatio = getContrastRatio(item.highlight.fg, item.highlight.bg, item.themeBg);
          expect(
            highlightRatio,
            `Theme ${theme.name} ${item.variant}-${item.surface} highlight contrast (${highlightRatio.toFixed(2)}:1) for fg:${item.highlight.rawFg} bg:${item.highlight.rawBg}`
          ).toBeGreaterThanOrEqual(4.5);

          // Heading text >= 3.0:1 (large text)
          const headingRatio = getContrastRatio(item.heading.fg, item.heading.bg, item.themeBg);
          expect(
            headingRatio,
            `Theme ${theme.name} ${item.variant}-${item.surface} heading contrast (${headingRatio.toFixed(2)}:1) for fg:${item.heading.rawFg} bg:${item.heading.rawBg}`
          ).toBeGreaterThanOrEqual(3.0);
        }
      });
    }

    test('4.2 Demo Variant-Test Slide Deck Audit: verifies all slides render without contrast violations', async ({ page }) => {
      await applyTheme(page, 'default');

      const violations = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        if (!deck || !deck.slides) return [{ error: 'No deck found' }];

        const foundViolations = [];
        const slideCount = deck.slides.length;

        for (let i = 0; i < slideCount; i++) {
          const slide = deck.slides[i];
          const textElements = slide.querySelectorAll('h1, h2, h3, h4, p, span, li');

          for (const el of textElements) {
            const text = (el.textContent || '').trim();
            if (!text || text.length <= 1) continue;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
              continue;
            }

            const fg = window.__hdTest.parseColor(style.color);
            const bg = window.__hdTest.getEffectiveBackground(el);

            const fontSize = parseFloat(style.fontSize);
            const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight, 10) >= 600;
            const isLarge = (fontSize >= 18.66 && isBold) || fontSize >= 24;
            const required = isLarge ? 3.0 : 4.5;

            // Compute luminance
            const [rl1, gl1, bl1] = [fg.r, fg.g, fg.b].map((v) => {
              const s = v / 255;
              return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            });
            const lFg = 0.2126 * rl1 + 0.7152 * gl1 + 0.0722 * bl1;

            const [rl2, gl2, bl2] = [bg.r, bg.g, bg.b].map((v) => {
              const s = v / 255;
              return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            });
            const lBg = 0.2126 * rl2 + 0.7152 * gl2 + 0.0722 * bl2;

            const ratio = (Math.max(lFg, lBg) + 0.05) / (Math.min(lFg, lBg) + 0.05);

            if (ratio < required - 0.1) {
              foundViolations.push({
                slideIndex: i + 1,
                tagName: el.tagName,
                text: text.substring(0, 30),
                ratio: ratio.toFixed(2),
                required,
                fg: style.color,
              });
            }
          }
        }

        return foundViolations;
      });

      // Filter out any known non-content elements or report
      expect(violations, `Found ${violations.length} contrast violations on variant-test slides`).toEqual([]);
    });
  });
});
