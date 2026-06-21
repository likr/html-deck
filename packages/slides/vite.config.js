import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

// Helper to find all slide decks and their presenters dynamically
const getSlideInputs = () => {
  const inputs = {
    main: resolve(__dirname, 'index.html'),
  };

  const slidesDir = resolve(__dirname, 'slides');
  if (fs.existsSync(slidesDir)) {
    const items = fs.readdirSync(slidesDir);
    for (const item of items) {
      const itemPath = join(slidesDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const indexPath = join(itemPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          inputs[item] = indexPath;
        }
        const presenterPath = join(itemPath, 'presenter.html');
        if (fs.existsSync(presenterPath)) {
          inputs[`${item}-presenter`] = presenterPath;
        }
      }
    }
  }

  return inputs;
};

export default defineConfig({
  optimizeDeps: {
    exclude: ['html-deck']
  },
  build: {
    rollupOptions: {
      input: getSlideInputs()
    }
  }
});
