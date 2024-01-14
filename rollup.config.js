import {rollupPluginHTML as html} from '@web/rollup-plugin-html';
import {copy} from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: 'www/index.html',
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify JS
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
    }),
    // Optional: copy any static assets to build directory
    copy({
      patterns: ['robots.txt'],
      rootDir: './www',
    }),
  ],
  output: {
    dir: 'dist',
    sourcemap: true,
  },
  preserveEntrySignatures: 'strict',
};
