import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "../packages/app/tests/e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://web",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        ...devices["Desktop Chrome"],
    },
});
