import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Selora|Mihály Győri/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Click the get started link (or any interactive element).
  // await page.getByRole('link', { name: 'Projects' }).first().click();

  // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
});
