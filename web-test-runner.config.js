import {playwrightLauncher} from '@web/test-runner-playwright';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const browsers = {
  chromium: playwrightLauncher({product: 'chromium'}),
  firefox: playwrightLauncher({product: 'firefox'}),
  webkit: playwrightLauncher({product: 'webkit'}),
};

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  rootDir: '.',
  files: ['./build/**/*_test.js'],
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  browsers: Object.values(browsers),
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: 'tdd',
      timeout: '60000',
    },
  },
};
