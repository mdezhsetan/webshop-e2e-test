# Page Object Model Skill

## Purpose

Use this skill when creating or updating Page Object Models for Playwright E2E tests.

Page Object Models keep selectors and reusable page actions out of spec files.

## Location

Page objects must be written in:

```txt
tests/e2e/pages/
```

## Rules

Spec files should not contain direct selectors.

Avoid this in specs:

```ts
await page.locator('.submit-button').click();
await page.getByTestId('login-submit-button').click();
await page.getByRole('button', { name: 'Log in' }).click();
```

Use page object methods instead:

```ts
await loginPage.login(validUser.email, validUser.password);
```

## What a Page Object Should Include

A Page Object Model should include:

* Page-specific locators
* Navigation methods
* User actions
* Reusable page-level assertion helpers

## Example

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

## Keep Specs Readable

Avoid hiding the whole test in one large page object method.

Avoid:

```ts
await loginPage.completeSuccessfulLoginFlow();
```

Prefer:

```ts
await loginPage.goto();
await loginPage.login(validUser.email, validUser.password);
await loginPage.expectLoggedIn();
```

Specs should still read like user journeys.
