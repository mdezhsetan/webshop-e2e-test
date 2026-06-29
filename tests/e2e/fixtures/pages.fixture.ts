import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { SearchPage } from '../pages/SearchPage';

// Page objects exposed as fixtures so specs read as user journeys without the
// `new XPage(page)` boilerplate at the top of every test. Each is created
// lazily, so a spec only pays for the pages it actually uses.
type Pages = {
  loginPage: LoginPage;
  searchPage: SearchPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

export const pomTest = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
