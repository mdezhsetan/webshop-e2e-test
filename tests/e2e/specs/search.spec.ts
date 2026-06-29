import { pomTest as test } from '../fixtures/pages.fixture';
import { validUser } from '../test-data/login.data';
import { products } from '../test-data/search.data';

test.describe('Product search', { tag: ['@regression', '@search'] }, () => {
  test('user can search for a product and open its detail page', async ({
    loginPage,
    searchPage,
    productPage,
  }) => {
    const product = products.filterElement;

    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await loginPage.expectLoggedIn();

    await searchPage.search(product.searchTerm);
    await searchPage.openFirstProduct();

    await productPage.expectLoaded();
    await productPage.expectItemNumber(product.itemNumber);
  });
});
