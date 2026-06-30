#!/usr/bin/env node

import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('\x1b[31mError: Please specify the target slideshow URL.\x1b[0m');
  console.error('Usage: npx html-deck-audit <url>');
  console.error('Example: npx html-deck-audit http://localhost:5173/slides/ramen/index.html');
  process.exit(1);
}

(async () => {
  console.log(`\n\x1b[36m⚡ Starting Slide Audit on: ${url}\x1b[0m\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Forward browser console logs and errors to terminal
  page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[Browser PageError] ${err.message}`));

  try {
    await page.goto(url, { waitUntil: 'load' });
    
    console.log(`Page Loaded. Title: "${await page.title()}"`);
    const bodyText = await page.content();
    console.log(`Page body preview (first 500 chars):\n${bodyText.substring(0, 500)}`);
    
    // Wait for the custom element <hd-deck> to load and mount in the DOM
    await page.waitForSelector('hd-deck', { state: 'attached', timeout: 5000 });

    // Run the audit process in the page context
    const results = await page.evaluate(async () => {
      const deck = document.querySelector('hd-deck');
      if (!deck) {
        return { error: 'Could not find <hd-deck> element on the page.' };
      }

      // Ensure slides are initialized
      if (!deck.slides || deck.slides.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const slideCount = deck.slides ? deck.slides.length : 0;
      if (slideCount === 0) {
        return { error: 'No slides (<hd-slide>) found inside <hd-deck>.' };
      }

      const allWarnings = [];

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

      // Helper: Generate clean selectors for reports
      function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
          let selector = el.nodeName.toLowerCase();
          if (el.className) {
            const classes = el.className.trim().split(/\s+/).filter(c => c && !c.startsWith('hd-'));
            if (classes.length) {
              selector += '.' + classes[0]; // grab primary class
            }
          }
          path.unshift(selector);
          el = el.parentElement || (el.getRootNode && el.getRootNode().host);
        }
        return path.slice(-3).join(' > '); // return last 3 ancestors for clarity
      }

      // Helper: Color parsing for rgb/rgba
      function parseColor(colorStr) {
        if (colorStr.startsWith('rgb')) {
          const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            return {
              r: parseInt(match[1], 10),
              g: parseInt(match[2], 10),
              b: parseInt(match[3], 10),
              a: match[4] !== undefined ? parseFloat(match[4]) : 1.0
            };
          }
        }
        return { r: 0, g: 0, b: 0, a: 1.0 }; // Fallback black
      }

      // Helper: Traverse upward to calculate effective background color (handling alphas and slotted elements)
      function getEffectiveBackgroundColor(element) {
        let current = element;
        const colors = [];

        while (current && current !== document.documentElement) {
          const style = window.getComputedStyle(current);
          const bg = parseColor(style.backgroundColor);

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
        // Wait 150ms for transition styles and layout computations to resolve
        await new Promise(resolve => setTimeout(resolve, 150));

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

          const l1 = getLuminance(fgColor);
          const l2 = getLuminance(bgColor);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

          const size = parseFloat(style.fontSize);
          const isBold = style.fontWeight === 'bold' || parseInt(style.fontWeight, 10) >= 600;
          const isLarge = (size >= 18.6 && isBold) || (size >= 24);
          const minRatio = isLarge ? 3.0 : 4.5;

          if (ratio < minRatio) {
            allWarnings.push({
              type: 'contrast',
              slide: slideIndex,
              tagName: el.tagName,
              text: item.text.substring(0, 30),
              ratio: ratio.toFixed(2),
              required: minRatio,
              selector: getUniqueSelector(el),
              fgStyle: `rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b})`,
              bgStyle: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
              sizeStyle: style.fontSize,
              weightStyle: style.fontWeight
            });
          }
        }

        // 2. Overflow Audits
        const style = window.getComputedStyle(activeSlide);
        const parsePx = (val) => {
          if (!val) return 0;
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        };
        const marginTop = parsePx(style.getPropertyValue('--hd-slide-margin-top') || style.marginTop);
        const marginRight = parsePx(style.getPropertyValue('--hd-slide-margin-right') || style.marginRight);
        const marginBottom = parsePx(style.getPropertyValue('--hd-slide-margin-bottom') || style.marginBottom);
        const marginLeft = parsePx(style.getPropertyValue('--hd-slide-margin-left') || style.marginLeft);

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
      process.exit(1);
    }

    const warnings = results.warnings || [];
    if (warnings.length === 0) {
      console.log('\x1b[32m✔ All slides passed! No contrast, overflow, or overlap issues detected.\x1b[0m\n');
      process.exit(0);
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

    process.exit(1);

  } catch (err) {
    console.error('\x1b[31mFatal execution error during slide audit:\x1b[0m', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
