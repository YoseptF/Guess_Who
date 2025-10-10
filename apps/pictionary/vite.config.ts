/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/pictionary',

  server: {
    port: 4400,
    host: 'localhost',
  },

  preview: {
    port: 4500,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared-ui': path.resolve(__dirname, '../../libs/shared-ui/src/index.ts'),
      'game-utils': path.resolve(
        __dirname,
        '../../libs/game-utils/src/index.ts',
      ),
    },
  },

  build: {
    outDir: '../../dist/apps/pictionary',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
