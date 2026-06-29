# [AGENTS.md](http://AGENTS.md)

## Project Context

This repository contains UI end-to-end tests written with **TypeScript** and **Playwright**.

Agents working in this repository must follow these rules:

- Keep reusable test data separate from test logic
- Use Page Object Models
- Write executable Playwright specs in the correct test folder
- Use `data-testid` selectors
- Keep Gherkin test cases in a separate documentation folder
- Tag Playwright tests
- Avoid hardcoded full URLs
- Avoid fixed waits
- Update README documentation when E2E setup, structure, or conventions change

## Project Test Structure

Use this structure for E2E testing:

```txt
test-cases/
  e2e/
    login.feature
    checkout.feature
    search.feature

tests/
  e2e/
    specs/
      login.spec.ts
      checkout.spec.ts
      search.spec.ts
    pages/
      LoginPage.ts
      CheckoutPage.ts
      SearchPage.ts
    test-data/
      login.data.ts
      checkout.data.ts
      search.data.ts
    fixtures/
      example.fixture.ts
    utils/
      example.utils.ts
```



## Where to Write Playwright Tests

Write executable Playwright test specs in:

```txt
tests/e2e/specs/
```

Spec files must use this naming pattern:

```txt
*.spec.ts
```

Examples:

```txt
tests/e2e/specs/login.spec.ts
tests/e2e/specs/checkout.spec.ts
tests/e2e/specs/search.spec.ts
```

Playwright specs should describe user-facing behavior.

Good:

```ts
test('user can log in with valid credentials', async ({ page }) => {
  // test steps
});
```

Avoid implementation-focused test names.

Bad:

```ts
test('clicking submit button calls submit handler', async ({ page }) => {
  // implementation-focused test
});
```



## Gherkin Test Cases

Gherkin test cases are for documentation only.

Write Gherkin files in:

```txt
test-cases/e2e/
```

Gherkin files must use this naming pattern:

```txt
*.feature
```

Examples:

```txt
test-cases/e2e/login.feature
test-cases/e2e/checkout.feature
test-cases/e2e/search.feature
```

Gherkin files must not be treated as executable Playwright tests.

When adding or changing a Playwright spec, add or update the matching Gherkin test case file.

Example:

```gherkin
@regression @login
Feature: Login

  Scenario: User can log in with valid credentials
    Given the user is on the login page
    When the user enters valid credentials
    And the user submits the login form
    Then the user should see the dashboard
```

Gherkin should describe behavior, not implementation details.

Good:

```gherkin
When the user submits the login form
```

Bad:

```gherkin
When the user clicks the element with data-testid "login-submit-button"
```



## Page Object Model

Use the **Page Object Model** pattern for UI interactions.

Page objects belong in:

```txt
tests/e2e/pages/
```

Spec files should not contain selectors directly.

Avoid this inside spec files:

```ts
await page.locator('.submit-button').click();
await page.getByTestId('login-submit-button').click();
await page.getByRole('button', { name: 'Log in' }).click();
```

Instead, put locators and reusable actions inside Page Object Model classes.

Example:

```ts
import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly emailInput = this.page.getByTestId('login-email-input');
  readonly passwordInput = this.page.getByTestId('login-password-input');
  readonly submitButton = this.page.getByTestId('login-submit-button');
  readonly dashboardHeading = this.page.getByTestId('dashboard-heading');
  readonly errorMessage = this.page.getByTestId('login-error-message');

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectLoggedIn() {
    await expect(this.dashboardHeading).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }
}
```

Specs should call page object methods.

Example:

```ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { validUser } from '../test-data/login.data';

test.describe('Login', { tag: ['@regression', '@login'] }, () => {
  test('user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await loginPage.expectLoggedIn();
  });
});
```



## Separate Test Data

Do not hardcode **reusable** test data inside spec files. Store shared or repeated values in `tests/e2e/test-data/`.

