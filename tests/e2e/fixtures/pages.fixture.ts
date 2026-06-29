import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Page objects exposed as fixtures so specs read as user journeys without the
// `new XPage(page)` boilerplate at the top of every test. Each is created
// lazily, so a spec only pays for the pages it actually uses.
type Pages = {
  loginPage: LoginPage;
};

export const pomTest = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
