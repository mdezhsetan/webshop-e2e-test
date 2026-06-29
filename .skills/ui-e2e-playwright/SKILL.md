# UI E2E Playwright Skill

## Purpose

Use this skill when creating, reviewing, or updating UI end-to-end tests for a TypeScript + Playwright project.

The goal is to create maintainable E2E tests that use:

* Playwright with TypeScript
* Page Object Models
* Separate test data
* `data-testid` selectors
* Playwright test tags
* Gherkin test case documentation
* Relative URLs with a configured base URL
* Reliable assertions instead of fixed waits
* Updated README documentation

## File Locations

Executable Playwright specs must be written in:

```txt
tests/e2e/specs/
```

Page Object Models must be written in:

```txt
tests/e2e/pages/
```

Test data must be written in:

```txt
tests/e2e/test-data/
```

Reusable fixtures must be written in:

```txt
tests/e2e/fixtures/
```

Reusable helpers must be written in:

```txt
tests/e2e/utils/
```

Gherkin documentation must be written in:

```txt
test-cases/e2e/
```

## Workflow

When adding or updating an E2E test:

1. Identify the user journey being tested.
2. Add or update the Gherkin test case in `test-cases/e2e/`.
3. Add or update the Page Object Model in `tests/e2e/pages/`.
4. Add or update test data in `tests/e2e/test-data/`.
5. Add the executable Playwright spec in `tests/e2e/specs/`.
6. Add meaningful Playwright tags.
7. Use `data-testid` selectors through Page Object Models.
8. Use relative URLs instead of hardcoded full URLs.
9. Avoid fixed waits.
10. Update the README when setup, commands, structure, tags, selectors, base URL, or environment variables change.
11. Run the relevant validation commands.

## Required Playwright Config

Use `data-testid` as the test id attribute. Keep the shop region and locale separate.

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

`E2E_BASE_URL` is the shop region (for example `shop-nl`, `shop-be`).

`E2E_LOCALE` is the language segment (for example `nl`, `fr`).

Combined target examples: `shop-nl/nl`, `shop-be/fr`.

## Example Spec

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

## Completion Checklist

Before finishing an E2E change, verify:

```txt
[ ] Playwright specs are in tests/e2e/specs/
[ ] Gherkin test cases are in test-cases/e2e/
[ ] Page Object Models are used for selectors and actions
[ ] Test data is separated from test logic
[ ] Selectors use data-testid
[ ] Tests include meaningful tags
[ ] Tests use relative URLs
[ ] Tests avoid fixed waits
[ ] Error assertions avoid exact translated UI copy unless testing copy per locale
[ ] README is updated when needed
[ ] Lint/typecheck/test commands were run or failures were documented
```
