import { chromium } from '@playwright/test';

async function runAdversarialRecheck() {
  console.log('=== STARTING ADVERSARIAL CHALLENGER M2 RE-CHECK ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];

  function assert(condition, message, details = {}) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✓ PASS: ${message}`);
    } else {
      failedTests++;
      console.error(`  ✗ FAIL: ${message}`, details);
      failures.push({ message, details });
    }
  }

  try {
    console.log('Navigating to variant-test page...');
    await page.goto('http://localhost:5173/demo/variant-test/index.html');
    await page.waitForSelector('hd-deck', { state: 'attached' });

    // =========================================================================
    // TARGET 1: Container Specificity & Cascade Matrix for hd-card & hd-box
    // =========================================================================
    console.log('\n--- TARGET 1: Specificity & Cascade Matrix on hd-card and hd-box ---');

    const matrixResults = await page.evaluate(() => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const variants = ['base', 'main', 'accent'];
      const surfaces = ['soft', 'solid'];
      const headings = ['base', 'main', 'accent'];
      const components = ['hd-card', 'hd-box'];

      const results = [];

      for (const tag of components) {
        for (const variant of variants) {
          for (const surface of surfaces) {
            for (const heading of headings) {
              // Reference element with variant = heading and same surface
              const refEl = document.createElement(tag);
              refEl.setAttribute('variant', heading);
              refEl.setAttribute('surface', surface);
              refEl.innerHTML = `<h3 slot="heading">Ref</h3><p>Body</p>`;
              container.appendChild(refEl);

              // Test element with variant != heading, explicit surface, and explicit heading
              const testEl = document.createElement(tag);
              testEl.setAttribute('variant', variant);
              testEl.setAttribute('surface', surface);
              testEl.setAttribute('heading', heading);
              testEl.innerHTML = `<h3 slot="heading">Test</h3><p>Body</p>`;
              container.appendChild(testEl);

              // Variant-only element (what it would be if heading was ignored)
              const varOnlyEl = document.createElement(tag);
              varOnlyEl.setAttribute('variant', variant);
              varOnlyEl.setAttribute('surface', surface);
              varOnlyEl.innerHTML = `<h3 slot="heading">VarOnly</h3><p>Body</p>`;
              container.appendChild(varOnlyEl);

              const refHeadingBg = window.getComputedStyle(refEl.querySelector('h3')).backgroundColor;
              const testHeadingBg = window.getComputedStyle(testEl.querySelector('h3')).backgroundColor;
              const varOnlyHeadingBg = window.getComputedStyle(varOnlyEl.querySelector('h3')).backgroundColor;

              const refHeadingColor = window.getComputedStyle(refEl.querySelector('h3')).color;
              const testHeadingColor = window.getComputedStyle(testEl.querySelector('h3')).color;

              const testHostStyle = window.getComputedStyle(testEl);
              const headingBgProp = tag === 'hd-card' ? '--hd-card-heading-background-color' : '--hd-box-heading-background-color';
              const headingTextProp = tag === 'hd-card' ? '--hd-card-heading-text-color' : '--hd-box-heading-text-color';

              const computedBgToken = testHostStyle.getPropertyValue(headingBgProp).trim();
              const computedTextToken = testHostStyle.getPropertyValue(headingTextProp).trim();

              results.push({
                tag,
                variant,
                surface,
                heading,
                testHeadingBg,
                refHeadingBg,
                varOnlyHeadingBg,
                testHeadingColor,
                refHeadingColor,
                computedBgToken,
                computedTextToken,
              });

              refEl.remove();
              testEl.remove();
              varOnlyEl.remove();
            }
          }
        }
      }

      container.remove();
      return results;
    });

    for (const r of matrixResults) {
      const desc = `<${r.tag} variant="${r.variant}" surface="${r.surface}" heading="${r.heading}">`;
      assert(
        r.testHeadingBg === r.refHeadingBg,
        `${desc} heading background matches reference heading background`,
        { testBg: r.testHeadingBg, refBg: r.refHeadingBg, varOnlyBg: r.varOnlyHeadingBg }
      );
      if (r.variant !== r.heading) {
        assert(
          r.testHeadingBg !== r.varOnlyHeadingBg,
          `${desc} heading background successfully overrides variant heading background`,
          { testBg: r.testHeadingBg, varOnlyBg: r.varOnlyHeadingBg }
        );
      }
      assert(
        r.testHeadingColor === r.refHeadingColor,
        `${desc} heading text color matches reference heading text color`,
        { testColor: r.testHeadingColor, refColor: r.refHeadingColor }
      );
    }

    // Dynamic Mutation Test for Heading Override
    console.log('\n--- TARGET 1 (Adversarial): Dynamic Mutation of heading attribute ---');
    const dynamicHeadingResult = await page.evaluate(() => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const card = document.createElement('hd-card');
      card.setAttribute('variant', 'main');
      card.setAttribute('surface', 'solid');
      card.innerHTML = `<h3 slot="heading">Title</h3><p>Body</p>`;
      container.appendChild(card);

      const refMain = document.createElement('hd-card');
      refMain.setAttribute('variant', 'main');
      refMain.setAttribute('surface', 'solid');
      refMain.innerHTML = `<h3 slot="heading">Title</h3><p>Body</p>`;
      container.appendChild(refMain);

      const refAccent = document.createElement('hd-card');
      refAccent.setAttribute('variant', 'accent');
      refAccent.setAttribute('surface', 'solid');
      refAccent.innerHTML = `<h3 slot="heading">Title</h3><p>Body</p>`;
      container.appendChild(refAccent);

      const refBase = document.createElement('hd-card');
      refBase.setAttribute('variant', 'base');
      refBase.setAttribute('surface', 'solid');
      refBase.innerHTML = `<h3 slot="heading">Title</h3><p>Body</p>`;
      container.appendChild(refBase);

      const h3 = card.querySelector('h3');
      const step0 = window.getComputedStyle(h3).backgroundColor;

      // Dynamically add heading="accent"
      card.setAttribute('heading', 'accent');
      const step1 = window.getComputedStyle(h3).backgroundColor;

      // Dynamically change to heading="base"
      card.setAttribute('heading', 'base');
      const step2 = window.getComputedStyle(h3).backgroundColor;

      // Dynamically remove heading attribute
      card.removeAttribute('heading');
      const step3 = window.getComputedStyle(h3).backgroundColor;

      const mainBg = window.getComputedStyle(refMain.querySelector('h3')).backgroundColor;
      const accentBg = window.getComputedStyle(refAccent.querySelector('h3')).backgroundColor;
      const baseBg = window.getComputedStyle(refBase.querySelector('h3')).backgroundColor;

      container.remove();
      return { step0, step1, step2, step3, mainBg, accentBg, baseBg };
    });

    assert(dynamicHeadingResult.step0 === dynamicHeadingResult.mainBg, 'Initial card without heading attribute uses variant="main"');
    assert(dynamicHeadingResult.step1 === dynamicHeadingResult.accentBg, 'Dynamic setAttribute("heading", "accent") updates heading bg to accent');
    assert(dynamicHeadingResult.step2 === dynamicHeadingResult.baseBg, 'Dynamic setAttribute("heading", "base") updates heading bg to base');
    assert(dynamicHeadingResult.step3 === dynamicHeadingResult.mainBg, 'Dynamic removeAttribute("heading") reverts heading bg to main');

    // =========================================================================
    // TARGET 2: Scoped Slide Heading Detection & Header Text Styling
    // =========================================================================
    console.log('\n--- TARGET 2: Scoped Slide Heading Detection on hd-slide ---');

    const slideHeadingResults = await page.evaluate(async () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.width = '960px';
      container.style.height = '540px';
      document.body.appendChild(container);

      // Slide 1: Card only
      const s1 = document.createElement('hd-slide');
      s1.setAttribute('variant', 'main');
      s1.setAttribute('active', '');
      s1.innerHTML = `
        <div slot="header" id="h1">Header 1</div>
        <hd-card id="card1"><h3 slot="heading">Card Heading</h3><p>Text</p></hd-card>
      `;
      container.appendChild(s1);

      // Slide 2: Box only
      const s2 = document.createElement('hd-slide');
      s2.setAttribute('variant', 'main');
      s2.setAttribute('active', '');
      s2.innerHTML = `
        <div slot="header" id="h2">Header 2</div>
        <hd-box id="box2"><h3 slot="heading">Box Heading</h3><p>Text</p></hd-box>
      `;
      container.appendChild(s2);

      // Slide 3: Deeply nested card
      const s3 = document.createElement('hd-slide');
      s3.setAttribute('variant', 'main');
      s3.setAttribute('active', '');
      s3.innerHTML = `
        <div slot="header" id="h3">Header 3</div>
        <div class="wrapper-1"><div class="wrapper-2">
          <hd-card id="card3"><h3 slot="heading">Nested Card Heading</h3><p>Text</p></hd-card>
        </div></div>
      `;
      container.appendChild(s3);

      // Slide 4: Split layout with card in pane, NO split heading
      const s4 = document.createElement('hd-slide');
      s4.setAttribute('variant', 'main');
      s4.setAttribute('active', '');
      s4.innerHTML = `
        <div slot="header" id="h4">Header 4</div>
        <hd-layout-split id="split4">
          <div slot="left"><hd-card id="card4"><h3 slot="heading">Left Card Heading</h3></hd-card></div>
          <div slot="right"><p>Right pane</p></div>
        </hd-layout-split>
      `;
      container.appendChild(s4);

      // Slide 5: Slide with TRUE layout heading banner (positive control)
      const s5 = document.createElement('hd-slide');
      s5.setAttribute('variant', 'main');
      s5.setAttribute('active', '');
      s5.innerHTML = `
        <div slot="header" id="h5">Header 5</div>
        <hd-layout id="layout5">
          <h2 slot="heading">True Layout Title</h2>
          <p>Body</p>
        </hd-layout>
      `;
      container.appendChild(s5);

      // Slide 6: Slide with direct slot="heading" (positive control)
      const s6 = document.createElement('hd-slide');
      s6.setAttribute('variant', 'main');
      s6.setAttribute('active', '');
      s6.innerHTML = `
        <div slot="header" id="h6">Header 6</div>
        <h1 slot="heading">Direct Slide Title</h1>
        <p>Body</p>
      `;
      container.appendChild(s6);

      // Slide 7: Plain slide with NO heading at all (reference body header)
      const s7 = document.createElement('hd-slide');
      s7.setAttribute('variant', 'main');
      s7.setAttribute('active', '');
      s7.innerHTML = `
        <div slot="header" id="h7">Header 7</div>
        <p>Just plain text</p>
      `;
      container.appendChild(s7);

      await new Promise(r => setTimeout(r, 60));

      const res = {
        s1HasHeading: s1.hasAttribute('has-heading'),
        s2HasHeading: s2.hasAttribute('has-heading'),
        s3HasHeading: s3.hasAttribute('has-heading'),
        s4HasHeading: s4.hasAttribute('has-heading'),
        s5HasHeading: s5.hasAttribute('has-heading'),
        s6HasHeading: s6.hasAttribute('has-heading'),
        s7HasHeading: s7.hasAttribute('has-heading'),

        h1Color: window.getComputedStyle(s1.querySelector('#h1')).color,
        h2Color: window.getComputedStyle(s2.querySelector('#h2')).color,
        h3Color: window.getComputedStyle(s3.querySelector('#h3')).color,
        h4Color: window.getComputedStyle(s4.querySelector('#h4')).color,
        h5Color: window.getComputedStyle(s5.querySelector('#h5')).color,
        h6Color: window.getComputedStyle(s6.querySelector('#h6')).color,
        h7Color: window.getComputedStyle(s7.querySelector('#h7')).color,

        h1BgToken: window.getComputedStyle(s1.querySelector('#h1')).getPropertyValue('--hd-background-color').trim(),
        h5BgToken: window.getComputedStyle(s5.querySelector('#h5')).getPropertyValue('--hd-background-color').trim(),
        h7BgToken: window.getComputedStyle(s7.querySelector('#h7')).getPropertyValue('--hd-background-color').trim(),
      };

      container.remove();
      return res;
    });

    assert(slideHeadingResults.s1HasHeading === false, 'Slide with only hd-card heading has has-heading === false');
    assert(slideHeadingResults.s2HasHeading === false, 'Slide with only hd-box heading has has-heading === false');
    assert(slideHeadingResults.s3HasHeading === false, 'Slide with deeply nested hd-card heading has has-heading === false');
    assert(slideHeadingResults.s4HasHeading === false, 'Slide with hd-layout-split containing hd-card has has-heading === false');
    assert(slideHeadingResults.s5HasHeading === true, 'Slide with hd-layout banner correctly gains has-heading === true');
    assert(slideHeadingResults.s6HasHeading === true, 'Slide with direct slot="heading" correctly gains has-heading === true');
    assert(slideHeadingResults.s7HasHeading === false, 'Slide with no headings has has-heading === false');

    // Verify header styling: s1, s2, s3, s4 headers must match plain slide s7 header styling
    assert(slideHeadingResults.h1Color === slideHeadingResults.h7Color, 'Slide 1 (card heading) header color matches plain body header color');
    assert(slideHeadingResults.h2Color === slideHeadingResults.h7Color, 'Slide 2 (box heading) header color matches plain body header color');
    assert(slideHeadingResults.h3Color === slideHeadingResults.h7Color, 'Slide 3 (nested card heading) header color matches plain body header color');
    assert(slideHeadingResults.h4Color === slideHeadingResults.h7Color, 'Slide 4 (split card heading) header color matches plain body header color');
    assert(slideHeadingResults.h1BgToken === slideHeadingResults.h7BgToken, 'Slide 1 header background token matches plain body header background token');

    // And s5 (true banner) header color must differ from plain body header color
    assert(slideHeadingResults.h5Color !== slideHeadingResults.h7Color, 'Slide 5 (true banner) header color switches to banner color');

    // Dynamic Mutation on Slide: adding card heading vs adding layout heading
    console.log('\n--- TARGET 2 (Adversarial): Dynamic Layout mutation with card present ---');
    const dynamicSlideResult = await page.evaluate(async () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const slide = document.createElement('hd-slide');
      slide.setAttribute('variant', 'main');
      slide.setAttribute('active', '');
      slide.innerHTML = `
        <div slot="header" id="dyn-h">Header</div>
        <div id="body-container">
          <hd-card id="persistent-card"><h3 slot="heading">Card Title</h3><p>Text</p></hd-card>
        </div>
      `;
      container.appendChild(slide);
      await new Promise(r => setTimeout(r, 40));

      const state0 = slide.hasAttribute('has-heading');

      // Dynamically insert hd-layout with heading banner
      const layout = document.createElement('hd-layout');
      layout.innerHTML = `<h2 slot="heading">Banner Heading</h2><p>Layout body</p>`;
      slide.querySelector('#body-container').prepend(layout);
      await new Promise(r => setTimeout(r, 40));

      const state1 = slide.hasAttribute('has-heading');

      // Dynamically remove the layout banner (card remains)
      layout.remove();
      await new Promise(r => setTimeout(r, 40));

      const state2 = slide.hasAttribute('has-heading');

      container.remove();
      return { state0, state1, state2 };
    });

    assert(dynamicSlideResult.state0 === false, 'Slide with card heading starts with has-heading === false');
    assert(dynamicSlideResult.state1 === true, 'Slide gains has-heading === true when hd-layout banner is dynamically inserted');
    assert(dynamicSlideResult.state2 === false, 'Slide reverts to has-heading === false when hd-layout banner is removed (card still present)');

    // =========================================================================
    // TARGET 3: hd-presenter-controls Event Listener Deduplication
    // =========================================================================
    console.log('\n--- TARGET 3: hd-presenter-controls Event Listener Deduplication ---');

    await page.goto('http://localhost:5173/demo/features/presenter.html');
    await page.waitForSelector('hd-presenter-controls', { state: 'attached' });

    // Test 3.1: 3 reconnects, click #next once -> exactly 1 message
    const reconnect3NextResult = await page.evaluate(async () => {
      const controls = document.querySelector('hd-presenter-controls');
      const parent = controls.parentElement;
      const channel = new BroadcastChannel('features-channel');
      const msgs = [];
      channel.onmessage = (e) => msgs.push(e.data);

      for (let i = 0; i < 3; i++) {
        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 20));
      }

      const nextBtn = controls.shadowRoot.getElementById('next');
      nextBtn.click();
      await new Promise(r => setTimeout(r, 50));

      channel.close();
      return { count: msgs.length, msgs };
    });

    assert(
      reconnect3NextResult.count === 1 && reconnect3NextResult.msgs[0]?.action === 'next',
      'Clicking #next once after 3 disconnect/reconnect cycles emits exactly 1 { type: "nav", action: "next" } message',
      reconnect3NextResult
    );

    // Test 3.2: 5 reconnects, click #prev once -> exactly 1 message
    const reconnect5PrevResult = await page.evaluate(async () => {
      const controls = document.querySelector('hd-presenter-controls');
      const parent = controls.parentElement;
      const channel = new BroadcastChannel('features-channel');
      const msgs = [];
      channel.onmessage = (e) => msgs.push(e.data);

      for (let i = 0; i < 5; i++) {
        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 20));
      }

      const prevBtn = controls.shadowRoot.getElementById('prev');
      prevBtn.click();
      await new Promise(r => setTimeout(r, 50));

      channel.close();
      return { count: msgs.length, msgs };
    });

    assert(
      reconnect5PrevResult.count === 1 && reconnect5PrevResult.msgs[0]?.action === 'prev',
      'Clicking #prev once after 5 disconnect/reconnect cycles emits exactly 1 { type: "nav", action: "prev" } message',
      reconnect5PrevResult
    );

    // Test 3.3: 10 reconnects, click #next once -> exactly 1 message
    const reconnect10NextResult = await page.evaluate(async () => {
      const controls = document.querySelector('hd-presenter-controls');
      const parent = controls.parentElement;
      const channel = new BroadcastChannel('features-channel');
      const msgs = [];
      channel.onmessage = (e) => msgs.push(e.data);

      for (let i = 0; i < 10; i++) {
        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 10));
      }

      const nextBtn = controls.shadowRoot.getElementById('next');
      nextBtn.click();
      await new Promise(r => setTimeout(r, 50));

      channel.close();
      return { count: msgs.length, msgs };
    });

    assert(
      reconnect10NextResult.count === 1 && reconnect10NextResult.msgs[0]?.action === 'next',
      'Clicking #next once after 10 disconnect/reconnect cycles emits exactly 1 message',
      reconnect10NextResult
    );

    // Test 3.4: Keyboard listener deduplication and cleanup
    console.log('\n--- TARGET 3 (Adversarial): Keyboard listener cleanup and deduplication ---');
    const keydownResult = await page.evaluate(async () => {
      const controls = document.querySelector('hd-presenter-controls');
      const parent = controls.parentElement;
      const channel = new BroadcastChannel('features-channel');
      const msgs = [];
      channel.onmessage = (e) => msgs.push(e.data);

      // Reconnect 3 times
      for (let i = 0; i < 3; i++) {
        parent.removeChild(controls);
        parent.appendChild(controls);
        await new Promise(r => setTimeout(r, 10));
      }

      // Dispatch ArrowRight while connected
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await new Promise(r => setTimeout(r, 30));
      const countWhileConnected = msgs.length;

      // Disconnect
      parent.removeChild(controls);
      await new Promise(r => setTimeout(r, 10));

      // Dispatch ArrowRight while disconnected
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await new Promise(r => setTimeout(r, 30));
      const countWhileDisconnected = msgs.length;

      // Reconnect
      parent.appendChild(controls);
      await new Promise(r => setTimeout(r, 10));

      // Dispatch ArrowLeft
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await new Promise(r => setTimeout(r, 30));
      const countAfterReconnected = msgs.length;

      channel.close();
      return { countWhileConnected, countWhileDisconnected, countAfterReconnected, msgs };
    });

    assert(keydownResult.countWhileConnected === 1, 'Keyboard ArrowRight emits exactly 1 message after 3 reconnects', keydownResult);
    assert(keydownResult.countWhileDisconnected === 1, 'Keyboard listener is cleanly removed when disconnected (0 messages emitted)', keydownResult);
    assert(keydownResult.countAfterReconnected === 2, 'Keyboard ArrowLeft emits exactly 1 message after reconnection', keydownResult);

  } catch (err) {
    console.error('UNEXPECTED EXCEPTION:', err);
    failures.push({ message: 'Unhandled exception', error: err.stack });
    failedTests++;
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`RE-CHECK COMPLETE: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    console.error('FAILURES SUMMARY:', JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    console.log('ALL EMPIRICAL ADVERSARIAL CHECKS PASSED WITH ZERO FAILURES.');
    process.exit(0);
  }
}

runAdversarialRecheck();
