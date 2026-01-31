import { test, expect } from '@playwright/test';

test.describe('Instance navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Adjust this to your real login flow or provide a test-only endpoint
    await page.goto('/login');
    // TODO: replace selectors with actual login form
    await page.fill('input[name="email"]', 'webmaster@farutech.com');
    await page.fill('input[name="password"]', 'Holamundo1*');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/);
  });

  test('navigates from select-instance to tenant app', async ({ page }) => {
    await page.goto('/select-instance');

    // Click first instance card (selector may vary)
    const card = page.locator('[data-testid="instance-card"]').first();
    await expect(card).toBeVisible();
    await card.click();

    // Expect redirect to subdomain-like url or local dev url
    await page.waitForLoadState('load');
    const href = page.url();
    expect(href).toMatch(/(localhost|app|\.app\.)/);
  });
});
