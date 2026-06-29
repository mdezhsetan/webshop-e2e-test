import { pomTest as test } from '../fixtures/pages.fixture';
import { validUser } from '../test-data/login.data';
import { products } from '../test-data/search.data';

test.describe('Full flow', { tag: ['@critical', '@checkout'] }, () => {
  test('user can log in, search, add to cart, checkout, and receive order confirmation', async ({
    loginPage,
    searchPage,
    productPage,
    cartPage,
    checkoutPage,
    orderConfirmationPage,
  }) => {
    const product = products.filterElement;

    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await loginPage.expectLoggedIn();

    await searchPage.search(product.searchTerm);
    await searchPage.openFirstProduct();
    await productPage.expectLoaded();
    await productPage.addToCart();

    // The header cart counter is intentionally not asserted: re-adding a product
    // that is already in the cart shows it as a separate quotation line rather
    // than dependably bumping the counter, so a count increase is not a reliable
    // "was it added" signal. The cart is verified directly instead — and is not
    // pre-emptied, since submitting only needs at least one item present.
    await cartPage.goto();
    await cartPage.expectLoaded();
    await cartPage.expectItemVisible(product.itemNumber);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectLoaded();
    await checkoutPage.selectDeliveryMethod();
    // The assignment's "select invoice payment" step has no UI in this build: the
    // B2B account is invoiced by default and checkout exposes no payment
    // control (see test-data/checkout.data.ts). The journey is therefore
    // validated through to the order confirmation page.
    await checkoutPage.submitOrder();

    await orderConfirmationPage.expectOrderPlaced();
  });
});
