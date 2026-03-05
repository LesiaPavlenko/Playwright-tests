import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  workers: 2,

  use: {
    baseURL: process.env.BASE_URL,

    httpCredentials: {
      username: process.env.BASIC_AUTH_USER,
      password: process.env.BASIC_AUTH_PASSWORD,
    },

    headless: true, // ✅ потрібно для Docker / CI

    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 30000,

    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.spec\.ts/,
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
        storageState: 'storageState.json',
      },
      dependencies: ['setup'],
    }
  ],
});