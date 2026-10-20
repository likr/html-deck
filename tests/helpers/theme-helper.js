import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootDir = path.resolve(__dirname, '../..');

export const THEMES = [
  { name: 'default', file: null },
  { name: 'dark', file: 'packages/html-deck/src/themes/html-deck.theme-dark.css' },
  { name: 'warm', file: 'packages/html-deck/src/themes/html-deck.theme-warm.css' },
  { name: 'corporate', file: 'packages/html-deck/src/themes/html-deck.theme-corporate.css' },
  { name: 'neon', file: 'packages/html-deck/src/themes/html-deck.theme-neon.css' },
  { name: 'serif', file: 'packages/html-deck/src/themes/html-deck.theme-serif.css' },
  { name: 'dotted', file: 'packages/html-deck/src/themes/html-deck.theme-dotted.css' },
  { name: 'nouveau', file: 'packages/html-deck/src/themes/html-deck.theme-nouveau.css' },
];

/**
 * Loads and applies one of the 8 themes to the page
 * @param {import('@playwright/test').Page} page
 * @param {string} themeName
 */
export async function applyTheme(page, themeName) {
  const theme = THEMES.find((t) => t.name === themeName);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeName}`);
  }

  let cssContent = '';
  if (theme.file) {
    const fullPath = path.resolve(rootDir, theme.file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Theme file not found: ${fullPath}`);
    }
    cssContent = fs.readFileSync(fullPath, 'utf8');
  }

  await page.evaluate(({ css, name }) => {
    // 1. Remove any legacy or interfering stylesheets (e.g. theme-test.css)
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    for (const el of links) {
      if (el.id === 'hd-global-styles' || el.id === 'hd-test-active-theme' || el.id === 'hd-test-color-helpers') {
        continue;
      }
      const viteId = el.getAttribute('data-vite-dev-id') || '';
      if (
        (el.href && el.href.includes('theme-test')) ||
        viteId.includes('theme-test') ||
        (el.textContent && (
          el.textContent.includes('--hd-base-soft-background-color') ||
          el.textContent.includes('--hd-base-soft-body-background-color')
        ))
      ) {
        el.remove();
      }
    }

    // 2. Inject or update active theme style tag
    let styleEl = document.getElementById('hd-test-active-theme');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'hd-test-active-theme';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css || '';
    document.documentElement.setAttribute('data-test-theme', name);
  }, { css: cssContent, name: themeName });

  // Brief pause to allow browser style recalculation
  await page.waitForTimeout(50);
}
