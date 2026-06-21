import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'html-deck': resolve(__dirname, 'src/html-deck.js'),
        'html-deck-presenter': resolve(__dirname, 'src/html-deck-presenter.js'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') return 'html-deck.css';
          return '[name].[ext]';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Disable asset inlining so css raw text imports work correctly
    assetsInlineLimit: 0,
  }
});
