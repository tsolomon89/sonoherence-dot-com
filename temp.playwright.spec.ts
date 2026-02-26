import { test } from '@playwright/test';

test('log console', async ({ page }) => {
  page.on('console', (msg) => console.log('CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR', err.message));
  await page.goto('http://127.0.0.1:3141/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
});