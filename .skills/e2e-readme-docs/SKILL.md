# E2E README Documentation Skill

## Purpose

Use this skill when updating README documentation for Playwright E2E tests.

The README should explain how to run, maintain, and understand the E2E test setup.

## Update the README When These Change

Update the README when any of the following change:

* Test commands
* Test folder structure
* Required environment variables
* Browser setup steps
* Test data setup
* Gherkin test case location
* Tagging conventions
* Selector conventions
* Required `data-testid` attributes
* Base URL setup

## Suggested README Section

````md
## E2E Testing

This project uses Playwright with TypeScript for UI E2E tests.

### Install browsers

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

### Run by tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @critical
```

### Run in UI mode

```bash
npx playwright test --ui
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
````

## Checklist

Before finishing README changes, verify:

```txt
[ ] Commands are accurate
[ ] Folder structure is accurate
[ ] Tags are documented
[ ] data-testid convention is documented
[ ] Environment variables are documented
[ ] Gherkin test case location is documented
```
