import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const externalBaseUrl = process.env.E2E_BASE_URL;
const baseURL = externalBaseUrl ?? `http://localhost:${PORT}`;
const skipBuild = process.env.E2E_SKIP_BUILD === '1';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './test/e2e',
  // The specs call the real database through the API: a slow network or a cold database multiplies
  // the latency several times, so the limits leave room for that without hiding a hung request.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: skipBuild ? `pnpm start -p ${PORT}` : `pnpm build && pnpm start -p ${PORT}`,
        url: `http://localhost:${PORT}/robots.txt`,
        timeout: 300_000,
        reuseExistingServer: !isCI,
        stdout: 'pipe',
        stderr: 'pipe',
        env: { NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
      },
});
