import { defineConfig, devices } from '@playwright/test';

const PORT = 3011;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['html', { outputFolder: 'output/playwright/report' }]],
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx next dev --turbopack --port ${PORT}`,
    url: `${BASE_URL}/signature`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
