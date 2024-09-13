import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { builtinModules } from 'module';
import commonjs from 'vite-plugin-commonjs-externals';
import { devMainPlugin } from './build/plugins/vite-plugin-dev-main';

const commonjsPackages = [...builtinModules, 'electron', 'electron-log', 'lodash', 'electron-redux'];

export default defineConfig({
  root: path.resolve(__dirname, 'src/render'),
  base: './',
  envDir: './',
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    svgr(),
    commonjs({
      externals: commonjsPackages,
    }),
    devMainPlugin(),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
});
