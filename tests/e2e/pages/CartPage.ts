import { expect, type Locator, type Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/timeouts';

export class CartPage {
  constructor(private readonly page: Page) {}

  readonly orderOverview = this.page.getByTestId('OrderOverviewPanel');
  readonly lineItems = this.page.getByTestId('quotation-line');
  readonly checkoutButton = this.orderOverview.getByTestId('checkout-button');

  async goto(): Promise<void> {
    await this.page.goto('shopping-cart', { waitUntil: 'domcontentloaded' });
  }

  lineItem(partNumber: string): Locator {
    return this.lineItems.filter({
      has: this.page.getByTestId('item-part-number').filter({ hasText: partNumber }),
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.orderOverview).toBeVisible({ timeout: TIMEOUTS.slowContent });
    await expect(this.lineItems.first()).toBeVisible({ timeout: TIMEOUTS.slowContent });
  }

  async expectItemVisible(partNumber: string): Promise<void> {
    await expect(this.lineItem(partNumber)).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout**');
  }
}
