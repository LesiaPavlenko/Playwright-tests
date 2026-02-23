import { Page, Locator, expect } from '@playwright/test';

export class GaragePage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'Garage' });
  }

  async open(): Promise<void> {
    await this.page.goto(`${process.env.BASE_URL}/panel/garage`);
  }

  async expectOpened(): Promise<void> {
    await expect(this.title).toBeVisible();
  }
}
