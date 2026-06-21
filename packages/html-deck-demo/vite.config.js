import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  optimizeDeps: {
    exclude: ['html-deck']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'features-test': resolve(__dirname, 'demo/features-test/index.html'),
        'theme-test': resolve(__dirname, 'demo/theme-test/index.html'),
        'theme-test-invert': resolve(__dirname, 'demo/theme-test/invert-example.html'),
        'tutorial': resolve(__dirname, 'demo/tutorial/index.html'),
        'presenter': resolve(__dirname, 'demo/tutorial/presenter.html'),
        'split-layout': resolve(__dirname, 'demo/tutorial/split-layout-example.html'),
      }
    }
  }
});
