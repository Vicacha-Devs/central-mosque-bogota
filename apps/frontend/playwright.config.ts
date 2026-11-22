import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.MOSQUE_FRONTEND_URL || "http://127.0.0.1:4321";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: process.env.MOSQUE_FRONTEND_URL
    ? undefined
    : {
        command: "pnpm astro preview --host 127.0.0.1 --port 4321",
        url: "http://127.0.0.1:4321/es",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
