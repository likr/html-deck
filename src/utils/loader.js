// Loader utility for local vendor assets
// Resolves files relative to the library root using import.meta.url

const libBaseUrl = new URL('../../', import.meta.url).href;

const loadedScripts = new Map();
const fetchedCSS = new Map();

/**
 * Dynamically loads a JS script into the global document.head if not already loaded.
 * @param {string} path - Path relative to the library root (e.g., 'vendor/prismjs/prism.js')
 * @returns {Promise<void>} Resolves when the script has loaded
 */
export function loadScript(path) {
  const url = new URL(path, libBaseUrl).href;
  if (loadedScripts.has(url)) {
    return loadedScripts.get(url);
  }

  const promise = new Promise((resolve, reject) => {
    // Check if script tag already exists in document
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    });
    script.addEventListener('error', reject);
    document.head.appendChild(script);
  });

  loadedScripts.set(url, promise);
  return promise;
}

/**
 * Dynamically injects a CSS stylesheet into the global document.head if not already loaded.
 * Essential for @font-face rules which must be defined in the global scope.
 * @param {string} path - Path relative to the library root
 * @returns {Promise<void>} Resolves when the stylesheet has loaded
 */
export function loadGlobalCSS(path) {
  const url = new URL(path, libBaseUrl).href;
  const linkId = `global-css-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  if (document.getElementById(linkId)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', resolve);
    link.addEventListener('error', reject);
    document.head.appendChild(link);
  });
}

/**
 * Fetches CSS file content as text, useful for injecting inside Shadow DOM style tags.
 * Cache results to avoid double fetching.
 * @param {string} path - Path relative to the library root
 * @returns {Promise<string>} CSS content string
 */
export async function fetchCSS(path) {
  const url = new URL(path, libBaseUrl).href;
  if (fetchedCSS.has(url)) {
    return fetchedCSS.get(url);
  }

  const promise = (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSS from ${url}: ${response.statusText}`);
    }
    return await response.text();
  })();

  fetchedCSS.set(url, promise);
  return promise;
}
