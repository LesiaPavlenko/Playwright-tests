// This file defines the HomePage class, 
// which extends the BasePage class. 
// It includes methods for interacting with the home page of the 
// application, such as opening the page and clicking on the sign-in 
// and registration buttons.

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signInButton;
  readonly registrationButton;

  constructor(page: Page) {
    super(page);

    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.registrationButton = page.getByRole('button', { name: 'Registration' });
  }

  async openHome(): Promise<void> {
    await this.goto('/');
  }

  async openRegistration(): Promise<void> {
    await this.signInButton.click({ force: true });
    await this.registrationButton.click({ force: true });
  }
}