Single-use values may stay inline in the spec when they are simple, unlikely to change, and extracting them would not improve readability or reuse. If a value may need to be updated later — for example a product name, search term, or demo catalog item — put it in a test data file even when it is used in only one test.

Store reusable test data in:

```txt
tests/e2e/test-data/
```

Put data in a test data file when it is:

- Used in more than one test
- Shared across specs
- A credential, secret, or environment-specific value
- Likely to change or may need updating later
- Something you may want to change in one place without editing the spec

Inline values in a spec are fine when they are:

- Used only once in one test
- Simple and stable in context (for example a one-off quantity)
- Unlikely to need updating later

Example — reusable data belongs in a test data file:

```ts
export const validUser = {
  email: 'test.user@example.com',
  password: 'Password123!',
};

export const invalidUser = {
  email: 'invalid.user@example.com',
  password: 'WrongPassword123!',
};
```

Use test data from specs like this:

```ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { validUser, invalidUser } from '../test-data/login.data';

test.describe('Login', { tag: ['@regression', '@login'] }, () => {
  test('user sees an error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(invalidUser.email, invalidUser.password);

    await loginPage.expectErrorVisible();
  });
});
```

Example — single-use inline data is acceptable when it is stable:

```ts
await cartPage.setQuantity(2);
```

Example — put data in a test data file when it may change later, even in one test:

```ts
import { searchTerms } from '../test-data/search.data';

await searchPage.search(searchTerms.defaultProduct);
```

Sensitive values must not be committed.

Use environment variables for secrets:

```ts
export const adminUser = {
  email: process.env.E2E_ADMIN_EMAIL ?? '',
  password: process.env.E2E_ADMIN_PASSWORD ?? '',
};
```

Never commit real credentials, tokens, or private user data.

## Selectors

Use `data-testid` for E2E selectors.

Application code should expose stable selectors like this:

```html
<button data-testid="login-submit-button">Log in</button>
```

Playwright should use:

```ts
page.getByTestId('login-submit-button');
```

However, `getByTestId` should normally be used inside Page Object Model files, not directly inside spec files.

Configure Playwright to use `data-testid` in `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-testid',
  },
});
```

Avoid brittle selectors:

```ts
page.locator('.btn-primary');
page.locator('div > button:nth-child(2)');
page.locator('[class*="submit"]');
page.locator('xpath=//button[2]');
```

Use clear, feature-based selector names.

Good:

```txt
login-email-input
login-password-input
login-submit-button
login-error-message
dashboard-user-menu
checkout-submit-order-button
```

Avoid names based on style, layout, or implementation detail.

Bad:

```txt
blue-button
left-panel-input
big-title
submit-button-v2
```



## Test Tags

All Playwright tests should include meaningful tags.

This repository contains E2E tests only, so an `@e2e` tag is redundant. Use tags that add filtering value.

Use tags for:

- Feature area
- Priority or coverage level

Recommended tags:

```txt
@smoke
@regression
@critical
@login
@checkout
@search
@cart
@dashboard
```

Example:

```ts
test.describe('Login', { tag: ['@regression', '@login'] }, () => {
  test('user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await loginPage.expectLoggedIn();
  });
});
```

For critical flows:

```ts
test.describe('Checkout', { tag: ['@critical', '@checkout'] }, () => {
  test('user can complete checkout', async ({ page }) => {
    // test steps
  });
});
```

Run tests by tag:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @checkout
npx playwright test --grep @critical
```

Keep the tag list small and consistent.

Avoid overly specific tags:

```txt
@login-button-blue
@new-header-version
@input-validation-left-side
```



## URLs

Do not hardcode full environment URLs in tests or page objects.

Avoid:

```ts
await page.goto('https://example.com/login');
```

Use relative paths:

```ts
await page.goto('/login');
```

Configure the base URL in `playwright.config.ts`. Keep the shop region and locale separate so country and language can be changed independently.

```ts
import { defineConfig } from '@playwright/test';

