// This file defines the RegistrationPage class, 
// which provides methods for interacting with the registration 
// page of the application. It includes methods for filling out the 
// registration form, checking for validation errors, and submitting the form.

import { Page, Locator, expect } from '@playwright/test';

interface RegistrationData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegistrationPage {
  private page: Page;

  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
    this.registerButton = page.locator('.modal-footer button', { hasText: 'Register' });
  }

  async fillName(value: string): Promise<void> {
    await this.nameInput.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  async fillRepeatPassword(value: string): Promise<void> {
    await this.repeatPasswordInput.fill(value);
    await this.repeatPasswordInput.press('Tab');
  }

  async fillValidForm(data: RegistrationData): Promise<void> {
    await this.fillName(data.name);
    await this.fillLastName(data.lastName);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillRepeatPassword(data.password);
  }

  async expectFieldError(field: Locator, text: RegExp): Promise<void> {
    await expect(
      field.locator('..').locator('.invalid-feedback')
    ).toHaveText(text);
  }

  async expectRegisterEnabled(): Promise<void> {
    await expect(this.registerButton).toBeEnabled();
  }

  async expectRegisterDisabled(): Promise<void> {
    await expect(this.registerButton).toBeDisabled();
  }

  async submit(): Promise<void> {
    await this.registerButton.click();
  }
}
