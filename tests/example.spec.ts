import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('renders English and switches to Hungarian', async ({ page }) => {
  await page.goto('/en');

  await expect(page).toHaveTitle(/Selora|Mihály Győri|Mihaly Gyori/);
  await expect(page.getByText("Savy's Tips").first()).toBeVisible();
  await expect(page.getByText('Selected').first()).toBeVisible();

  await page.getByRole('button', { name: /switch to hungarian/i }).first().click();
  await expect(page).toHaveURL(/\/hu\/?$/);
  await expect(page.getByText('Kiemelt').first()).toBeVisible();
  await expect(page.getByText('Lépjünk').first()).toBeVisible();
});

test('navbar anchors and showcase filters work', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: 'Projects' }).click();
  await expect(page.locator('#projects')).toBeInViewport();

  await page.getByRole('button', { name: 'Study' }).click();
  await expect(page.getByText('ELTE University')).toBeVisible();
  await expect(page.getByText('Footify Landing Page')).toHaveCount(0);

  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByText("Savy's Tips").first()).toBeVisible();
});

test('contact form reports missing email configuration safely', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: 'Contact' }).click();
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Testing the contact form configuration state.');
  await page.getByRole('button', { name: 'Send Message' }).click();

  await expect(page.getByText('Email is not configured yet')).toBeVisible();
});

test('mobile layout keeps core content visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hu');

  await expect(page.getByText('GYŐRI MIHÁLY', { exact: true })).toBeVisible();
  await expect(page.getByText("Savy's Tips").first()).toBeVisible();
  await expect(page.getByRole('button', { name: /váltás erre: angol/i }).first()).toBeVisible();
});
