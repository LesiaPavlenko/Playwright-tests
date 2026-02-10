// POM tests for registration form validation and successful registration. 
// The tests use the HomePage and RegistrationPage classes to interact with 
// the web application. The generateEmail function creates a unique email address 
// for each test run to avoid conflicts with existing users.

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';

function generateEmail(): string {
  return `aqa-${Date.now()}@test.com`;
}

test.describe('Registration form validation (POM)', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openHome();
    await homePage.openRegistration();
  });

  test('All fields empty - errors and button disabled', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.repeatPasswordInput.press('Tab');
    await registration.expectRegisterDisabled();
  });

  test('Name invalid symbols', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.fillName('12@');
    await registration.fillRepeatPassword('');

    await registration.expectFieldError(
      registration.nameInput,
      /name is invalid/i
    );
  });

  test('Name too short', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.fillName('A');
    await registration.fillRepeatPassword('');

    await registration.expectFieldError(
      registration.nameInput,
      /2 to 20 characters/i
    );
  });

  test('Name more than 20 characters', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.fillName('A'.repeat(21));
    await registration.fillRepeatPassword('');

    await registration.expectFieldError(
      registration.nameInput,
      /2 to 20 characters/i
    );
  });

  test('Email invalid format', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.fillEmail('test@@mail');
    await registration.fillRepeatPassword('');

    await registration.expectFieldError(
      registration.emailInput,
      /email is incorrect/i
    );
  });

  test('Password invalid rules', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.passwordInput.fill('abcdefg');
    await registration.fillRepeatPassword('');

    await registration.expectFieldError(
      registration.passwordInput,
      /8 to 15 characters/i
    );
  });

  test('Passwords do not match', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.passwordInput.fill('Qwerty1a');
    await registration.repeatPasswordInput.fill('Qwerty2a');
    await registration.repeatPasswordInput.press('Tab');

    await registration.expectFieldError(
      registration.repeatPasswordInput,
      /passwords do not match/i
    );
  });

  test('Register button enabled when form valid', async ({ page }) => {
    const registration = new RegistrationPage(page);

    await registration.fillValidForm({
      name: 'Anna',
      lastName: 'Smith',
      email: generateEmail(),
      password: 'Qwerty1a',
    });

    await registration.expectRegisterEnabled();
  });
});

test('Positive: user can successfully register (POM)', async ({ page }) => {
  const homePage = new HomePage(page);
  const registration = new RegistrationPage(page);

  await homePage.openHome();
  await homePage.openRegistration();

  await registration.fillValidForm({
    name: 'Lesia',
    lastName: 'Pavlenko',
    email: generateEmail(),
    password: 'Qwerty1a',
  });

  await registration.expectRegisterEnabled();
  await registration.submit();

  await expect(page).toHaveURL(/panel/);
});
