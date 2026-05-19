// @ts-check
const { defineConfig, devices } = require('@playwright/experimental-ct-react');
const { resolve } = require('path');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/component_unit',
  /* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
  snapshotDir: './__snapshots__',
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,

    ctViteConfig: {
      plugins: [
        // Stub out SVG ?react imports — icons don't need to render in unit tests
        {
          name: 'svg-stub',
          enforce: 'pre',
          load(id) {
            if (id.match(/\.svg(\?react)?$/)) {
              return 'import React from "react"; export default (props) => null;';
            }
          },
        },
      ],
      resolve: {
        alias: [
          // Mirror the @/ alias that WXT adds automatically (points to srcDir)
          { find: /^@\//, replacement: resolve(__dirname, 'src') + '/' },
          { find: '@Shared', replacement: resolve(__dirname, 'src/components/Shared') },
          { find: '@workers', replacement: resolve(__dirname, 'src/workers') },
        ],
      },
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