const shopBaseUrl =
  process.env.E2E_BASE_URL ?? 'https://qa-task.demo.kramp.com/shop-nl';
const locale = process.env.E2E_LOCALE ?? 'nl';

export default defineConfig({
  use: {
    baseURL: `${shopBaseUrl}/${locale}`,
    testIdAttribute: 'data-testid',
  },
});
```

Use `E2E_BASE_URL` for the shop region path without a locale segment.

Examples:

```txt
https://qa-task.demo.kramp.com/shop-nl
https://qa-task.demo.kramp.com/shop-be
```

Use `E2E_LOCALE` to select the language segment.

Examples:

```txt
nl
fr
en
```

Combined examples:

```txt
shop-nl/nl
shop-be/fr
```

This keeps tests portable across environments, regions, and locales.

## Waits

Do not use fixed waits.

Avoid:

```ts
await page.waitForTimeout(3000);
```

Use Playwright actions, locators, and assertions instead.

Good:

```ts
await expect(this.dashboardHeading).toBeVisible();
```

Good:

```ts
await expect(this.errorMessage).toBeVisible();
```

Only use fixed waits if there is no alternative, and add a comment explaining why.

## Assertions

Assertions can live in spec files or Page Object Model helper methods.

Use Page Object assertion helpers when they improve readability.

Good:

```ts
await loginPage.expectLoggedIn();
```

For error states in a multilingual app, prefer visibility or stable selectors over exact message text. Error copy changes by locale and should not be hardcoded in tests.

Good:

```ts
await loginPage.expectErrorVisible();
```

Avoid exact UI copy assertions unless you intentionally test copy for one locale:

```ts
await expect(this.errorMessage).toHaveText('Invalid email or password');
```

If you need to verify message content across locales, use locale test data and run tests per locale. Do not store translated UI copy in test data unless you maintain it per locale.

Avoid hiding the whole test inside one large page object method.

Avoid:

```ts
await loginPage.completeSuccessfulLoginFlow();
```

Better:

```ts
await loginPage.goto();
await loginPage.login(validUser.email, validUser.password);
await loginPage.expectLoggedIn();
```

Specs should remain readable as user journeys.

## README Updates

When adding or changing E2E tests, update the README if any of these change:

- Test commands
- Test folder structure
- Required environment variables
- Browser setup steps
- Test data setup
- Gherkin test case location
- Tagging conventions
- Selector conventions
- Required `data-testid` attributes
- Base URL setup

The README should include an E2E section with:

```md
## E2E Tests

E2E tests are written with TypeScript and Playwright.

### Install Playwright browsers

```bash
npx playwright install
```

### Run all E2E tests

```bash
npm run test:e2e
```

### Run one test file

```bash
npx playwright test tests/e2e/specs/login.spec.ts
```

### Run tests with Playwright UI

```bash
npx playwright test --ui
```

### Run tests by tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @critical
```

### Folder structure

```txt
test-cases/e2e/       Gherkin test case documentation
tests/e2e/specs/      Playwright spec files
tests/e2e/pages/      Page Object Models
tests/e2e/test-data/  Test data
tests/e2e/fixtures/   Playwright fixtures
tests/e2e/utils/      Shared helpers
```

### Selector convention

Use `data-testid` for E2E selectors.

Example:

```html
<button data-testid="login-submit-button">Log in</button>
```

In Playwright page objects, use:

```ts
page.getByTestId('login-submit-button');
```

### Environment variables

```txt
E2E_BASE_URL=https://qa-task.demo.kramp.com/shop-nl
E2E_LOCALE=nl
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

Examples for other regions and languages:

```txt
E2E_BASE_URL=https://qa-task.demo.kramp.com/shop-be
E2E_LOCALE=fr
```





## Before Submitting Changes

Before finishing E2E changes, run:

```bash
npm run lint
npm run test:e2e
```

If the project has a type-check command, also run:

```bash
npm run typecheck
```

If a command fails, document the failure and the reason.