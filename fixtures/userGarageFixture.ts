import { test as base } from '@playwright/test';
import { GaragePage } from '../pages/GaragePage';


type MyFixtures = {
  userGaragePage: GaragePage;
};

export const test = base.extend<MyFixtures>({
  userGaragePage: async ({ page }, use) => {
    const garagePage = new GaragePage(page);
    await garagePage.open();
    await use(garagePage);
  },
});

export { expect } from '@playwright/test';
