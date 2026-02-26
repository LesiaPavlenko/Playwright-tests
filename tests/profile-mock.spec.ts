import { test, expect } from '../fixtures/userGarageFixture';

test('Mock user profile response', async ({ page }) => {

  await page.route('**/api/users/profile', async (route) => {
    await route.fulfill({
      json: {
        status: 'ok',
        data: {
          userId: 1,
          photoFilename: null,
          name: 'Mocked',
          lastName: 'User',
        },
      },
    });
  });

  await page.goto('/panel/profile');

  await expect(page.getByText('Mocked User')).toBeVisible();

  await page.screenshot({ path: 'mocked-profile.png', fullPage: true });
});