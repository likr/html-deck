import { defineConfig, devices } from '@playwright/test';
import { execFileSync } from 'child_process';

function resolveDemoPort() {
  if (process.env.PORT) return Number(process.env.PORT);
  try {
    const out = execFileSync(
      process.execPath,
      [
        '-e',
        `const http = require('http');
         let written = false;
         function done(p) {
           if (!written) {
             written = true;
             process.stdout.write(p);
             process.exit(0);
           }
         }
         const req = http.get('http://127.0.0.1:5173/demo/variant-test/index.html', { timeout: 1000 }, (res) => {
           let b = '';
           res.on('data', (c) => b += c);
           res.on('end', () => {
             done(b.includes('<hd-deck') ? '5173' : '5175');
           });
         });
         req.on('error', () => done('5173'));
         req.on('timeout', () => { req.destroy(); done('5173'); });`,
      ],
      { encoding: 'utf8', timeout: 2000 }
    ).trim();
    return Number(out) || 5173;
  } catch {
    return 5173;
  }
}

const PORT = resolveDemoPort();

/**
 * Playwright configuration for html-deck verification suite
 * Requirement R5: automated E2E tests running headless Chromium on http://127.0.0.1:5173 (or 5175 if 5173 is occupied by slides)
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: `npm run dev -w html-deck-demo -- --port ${PORT} --host 127.0.0.1 --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
