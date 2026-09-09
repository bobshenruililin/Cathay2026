import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    viewport: { width: 1180, height: 820 },
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1180, height: 820 } } }],
  webServer: {
    command: "pnpm --filter console dev:e2e",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
