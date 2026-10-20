#!/usr/bin/env node

import { chromium } from 'playwright';

const url = process.argv[2];
if (!url || url === '--help' || url === '-h') {
  if (url === '--help' || url === '-h') {
    console.log(`
Usage:
  npx html-deck-validator <url>

Options:
  -h, --help   Show this help information

Example:
  npx html-deck-validator http://localhost:5173/slides/ramen/index.html
    `);
    process.exit(0);
  }
  console.error('\x1b[31mError: Please specify the target slideshow URL.\x1b[0m');
  console.error('Usage: npx html-deck-validator <url>');
  console.error('Example: npx html-deck-validator http://localhost:5173/slides/ramen/index.html');
  process.exit(1);
}

(async () => {
  console.log(`\n\x1b[36m⚡ Starting Slide Validation on: ${url}\x1b[0m\n`);

  let browser;
  let exitCode = 0;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'load' });

    // Disable transitions and animations during audit to prevent sampling intermediate states
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
        }
      `
    });

    // Wait for the custom element <hd-deck> to load and mount in the DOM
    await page.waitForSelector('hd-deck', { state: 'attached', timeout: 5000 });

    // Run the audit process in the page context
    const results = await page.evaluate(async () => {
      const deck = document.querySelector('hd-deck');
      if (!deck) {
        return { error: 'Could not find <hd-deck> element on the page.' };
      }

      // Disable transitions on deck and slides
      deck.setAttribute('transition', 'none');

      // Ensure slides are initialized
      if (!deck.slides || deck.slides.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (deck.slides) {
        deck.slides.forEach(slide => {
          slide.setAttribute('transition-style', 'none');
          if (slide.shadowRoot) {
            const style = document.createElement('style');
            style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
            slide.shadowRoot.appendChild(style);
          }
        });
      }

      const slideCount = deck.slides ? deck.slides.length : 0;
      if (slideCount === 0) {
        return { error: 'No slides (<hd-slide>) found inside <hd-deck>.' };
      }

      const allWarnings = [];

      // Reusable 1x1 canvas for modern color space resolution (oklch, lab, color(srgb ...), etc.)
      const colorCanvas = document.createElement('canvas');
      colorCanvas.width = 1;
      colorCanvas.height = 1;
      const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });

      // Helper: Custom descendant checker that bridges Shadow DOM boundary
      function isDescendant(parent, child) {
        let node = child.parentNode || child.host;
        while (node) {
          if (node === parent) return true;
          node = node.parentNode || node.host;
        }
        return false;
      }

      // Helper: Check if element belongs to header/footer/notes slots or is the page number
      function isExcludedFromMarginCheck(element) {
        if (element.id === 'page-num') return true;
        let current = element;
        while (current && current !== document.documentElement) {
          if (current.getAttribute) {
            const slot = current.getAttribute('slot');
            if (slot === 'header' || slot === 'footer' || slot === 'notes') {
              return true;
            }
          }
          current = current.parentNode || (current.getRootNode && current.getRootNode().host);
        }
        return false;
      }

      // Helper: Recursively find all visible content leaf nodes, traversing shadow roots
      function getVisibleLeafElements(root) {
        const elements = [];

        function traverse(node) {
          if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0 || style.pointerEvents === 'none') {
            return;
          }

          // Leaf nodes (visual contents/textholders)
          const isLeaf = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'SPAN', 'IMG', 'VIDEO', 'A', 'HD-CODEBLOCK', 'HD-CALLOUT', 'BUTTON'].includes(node.tagName) 
            || node.children.length === 0;

          if (isLeaf) {
            const rect = node.getBoundingClientRect();
            if (rect.width > 1 && rect.height > 1) { // Skip microscopic elements
              elements.push({
                element: node,
                tagName: node.tagName,
                rect: rect,
                text: (node.innerText || node.textContent || '').trim(),
                html: node.outerHTML.substring(0, 80)
              });
            }
          }

          // Light DOM children
          for (let i = 0; i < node.children.length; i++) {
            traverse(node.children[i]);
          }

          // Shadow DOM children
          if (node.shadowRoot) {
            for (let i = 0; i < node.shadowRoot.children.length; i++) {
              traverse(node.shadowRoot.children[i]);
            }
          }
        }

        traverse(root);
        return elements;
      }

      // Helper: Generate clean selectors for reports, safe with SVGAnimatedString on SVG elements
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
              selector += '.' + classes[0]; // grab primary class
            }
          }
          path.unshift(selector);
          el = el.parentElement || (el.getRootNode && el.getRootNode().host);
        }
        return path.slice(-3).join(' > '); // return last 3 ancestors for clarity
      }

      // Helper: Color parsing for rgb/rgba, hex, color(srgb ...), oklch, lab, and named colors
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
        // Canvas-based parsing for modern CSS Color Module 4 colors (oklch, lab, color(srgb ...), etc.)
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

      // Helper: Traverse upward to calculate effective background color (handling alphas and slotted elements)
      function getEffectiveBackgroundColor(element) {
        let current = element;
        const colors = [];

        while (current && current !== document.documentElement) {
          const style = window.getComputedStyle(current);
          let bgStr = style.backgroundColor;
          if (bgStr === 'rgba(0, 0, 0, 0)' || bgStr === 'transparent') {
            const bgImg = style.backgroundImage;
            if (bgImg && bgImg !== 'none') {
              const colorMatch = bgImg.match(/(color\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|hwb\([^)]+\)|#[0-9a-fA-F]{3,8})/);
              if (colorMatch) {
                bgStr = colorMatch[1];
              }
            }
          }
          const bg = parseColor(bgStr);

          if (bg.a > 0) {
            colors.push(bg);
            if (bg.a === 1.0) {
              break; // Found solid base
            }
          }

          // If the element is slotted, resolve the background of the slot container in the shadow DOM
          if (current.assignedSlot) {
            current = current.assignedSlot.parentElement || (current.assignedSlot.getRootNode && current.assignedSlot.getRootNode().host);
          } else {
            current = current.parentElement || (current.getRootNode && current.getRootNode().host);
          }
        }

        // Apply alpha blending over a white canvas fallback
        let result = { r: 255, g: 255, b: 255, a: 1.0 };
        for (let i = colors.length - 1; i >= 0; i--) {
          const fg = colors[i];
          result = {
            r: Math.round(fg.r * fg.a + result.r * (1 - fg.a)),
            g: Math.round(fg.g * fg.a + result.g * (1 - fg.a)),
            b: Math.round(fg.b * fg.a + result.b * (1 - fg.a)),
            a: 1.0
          };
        }
        return result;
      }

      // Helper: Relative luminance computation
      function getLuminance({ r, g, b }) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      // Traversing slides
      for (let i = 0; i < slideCount; i++) {
        deck.goto(i);
        // Wait 50ms for layout computations to settle without waiting for animations
        await new Promise(resolve => setTimeout(resolve, 50));

        const activeSlide = deck.slides[i];
        const slideIndex = i + 1;
        const slideRect = activeSlide.getBoundingClientRect();
        
        // Grab all visible contents inside active slide (bridging shadow DOMs)
        const leafElements = getVisibleLeafElements(activeSlide);

        // 1. Contrast Audits
        for (const item of leafElements) {
          const el = item.element;
          if (!item.text || item.text.length <= 1) continue;

          const style = window.getComputedStyle(el);
          const fgColor = parseColor(style.color);
          const bgColor = getEffectiveBackgroundColor(el);

          // Composite semi-transparent foreground colors over the effective background color
          const effectiveFg = (fgColor.a < 1.0) ? {
            r: Math.round(fgColor.r * fgColor.a + bgColor.r * (1 - fgColor.a)),
            g: Math.round(fgColor.g * fgColor.a + bgColor.g * (1 - fgColor.a)),
            b: Math.round(fgColor.b * fgColor.a + bgColor.b * (1 - fgColor.a)),
            a: 1.0
          } : fgColor;

          const l1 = getLuminance(effectiveFg);
          const l2 = getLuminance(bgColor);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

          const size = parseFloat(style.fontSize);
          const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight, 10) >= 600;
          const isLarge = (size >= 18.6 && isBold) || (size >= 24);
          const minRatio = isLarge ? 3.0 : 4.5;

          if (ratio < minRatio) {
            const fgText = fgColor.a < 1.0
              ? `rgba(${fgColor.r}, ${fgColor.g}, ${fgColor.b}, ${fgColor.a.toFixed(2)}) [blended rgb(${effectiveFg.r}, ${effectiveFg.g}, ${effectiveFg.b})]`
              : `rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b})`;
            allWarnings.push({
              type: 'contrast',
              slide: slideIndex,
              tagName: el.tagName,
              text: item.text.substring(0, 30),
              ratio: ratio.toFixed(2),
              required: minRatio,
              selector: getUniqueSelector(el),
              fgStyle: fgText,
              bgStyle: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
              sizeStyle: style.fontSize,
              weightStyle: style.fontWeight
            });
          }
        }

        // 2. Overflow Audits
        // Determine container transform scale factor
        let scale = 1.0;
        const container = deck.shadowRoot?.querySelector('.deck-container');
        if (container) {
          if (container.style.transform) {
            const m = container.style.transform.match(/scale\(([\d.]+)\)/);
            if (m) scale = parseFloat(m[1]);
          }
          if (scale === 1.0) {
            const transform = window.getComputedStyle(container).transform;
            if (transform && transform !== 'none') {
              const m = transform.match(/matrix\(([\d.]+)/);
              if (m) scale = parseFloat(m[1]);
            }
          }
        }
        if ((scale === 1.0 || isNaN(scale)) && activeSlide.clientHeight > 0) {
          const derived = slideRect.height / activeSlide.clientHeight;
          if (!isNaN(derived) && derived > 0) {
            scale = derived;
          }
        }

        const style = window.getComputedStyle(activeSlide);
        const parsePx = (val) => {
          if (!val) return 0;
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        };
        const marginTop = parsePx(style.getPropertyValue('--hd-slide-margin-top') || style.marginTop) * scale;
        const marginRight = parsePx(style.getPropertyValue('--hd-slide-margin-right') || style.marginRight) * scale;
        const marginBottom = parsePx(style.getPropertyValue('--hd-slide-margin-bottom') || style.marginBottom) * scale;
        const marginLeft = parsePx(style.getPropertyValue('--hd-slide-margin-left') || style.marginLeft) * scale;

        const contentLeft = slideRect.left + marginLeft;
        const contentRight = slideRect.right - marginRight;
        const contentTop = slideRect.top + marginTop;
        const contentBottom = slideRect.bottom - marginBottom;

        for (const item of leafElements) {
          const el = item.element;

          // Skip if element belongs to header/footer/notes or is page-num
          if (isExcludedFromMarginCheck(el)) {
            continue;
          }

          const rect = item.rect;

          // Check if element spills outside the content bounds (with a 1.5px rounding allowance)
          const isOverflowing =
            rect.left < contentLeft - 1.5 ||
            rect.right > contentRight + 1.5 ||
            rect.top < contentTop - 1.5 ||
            rect.bottom > contentBottom + 1.5;

          if (isOverflowing) {
            allWarnings.push({
              type: 'overflow',
              slide: slideIndex,
              tagName: el.tagName,
              text: item.text.substring(0, 30),
              selector: getUniqueSelector(el),
              bounds: `[L:${rect.left.toFixed(0)}, R:${rect.right.toFixed(0)}, T:${rect.top.toFixed(0)}, B:${rect.bottom.toFixed(0)}]`,
              contentBounds: `[L:${contentLeft.toFixed(0)}, R:${contentRight.toFixed(0)}, T:${contentTop.toFixed(0)}, B:${contentBottom.toFixed(0)}]`
            });
          }
        }

        // 3. Overlap Audits
        for (let j = 0; j < leafElements.length; j++) {
          for (let k = j + 1; k < leafElements.length; k++) {
            const itemA = leafElements[j];
            const itemB = leafElements[k];

            if (isDescendant(itemA.element, itemB.element) || isDescendant(itemB.element, itemA.element)) {
              continue; // Exclude direct parent-child overlap
            }

            const rA = itemA.rect;
            const rB = itemB.rect;

            const isOverlapping =
              rA.left < rB.right &&
              rA.right > rB.left &&
              rA.top < rB.bottom &&
              rA.bottom > rB.top;

            if (isOverlapping) {
              // Calculate overlapping area to ignore tiny bounding box intersections (e.g. borders, spacers)
              const overlapW = Math.min(rA.right, rB.right) - Math.max(rA.left, rB.left);
              const overlapH = Math.min(rA.bottom, rB.bottom) - Math.max(rA.top, rB.top);

              if (overlapW > 2 && overlapH > 2) {
                allWarnings.push({
                  type: 'overlap',
                  slide: slideIndex,
                  elementA: { tagName: itemA.tagName, selector: getUniqueSelector(itemA.element), text: itemA.text.substring(0, 15) },
                  elementB: { tagName: itemB.tagName, selector: getUniqueSelector(itemB.element), text: itemB.text.substring(0, 15) }
                });
              }
            }
          }
        }
      }

      return { warnings: allWarnings };
    });

    if (results.error) {
      console.error(`\x1b[31mAudit Failed: ${results.error}\x1b[0m`);
      exitCode = 1;
      return;
    }

    const warnings = results.warnings || [];
    if (warnings.length === 0) {
      console.log('\x1b[32m✔ All slides passed! No contrast, overflow, or overlap issues detected.\x1b[0m\n');
      exitCode = 0;
      return;
    }

    console.log(`\x1b[31m❌ Found ${warnings.length} audit violations:\x1b[0m\n`);

    warnings.forEach((warn, idx) => {
      const prefix = `\x1b[33m[Violation #${idx + 1}]\x1b[0m`;
      if (warn.type === 'contrast') {
        console.error(`${prefix} Slide ${warn.slide} | Contrast Issue`);
        console.error("  - Element:  <" + warn.tagName.toLowerCase() + "> inside selector \x1b[90m" + warn.selector + "\x1b[0m");
        console.error("  - Content:  \"" + warn.text + "\"");
        console.error("  - Colors:   Text: " + warn.fgStyle + " | Bg: " + warn.bgStyle);
        console.error("  - Font:     Size: " + warn.sizeStyle + " | Weight: " + warn.weightStyle);
        console.error("  - Ratio:    \x1b[31m" + warn.ratio + ":1\x1b[0m (Required: " + warn.required + ":1)\n");
      } else if (warn.type === 'overflow') {
        console.error(`${prefix} Slide ${warn.slide} | Content Overflow`);
        console.error(`  - Element:  <${warn.tagName.toLowerCase()}> inside selector \x1b[90m${warn.selector}\x1b[0m`);
        console.error(`  - Content:  "${warn.text}"`);
        console.error(`  - Position: Element bounds ${warn.bounds} vs Content bounds ${warn.contentBounds}\n`);
      } else if (warn.type === 'overlap') {
        console.error(`${prefix} Slide ${warn.slide} | Element Overlap`);
        console.error(`  - Node A:   <${warn.elementA.tagName.toLowerCase()}> [${warn.elementA.text}] in \x1b[90m${warn.elementA.selector}\x1b[0m`);
        console.error(`  - Node B:   <${warn.elementB.tagName.toLowerCase()}> [${warn.elementB.text}] in \x1b[90m${warn.elementB.selector}\x1b[0m\n`);
      }
    });

    exitCode = 1;

  } catch (err) {
    console.error('\x1b[31mFatal execution error during slide audit:\x1b[0m', err);
    exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    process.exitCode = exitCode;
  }
})();

