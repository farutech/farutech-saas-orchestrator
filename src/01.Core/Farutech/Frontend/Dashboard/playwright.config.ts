import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
// Load test env (overrides process.env)
dotenv.config({ path: process.cwd() + '/src/01.Core/Farutech/Frontend/Dashboard/.env.playwright' });

export default defineConfig({
  testDir: 'src/01.Core/Farutech/Frontend/Dashboard/e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${process.env.VITE_APP_PORT || '5173'}`,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry'
  }
});
