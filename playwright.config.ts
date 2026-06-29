import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const host = process.env.E2E_BASE_URL ?? 'https://qa-task.demo.kramp.com';
const shop = process.env.E2E_SHOP ?? 'shop-nl';
const locale = process.env.E2E_LOCALE ?? 'nl';

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // A full journey on this slow, cross-domain demo (inline login + search +
  // checkout). Generous, but bounded well below an unresponsive hang.
  timeout: 60_000,
  // Default for assertions on already-loaded content; slow first-loads override
  // per call with TIMEOUTS.slowContent.
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `${host}/${shop}/${locale}/`,
    testIdAttribute: 'data-testid',
    // Bound page navigations (goto, waitForURL) on the slow demo instead of
    // letting them run all the way to the test timeout.
    navigationTimeout: 30_000,
    // Keep a trace whenever a test fails (locally there are no retries), so
    // failures on the slow, flaky demo can be inspected after the fact.
    trace: 'retain-on-failure',
    httpCredentials: {
      username: process.env.E2E_PLATFORM_USER ?? '',
      password: process.env.E2E_PLATFORM_PASSWORD ?? '',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
