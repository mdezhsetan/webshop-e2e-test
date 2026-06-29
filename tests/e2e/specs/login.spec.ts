import { pomTest as test } from '../fixtures/pages.fixture';
import { validUser, invalidUser } from '../test-data/login.data';

test.describe('Login', { tag: ['@smoke', '@login'] }, () => {
  test('user can log in with valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);

    await loginPage.expectLoggedIn();
  });

  test('user sees an error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(invalidUser.username, invalidUser.password);

    await loginPage.expectLoginError();
  });
});
