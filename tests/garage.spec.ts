import { test, expect } from '../fixtures/userGarageFixture';

test('User can open Garage page using fixture', async ({ userGaragePage }) => {
  await userGaragePage.expectOpened();
});
