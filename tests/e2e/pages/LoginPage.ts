import { expect, type Page } from '@playwright/test';
import { acceptCookies } from '../utils/cookies';
import { TIMEOUTS } from '../utils/timeouts';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // The shop has no data-testid on the login trigger; it is a header link
  // whose accessible name comes from its title attribute.
  readonly loginTrigger = this.page.getByRole('link', { name: 'Login' }).first();
  readonly usernameInput = this.page.getByTestId('username');
  readonly passwordInput = this.page.getByTestId('password');

  // The identity provider's submit button has no data-testid; name is used as a fallback.
  readonly submitButton = this.page.locator('button[name="login-btn"]');
  readonly loggedInContent = this.page.getByTestId('homepage-logged-in-content');

  // Error copy is localized, so assert on the alert role rather than text.
  readonly errorAlert = this.page.getByRole('alert').first();

  async goto(): Promise<void> {
    await this.page.goto('', { waitUntil: 'domcontentloaded' });
    await acceptCookies(this.page);
    await this.loginTrigger.click();
    await acceptCookies(this.page);

    // Login runs on a separate single-page app. On first paint the inputs are
    // visible but the form's JavaScript has not finished initializing, and it
    // still needs to populate hidden auth tokens. Submitting during that window
    // makes the server reject valid credentials as "invalid". Waiting for the
    // 'load' event ensures the form is fully initialized before we type.
    await this.page.waitForLoadState('load');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.loggedInContent).toBeVisible({ timeout: TIMEOUTS.slowContent });
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
  }
}
