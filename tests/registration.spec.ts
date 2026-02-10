import { test, expect } from '@playwright/test';

function generateEmail() {
  return `aqa-${Date.now()}@test.com`;
}

test.describe('Registration form validation', () => {
  test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // wait for all network requests to finish
  await page.waitForLoadState('networkidle');
  // Click Sign In button by role
  const signInBtn = page.getByRole('button', { name: 'Sign In' });
  await expect(signInBtn).toBeVisible();
  await signInBtn.click({ force: true });
  // wait for the registration button to be visible and click it
  const registrationBtn = page.getByRole('button', { name: 'Registration' });
  await expect(registrationBtn).toBeVisible({ timeout: 10000 });
  await registrationBtn.click({ force: true });
  // check that the registration modal is visible
  await expect(
    page.getByRole('heading', { name: 'Registration' })
  ).toBeVisible({ timeout: 10000 });
});

  // Empty form validation
  test('All fields empty - errors and button disabled', async ({ page }) => {

    const name = page.locator('#signupName');
    const lastName = page.locator('#signupLastName');
    const email = page.locator('#signupEmail');
    const password = page.locator('#signupPassword');
    const repeatPassword = page.locator('#signupRepeatPassword');
    const registerBtn = page.locator('.modal-footer button', { hasText: 'Register' });

    await name.click();
    await lastName.click();
    await email.click();
    await password.click();
    await repeatPassword.click();

    // blur to be stable, because of async validation
    await repeatPassword.press('Tab');
    await expect(name.locator('..').locator('.invalid-feedback'))
      .toHaveText(/name required/i);

    await expect(registerBtn).toBeDisabled();
  });

  // Name validation
  test('Name invalid symbols', async ({ page }) => {
    const name = page.locator('#signupName');

    await name.fill('12@');
    await name.press('Tab');

    await expect(name.locator('..').locator('.invalid-feedback'))
      .toHaveText(/name is invalid/i);
  });

  test('Name too short', async ({ page }) => {
    const name = page.locator('#signupName');

    await name.fill('A');
    await name.press('Tab');

    await expect(name.locator('..').locator('.invalid-feedback'))
      .toHaveText(/2 to 20 characters/i);
  });

  test('Name more than 20 characters', async ({ page }) => {
    const name = page.locator('#signupName');

    await name.fill('A'.repeat(21));
    await name.press('Tab');

    await expect(name.locator('..').locator('.invalid-feedback'))
      .toHaveText(/2 to 20 characters/i);
  });

  // Email validation
  test('Email invalid format', async ({ page }) => {
    const email = page.locator('#signupEmail');

    await email.fill('test@@mail');
    await email.press('Tab');

    await expect(email.locator('..').locator('.invalid-feedback'))
      .toHaveText(/email is incorrect/i);
  });

  // Password validation
  test('Password invalid rules', async ({ page }) => {
    const password = page.locator('#signupPassword');

    await password.fill('abcdefg');
    await password.press('Tab');

    await expect(password.locator('..').locator('.invalid-feedback'))
      .toContainText(/8 to 15 characters/i);
  });

  test('Passwords do not match', async ({ page }) => {
    const password = page.locator('#signupPassword');
    const repeatPassword = page.locator('#signupRepeatPassword');

    await password.fill('Qwerty1a');
    await repeatPassword.fill('Qwerty2a');
    await repeatPassword.press('Tab');

    await expect(repeatPassword.locator('..').locator('.invalid-feedback'))
      .toHaveText(/passwords do not match/i);
  });

  // Button is enabled when form valid
  test('Register button enabled when form valid', async ({ page }) => {

    const registerBtn = page.locator('.modal-footer button', { hasText: 'Register' });

    await page.locator('#signupName').fill('Anna');
    await page.locator('#signupLastName').fill('Smith');
    await page.locator('#signupEmail').fill(generateEmail());
    await page.locator('#signupPassword').fill('Qwerty1a');
    await page.locator('#signupRepeatPassword').fill('Qwerty1a');

    await page.locator('#signupRepeatPassword').press('Tab');

    await expect(registerBtn).toBeEnabled();
  });

});

// POSITIVE test case for successful registration
test('Positive: user can successfully register', async ({ page }) => {

  const email = generateEmail();
  const password = 'Qwerty1a';
  await page.goto('/');
  await page.locator('.header_signin').click();

  const registrationBtn = page.locator('button.btn-link', { hasText: 'Registration' });
  await expect(registrationBtn).toBeVisible();
  await registrationBtn.click({ force: true });

  await page.locator('#signupName').fill('Lesia');
  await page.locator('#signupLastName').fill('Pavlenko');
  await page.locator('#signupEmail').fill(email);
  await page.locator('#signupPassword').fill(password);
  await page.locator('#signupRepeatPassword').fill(password);
  await page.locator('#signupRepeatPassword').press('Tab');
  const registerButton = page.locator('.modal-footer button', { hasText: 'Register' });
  await expect(registerButton).toBeEnabled();
  await registerButton.click();

  await expect(page).toHaveURL(/panel/);
  await expect(page.locator('#userNavDropdown')).toBeVisible();
});
