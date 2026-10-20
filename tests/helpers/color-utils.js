/**
 * WCAG 2.1 Color and Contrast Utility Functions
 */

/**
 * Computes relative luminance of an sRGB color per WCAG 2.1
 * @param {{ r: number, g: number, b: number }} rgb - 0-255 channels
 * @returns {number} Relative luminance in [0, 1]
 */
export function getLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * Computes WCAG 2.1 contrast ratio between two colors
 * Handles alpha blending of foreground over background, and background over canvas.
 * @param {{ r: number, g: number, b: number, a?: number }} fg
 * @param {{ r: number, g: number, b: number, a?: number }} bg
 * @param {{ r: number, g: number, b: number, a?: number }} [canvasBg={ r: 255, g: 255, b: 255, a: 1.0 }]
 * @returns {number} Contrast ratio (e.g. 4.5 for 4.5:1)
 */
export function getContrastRatio(fg, bg, canvasBg = { r: 255, g: 255, b: 255, a: 1.0 }) {
  const bgAlpha = bg.a !== undefined ? bg.a : 1.0;
  const compositeBg = bgAlpha < 1
    ? {
        r: Math.round(bg.r * bgAlpha + canvasBg.r * (1 - bgAlpha)),
        g: Math.round(bg.g * bgAlpha + canvasBg.g * (1 - bgAlpha)),
        b: Math.round(bg.b * bgAlpha + canvasBg.b * (1 - bgAlpha)),
        a: 1.0,
      }
    : bg;

  const fgAlpha = fg.a !== undefined ? fg.a : 1.0;
  const compositeFg = fgAlpha < 1
    ? {
        r: Math.round(fg.r * fgAlpha + compositeBg.r * (1 - fgAlpha)),
        g: Math.round(fg.g * fgAlpha + compositeBg.g * (1 - fgAlpha)),
        b: Math.round(fg.b * fgAlpha + compositeBg.b * (1 - fgAlpha)),
        a: 1.0,
      }
    : fg;

  const l1 = getLuminance(compositeFg);
  const l2 = getLuminance(compositeBg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color is transparent
 * @param {{ a?: number } | string} color
 * @returns {boolean}
 */
export function isTransparent(color) {
  if (typeof color === 'string') {
    return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
  }
  if (color && color.a !== undefined) {
    return color.a === 0;
  }
  return false;
}

/**
 * Client-side script string to be injected into page context for exact canvas color normalization
 */
export const BROWSER_COLOR_HELPERS = `
  window.__hdTest = window.__hdTest || {};

  window.__hdTest.parseColor = function(colorStr) {
    if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3] / 255
    };
  };

  window.__hdTest.getEffectiveBackground = function(element) {
    let current = element;
    const colors = [];

    while (current && current !== document.documentElement) {
      const style = window.getComputedStyle(current);
      let bgStr = style.backgroundColor;
      if (!bgStr || bgStr === 'rgba(0, 0, 0, 0)' || bgStr === 'transparent') {
        const bgImg = style.backgroundImage;
        if (bgImg && bgImg !== 'none') {
          const m = bgImg.match(/(rgba?\\(.*?\\)|#[0-9a-fA-F]{3,8})/);
          if (m) bgStr = m[1];
        }
      }

      const color = window.__hdTest.parseColor(bgStr);
      if (color.a > 0) {
        colors.push(color);
        if (color.a === 1.0) break;
      }

      if (current.assignedSlot) {
        current = current.assignedSlot.parentElement || (current.assignedSlot.getRootNode && current.assignedSlot.getRootNode().host);
      } else {
        current = current.parentElement || (current.getRootNode && current.getRootNode().host);
      }
    }

    // Blend over white default canvas
    let res = { r: 255, g: 255, b: 255, a: 1.0 };
    for (let i = colors.length - 1; i >= 0; i--) {
      const c = colors[i];
      res = {
        r: Math.round(c.r * c.a + res.r * (1 - c.a)),
        g: Math.round(c.g * c.a + res.g * (1 - c.a)),
        b: Math.round(c.b * c.a + res.b * (1 - c.a)),
        a: 1.0
      };
    }
    return res;
  };
`;
