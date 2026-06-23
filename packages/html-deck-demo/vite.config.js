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
        features: resolve(__dirname, 'demo/features/index.html'),
        presenter: resolve(__dirname, 'demo/features/presenter.html'),
      }
    }
  }
});
