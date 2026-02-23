import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('authenticate user', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.locator('#signinEmail').fill(process.env.USER_EMAIL!);
  await page.locator('#signinPassword').fill(process.env.USER_PASSWORD!);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/panel/);

  await page.context().storageState({ path: 'storageState.json' });
});

