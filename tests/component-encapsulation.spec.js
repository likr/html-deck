import { test, expect } from '@playwright/test';
import { THEMES, applyTheme } from './helpers/theme-helper.js';
import { BROWSER_COLOR_HELPERS, getContrastRatio } from './helpers/color-utils.js';

test.describe('Component Encapsulation & Token Bridging Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/variant-test/index.html');
    await page.waitForSelector('hd-deck', { state: 'attached' });
    await page.evaluate(BROWSER_COLOR_HELPERS);
  });

  // =========================================================================
  // Focus 1: Token Bridging across Shadow DOM boundaries
  // =========================================================================
  test.describe('Focus 1: Token Bridging across Shadow DOM boundaries', () => {
    test('1.1 Token bridging on hd-slide, hd-card, hd-box, and hd-callout', async ({ page }) => {
      const results = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        const components = [
          { tag: 'hd-slide', html: '<p id="slotted-slide">Slide text</p>' },
          { tag: 'hd-card', html: '<p id="slotted-card">Card text</p>' },
          { tag: 'hd-box', html: '<p id="slotted-box">Box text</p>' },
          { tag: 'hd-callout', html: '<p id="slotted-callout">Callout text</p>' },
        ];

        const tokensToCheck = [
          '--hd-background-color',
          '--hd-text-color',
          '--hd-text-highlight-color',
          '--hd-text-muted-color',
          '--hd-border-color',
        ];

        const testResults = [];

        for (const comp of components) {
          for (const variant of ['base', 'main', 'accent']) {
            for (const surface of ['soft', 'solid']) {
              const el = document.createElement(comp.tag);
              el.setAttribute('variant', variant);
              el.setAttribute('surface', surface);
              if (comp.tag === 'hd-slide') el.setAttribute('active', '');
              el.innerHTML = comp.html;
              container.appendChild(el);

              const slottedP = el.querySelector('p');
              const hostStyle = window.getComputedStyle(el);
              const slottedStyle = window.getComputedStyle(slottedP);

              const compTokens = {};
              for (const token of tokensToCheck) {
                const hostVal = hostStyle.getPropertyValue(token).trim();
                const slottedVal = slottedStyle.getPropertyValue(token).trim();
                compTokens[token] = { hostVal, slottedVal };
              }

              testResults.push({
                tag: comp.tag,
                variant,
                surface,
                compTokens,
              });

              el.remove();
            }
          }
        }

        container.remove();
        return testResults;
      });

      for (const res of results) {
        for (const [token, vals] of Object.entries(res.compTokens)) {
          expect(
            vals.hostVal.length,
            `${res.tag} [${res.variant}-${res.surface}] host must declare ${token}`
          ).toBeGreaterThan(0);
          expect(
            vals.slottedVal,
            `${res.tag} [${res.variant}-${res.surface}] slotted element must inherit ${token}`
          ).toBe(vals.hostVal);
        }
      }
    });

    test('1.2 Nested container token inheritance without leakage', async ({ page }) => {
      const nestedResult = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const slide = document.createElement('hd-slide');
        slide.setAttribute('variant', 'main');
        slide.setAttribute('surface', 'solid');
        slide.setAttribute('active', '');

        slide.innerHTML = `
          <span id="slide-span">Slide Level</span>
          <hd-card variant="accent" surface="soft" id="child-card">
            <span id="card-span">Card Level</span>
            <hd-box variant="base" surface="solid" id="child-box">
              <span id="box-span">Box Level</span>
            </hd-box>
          </hd-card>
        `;
        container.appendChild(slide);

        const slideSpan = slide.querySelector('#slide-span');
        const cardSpan = slide.querySelector('#card-span');
        const boxSpan = slide.querySelector('#box-span');

        const slideStyle = window.getComputedStyle(slideSpan);
        const cardStyle = window.getComputedStyle(cardSpan);
        const boxStyle = window.getComputedStyle(boxSpan);

        const res = {
          slideBg: slideStyle.getPropertyValue('--hd-background-color').trim(),
          cardBg: cardStyle.getPropertyValue('--hd-background-color').trim(),
          boxBg: boxStyle.getPropertyValue('--hd-background-color').trim(),
          slideText: slideStyle.getPropertyValue('--hd-text-color').trim(),
          cardText: cardStyle.getPropertyValue('--hd-text-color').trim(),
          boxText: boxStyle.getPropertyValue('--hd-text-color').trim(),
        };

        container.remove();
        return res;
      });

      expect(nestedResult.cardBg).not.toBe(nestedResult.slideBg);
      expect(nestedResult.boxBg).not.toBe(nestedResult.cardBg);
      expect(nestedResult.boxBg).not.toBe(nestedResult.slideBg);
    });
  });

  // =========================================================================
  // Focus 2: Dynamic [has-heading] toggling & recursion safety
  // =========================================================================
  test.describe('Focus 2: Dynamic [has-heading] toggling and recursion safety', () => {
    test('2.1 Dynamic [has-heading] addition, removal, and slot="header" color switching on variant="main"', async ({ page }) => {
      const result = await page.evaluate(async () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        const slide = document.createElement('hd-slide');
        slide.setAttribute('variant', 'main');
        slide.setAttribute('active', '');
        slide.innerHTML = `
          <div slot="header" id="dyn-header">Slide Header</div>
          <div id="content-area">Initial content without heading</div>
        `;
        container.appendChild(slide);

        // Allow microtasks / connectedCallback
        await new Promise(r => setTimeout(r, 20));

        const headerEl = slide.querySelector('#dyn-header');
        const initialHasHeadingAttr = slide.hasAttribute('has-heading');
        const initialHeaderColor = window.getComputedStyle(headerEl).color;
        const initialHeaderBg = window.getComputedStyle(headerEl).getPropertyValue('--hd-background-color').trim();

        // Dynamically add hd-layout with heading slot
        const layout = document.createElement('hd-layout');
        layout.innerHTML = `<h2 slot="heading">Dynamic Title</h2><p>Body</p>`;
        slide.querySelector('#content-area').appendChild(layout);

        // Wait for MutationObserver
        await new Promise(r => setTimeout(r, 50));

        const afterAddHasHeadingAttr = slide.hasAttribute('has-heading');
        const afterAddHeaderColor = window.getComputedStyle(headerEl).color;
        const afterAddHeaderBg = window.getComputedStyle(headerEl).getPropertyValue('--hd-background-color').trim();

        // Dynamically remove the layout
        layout.remove();

        // Wait for MutationObserver
        await new Promise(r => setTimeout(r, 50));

        const afterRemoveHasHeadingAttr = slide.hasAttribute('has-heading');
        const afterRemoveHeaderColor = window.getComputedStyle(headerEl).color;
        const afterRemoveHeaderBg = window.getComputedStyle(headerEl).getPropertyValue('--hd-background-color').trim();

        container.remove();

        return {
          initial: { hasHeading: initialHasHeadingAttr, color: initialHeaderColor, bg: initialHeaderBg },
          afterAdd: { hasHeading: afterAddHasHeadingAttr, color: afterAddHeaderColor, bg: afterAddHeaderBg },
          afterRemove: { hasHeading: afterRemoveHasHeadingAttr, color: afterRemoveHeaderColor, bg: afterRemoveHeaderBg },
        };
      });

      expect(result.initial.hasHeading, 'Slide initially has NO has-heading attribute').toBe(false);
      expect(result.afterAdd.hasHeading, 'Slide gains has-heading attribute when layout added').toBe(true);
      expect(result.afterRemove.hasHeading, 'Slide loses has-heading attribute when layout removed').toBe(false);

      // Verify header color switches on variant="main"
      expect(result.afterAdd.color, 'Header color changes when heading banner is added').not.toBe(result.initial.color);
      expect(result.afterRemove.color, 'Header color returns to initial when heading banner is removed').toBe(result.initial.color);
    });

    test('2.2 Stress test: 100 rapid mutations do not cause recursion loop or lockup', async ({ page }) => {
      const iterationsCompleted = await page.evaluate(async () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const slide = document.createElement('hd-slide');
        slide.setAttribute('active', '');
        container.appendChild(slide);

        let count = 0;
        const target = 100;

        for (let i = 0; i < target; i++) {
          const layout = document.createElement('hd-layout');
          layout.innerHTML = `<h2 slot="heading">Heading ${i}</h2>`;
          slide.appendChild(layout);
          await Promise.resolve();
          layout.remove();
          await Promise.resolve();
          count++;
        }

        await new Promise(r => setTimeout(r, 50));
        const finalHasHeading = slide.hasAttribute('has-heading');

        container.remove();
        return { count, finalHasHeading };
      });

      expect(iterationsCompleted.count).toBe(100);
      expect(iterationsCompleted.finalHasHeading).toBe(false);
    });

    test('2.3 Verification: hd-card with heading inside hd-slide does NOT cause false positive has-heading on hd-slide', async ({ page }) => {
      const cardResult = await page.evaluate(async () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        // Slide with variant="main" and NO layout heading banner
        const slide = document.createElement('hd-slide');
        slide.setAttribute('variant', 'main');
        slide.setAttribute('active', '');
        slide.innerHTML = `
          <div slot="header" id="test-header">Slide Header</div>
          <hd-card id="test-card">
            <h3 slot="heading">Card Heading</h3>
            <p>Card Content</p>
          </hd-card>
        `;
        container.appendChild(slide);

        await new Promise(r => setTimeout(r, 50));

        const slideHasHeading = slide.hasAttribute('has-heading');
        const cardHasHeading = slide.querySelector('#test-card').hasAttribute('has-heading');
        const headerEl = slide.querySelector('#test-header');
        const headerStyle = window.getComputedStyle(headerEl);
        const headerColor = headerStyle.color;
        const headerBgToken = headerStyle.getPropertyValue('--hd-background-color').trim();

        container.remove();
        return { slideHasHeading, cardHasHeading, headerColor, headerBgToken };
      });

      console.log('Verification 2.3 Scoped [has-heading] on hd-slide:', cardResult);
      expect(cardResult.slideHasHeading, 'hd-slide must not falsely claim has-heading from nested card').toBe(false);
      expect(cardResult.cardHasHeading, 'hd-card retains its own has-heading').toBe(true);
    });
  });

  // =========================================================================
  // Focus 3: Container Component Cascade Order & Specificity Bugs
  // =========================================================================
  test.describe('Focus 3: Container Component Cascade Order (Rule 4)', () => {
    test('3.1 hd-card heading="accent" variant="main" (no surface) renders accent heading background', async ({ page }) => {
      const colors = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const refAccentCard = document.createElement('hd-card');
        refAccentCard.setAttribute('variant', 'accent');
        refAccentCard.innerHTML = `<h3 slot="heading">Ref Accent Heading</h3><p>Body</p>`;
        container.appendChild(refAccentCard);

        const refMainCard = document.createElement('hd-card');
        refMainCard.setAttribute('variant', 'main');
        refMainCard.innerHTML = `<h3 slot="heading">Ref Main Heading</h3><p>Body</p>`;
        container.appendChild(refMainCard);

        const testCard = document.createElement('hd-card');
        testCard.setAttribute('variant', 'main');
        testCard.setAttribute('heading', 'accent');
        testCard.innerHTML = `<h3 slot="heading">Test Heading</h3><p>Body</p>`;
        container.appendChild(testCard);

        const refAccentHeadingBg = window.getComputedStyle(refAccentCard.querySelector('h3')).backgroundColor;
        const refMainHeadingBg = window.getComputedStyle(refMainCard.querySelector('h3')).backgroundColor;
        const testHeadingBg = window.getComputedStyle(testCard.querySelector('h3')).backgroundColor;

        container.remove();

        return {
          refAccentHeadingBg,
          refMainHeadingBg,
          testHeadingBg,
        };
      });

      expect(colors.testHeadingBg).toBe(colors.refAccentHeadingBg);
      expect(colors.testHeadingBg).not.toBe(colors.refMainHeadingBg);
    });

    test('3.2 Specificity: hd-card surface="solid" variant="main" heading="accent" applies cascade correctly', async ({ page }) => {
      const colors = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const refAccentSolid = document.createElement('hd-card');
        refAccentSolid.setAttribute('variant', 'accent');
        refAccentSolid.setAttribute('surface', 'solid');
        refAccentSolid.innerHTML = `<h3 slot="heading">Ref Accent Heading</h3><p>Body</p>`;
        container.appendChild(refAccentSolid);

        const refMainSolid = document.createElement('hd-card');
        refMainSolid.setAttribute('variant', 'main');
        refMainSolid.setAttribute('surface', 'solid');
        refMainSolid.innerHTML = `<h3 slot="heading">Ref Main Heading</h3><p>Body</p>`;
        container.appendChild(refMainSolid);

        const testCard = document.createElement('hd-card');
        testCard.setAttribute('variant', 'main');
        testCard.setAttribute('surface', 'solid');
        testCard.setAttribute('heading', 'accent');
        testCard.innerHTML = `<h3 slot="heading">Test Heading</h3><p>Body</p>`;
        container.appendChild(testCard);

        const refAccentBg = window.getComputedStyle(refAccentSolid.querySelector('h3')).backgroundColor;
        const refMainBg = window.getComputedStyle(refMainSolid.querySelector('h3')).backgroundColor;
        const testBg = window.getComputedStyle(testCard.querySelector('h3')).backgroundColor;

        container.remove();

        return {
          refAccentBg,
          refMainBg,
          testBg,
        };
      });

      console.log('Verification 3.2 Specificity for surface="solid":', colors);
      expect(colors.testBg, 'heading="accent" overrides variant on surface="solid"').toBe(colors.refAccentBg);
      expect(colors.testBg).not.toBe(colors.refMainBg);
    });

    test('3.3 Specificity: hd-card surface="soft" variant="main" heading="accent" applies cascade correctly', async ({ page }) => {
      const colors = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const refAccentCard = document.createElement('hd-card');
        refAccentCard.setAttribute('variant', 'accent');
        refAccentCard.innerHTML = `<h3 slot="heading">Ref Accent</h3><p>Body</p>`;
        container.appendChild(refAccentCard);

        const refMainCard = document.createElement('hd-card');
        refMainCard.setAttribute('variant', 'main');
        refMainCard.innerHTML = `<h3 slot="heading">Ref Main</h3><p>Body</p>`;
        container.appendChild(refMainCard);

        const testCard = document.createElement('hd-card');
        testCard.setAttribute('variant', 'main');
        testCard.setAttribute('surface', 'soft');
        testCard.setAttribute('heading', 'accent');
        testCard.innerHTML = `<h3 slot="heading">Test Heading</h3><p>Body</p>`;
        container.appendChild(testCard);

        const refAccentBg = window.getComputedStyle(refAccentCard.querySelector('h3')).backgroundColor;
        const refMainBg = window.getComputedStyle(refMainCard.querySelector('h3')).backgroundColor;
        const testBg = window.getComputedStyle(testCard.querySelector('h3')).backgroundColor;

        container.remove();

        return {
          refAccentBg,
          refMainBg,
          testBg,
        };
      });

      console.log('Verification 3.3 Specificity for surface="soft":', colors);
      expect(colors.testBg, 'heading="accent" overrides variant on surface="soft"').toBe(colors.refAccentBg);
      expect(colors.testBg).not.toBe(colors.refMainBg);
    });

    test('3.4 Specificity: hd-box surface="solid" variant="main" heading="accent" applies cascade correctly', async ({ page }) => {
      const colors = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const refAccentBox = document.createElement('hd-box');
        refAccentBox.setAttribute('variant', 'accent');
        refAccentBox.setAttribute('surface', 'solid');
        refAccentBox.innerHTML = `<h3 slot="heading">Accent Heading</h3><p>Body</p>`;
        container.appendChild(refAccentBox);

        const refMainBox = document.createElement('hd-box');
        refMainBox.setAttribute('variant', 'main');
        refMainBox.setAttribute('surface', 'solid');
        refMainBox.innerHTML = `<h3 slot="heading">Main Heading</h3><p>Body</p>`;
        container.appendChild(refMainBox);

        const testBox = document.createElement('hd-box');
        testBox.setAttribute('variant', 'main');
        testBox.setAttribute('surface', 'solid');
        testBox.setAttribute('heading', 'accent');
        testBox.innerHTML = `<h3 slot="heading">Test Heading</h3><p>Body</p>`;
        container.appendChild(testBox);

        const refAccentBg = window.getComputedStyle(refAccentBox.querySelector('h3')).backgroundColor;
        const refMainBg = window.getComputedStyle(refMainBox.querySelector('h3')).backgroundColor;
        const testBg = window.getComputedStyle(testBox.querySelector('h3')).backgroundColor;

        container.remove();
        return { refAccentBg, refMainBg, testBg };
      });

      console.log('Verification 3.4 hd-box Specificity:', colors);
      expect(colors.testBg, 'heading="accent" overrides variant on hd-box').toBe(colors.refAccentBg);
      expect(colors.testBg).not.toBe(colors.refMainBg);
    });
  });

  // =========================================================================
  // Focus 4: Grid Layout Margin Reset
  // =========================================================================
  test.describe('Focus 4: Grid Layout Margin Reset', () => {
    test('4.1 Direct children of hd-layout-grid compute margin-bottom === 0px', async ({ page }) => {
      const results = await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.width = '960px';
        container.style.height = '540px';
        document.body.appendChild(container);

        const grid = document.createElement('hd-layout-grid');
        grid.innerHTML = `
          <div slot="before" id="before-item">Before element</div>
          <hd-card id="grid-card"><p>Card in grid</p></hd-card>
          <hd-box id="grid-box"><p>Box in grid</p></hd-box>
          <hd-callout id="grid-callout"><p>Callout in grid</p></hd-callout>
          <p id="grid-p">Paragraph in grid</p>
          <div slot="after" id="after-item">After element</div>
        `;
        container.appendChild(grid);

        const cardMargin = window.getComputedStyle(grid.querySelector('#grid-card')).marginBottom;
        const boxMargin = window.getComputedStyle(grid.querySelector('#grid-box')).marginBottom;
        const calloutMargin = window.getComputedStyle(grid.querySelector('#grid-callout')).marginBottom;
        const pMargin = window.getComputedStyle(grid.querySelector('#grid-p')).marginBottom;
        const beforeMargin = window.getComputedStyle(grid.querySelector('#before-item')).marginBottom;

        container.remove();

        return {
          cardMargin,
          boxMargin,
          calloutMargin,
          pMargin,
          beforeMargin,
        };
      });

      expect(results.cardMargin, 'hd-card in grid has margin-bottom: 0px').toBe('0px');
      expect(results.boxMargin, 'hd-box in grid has margin-bottom: 0px').toBe('0px');
      expect(results.calloutMargin, 'hd-callout in grid has margin-bottom: 0px').toBe('0px');
      expect(results.pMargin, 'p in grid has margin-bottom: 0px').toBe('0px');
      expect(results.beforeMargin).not.toBe('0px');
    });
  });

  // =========================================================================
  // Focus 5: hd-deck hashchange navigation & lifecycle listeners
  // =========================================================================
  test.describe('Focus 5: hd-deck hashchange navigation & lifecycle', () => {
    test('5.1 Changing window.location.hash navigates deck without recursion loop', async ({ page }) => {
      const initialIndex = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        return deck.currentIndex;
      });
      expect(initialIndex).toBe(0);

      await page.evaluate(() => {
        window.location.hash = '#slide-3';
      });

      await page.waitForTimeout(100);

      const newIndex = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        const activeSlide = deck.querySelector('hd-slide[active]');
        const activeIndex = deck.slides.indexOf(activeSlide);
        return { deckIndex: deck.currentIndex, activeIndex, hash: window.location.hash };
      });

      expect(newIndex.deckIndex).toBe(2);
      expect(newIndex.activeIndex).toBe(2);
      expect(newIndex.hash).toBe('#slide-3');

      await page.evaluate(() => {
        window.location.hash = '#slide-1';
      });
      await page.waitForTimeout(100);

      const backIndex = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        return { deckIndex: deck.currentIndex, hash: window.location.hash };
      });

      expect(backIndex.deckIndex).toBe(0);
      expect(backIndex.hash).toBe('#slide-1');
    });

    test('5.2 Out-of-bounds or malformed hash routes are ignored safely', async ({ page }) => {
      await page.evaluate(() => {
        window.location.hash = '#slide-999';
      });
      await page.waitForTimeout(50);

      const afterInvalid = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        return deck.currentIndex;
      });
      expect(afterInvalid).toBe(0);

      await page.evaluate(() => {
        window.location.hash = '#random-anchor';
      });
      await page.waitForTimeout(50);

      const afterRandom = await page.evaluate(() => {
        const deck = document.querySelector('hd-deck');
        return deck.currentIndex;
      });
      expect(afterRandom).toBe(0);
    });

    test('5.3 Control button click listeners are NOT duplicated on reconnection', async ({ page }) => {
      const clickResult = await page.evaluate(async () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const deck = document.createElement('hd-deck');
        deck.innerHTML = `
          <hd-slide id="s1"><p>1</p></hd-slide>
          <hd-slide id="s2"><p>2</p></hd-slide>
          <hd-slide id="s3"><p>3</p></hd-slide>
          <hd-slide id="s4"><p>4</p></hd-slide>
        `;
        container.appendChild(deck);

        // Wait for setTimeout in connectedCallback to initialize this.slides
        await new Promise(r => setTimeout(r, 50));

        // Disconnect and reconnect 3 times
        container.removeChild(deck);
        container.appendChild(deck);
        await new Promise(r => setTimeout(r, 50));
        container.removeChild(deck);
        container.appendChild(deck);
        await new Promise(r => setTimeout(r, 50));

        // Click next button once in deck shadow root
        const nextBtn = deck.shadowRoot.getElementById('next-btn');
        const beforeClickIndex = deck.currentIndex;
        nextBtn.click();
        const afterClickIndex = deck.currentIndex;

        container.remove();

        return { beforeClickIndex, afterClickIndex };
      });

      // Exactly 1 advance: before 0, after 1
      expect(clickResult.beforeClickIndex).toBe(0);
      expect(clickResult.afterClickIndex).toBe(1);
    });

    test('5.4 Verification: hd-presenter-controls does NOT duplicate click listeners on reconnection', async ({ page }) => {
      await page.goto('/demo/features/presenter.html');
      await page.waitForSelector('hd-presenter-controls', { state: 'attached' });

      const presenterResult = await page.evaluate(async () => {
        const controls = document.querySelector('hd-presenter-controls');
        const parent = controls.parentElement;

        const channel = new BroadcastChannel('features-channel');
        const messages = [];
        channel.onmessage = (e) => messages.push(e.data);

        // Disconnect and reconnect controls 2 more times (total 3 connections)
        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 20));

        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 20));

        const nextBtn = controls.shadowRoot.getElementById('next');
        nextBtn.click();

        await new Promise(r => setTimeout(r, 50));

        channel.close();
        return { messageCount: messages.length, messages };
      });

      console.log('Verification 5.4 Presenter Controls Message Count after 3 connects:', presenterResult);
      expect(presenterResult.messageCount, 'Single message emitted on single click after 3 connects').toBe(1);
    });
  });

  // =========================================================================
  // Focus 6: Package Exports Verification
  // =========================================================================
  test.describe('Focus 6: Package Exports Verification', () => {
    test('6.1 package.json sideEffects and theme exports exist on disk', async () => {
      const fs = await import('fs');
      const path = await import('path');

      const pkgPath = path.resolve('packages/html-deck/package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      expect(pkg.sideEffects).toBe(true);
      expect(pkg.exports['./css']).toBeUndefined();
      expect(pkg.exports['./presenter/css']).toBeUndefined();

      const expectedThemes = [
        'corporate',
        'dark',
        'dotted',
        'neon',
        'nouveau',
        'serif',
        'warm',
      ];

      for (const t of expectedThemes) {
        const exportKey = `./theme-${t}`;
        expect(pkg.exports[exportKey], `Export ${exportKey} must be present`).toBeDefined();
        const resolvedPath = path.resolve('packages/html-deck', pkg.exports[exportKey]);
        expect(fs.existsSync(resolvedPath), `File for ${exportKey} must exist at ${resolvedPath}`).toBe(true);
      }

      expect(pkg.exports['./themes/*']).toBe('./dist/themes/*');
    });
  });
});
