import {defineConfig} from '@playwright/test';

export default defineConfig({
    timeout: 100000,
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {name: 'chromium', use: {browserName: 'chromium'}},
        {name: 'firefox', use: {browserName: 'firefox'}},
    ],
});
