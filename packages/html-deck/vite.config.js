import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/themes/*',
          dest: 'themes'
        }
      ]
    })
  ],
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
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Prevent font files from being inlined as base64 into CSS;
    // they are served as separate files from dist/fonts/ instead.
    assetsInlineLimit: 0,
  },
});
