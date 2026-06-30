import { expect, type Page } from '@playwright/test';
import { deliveryLabel, type DeliveryMethod } from '../test-data/checkout.data';
import { getLocale } from '../utils/locale';
import { TIMEOUTS } from '../utils/timeouts';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  readonly deliverySummary = this.page.getByTestId('DeliverySummaryPanel');
  readonly deliveryMethodSelect = this.page.getByTestId('delivery-method-select');
  readonly deliveryOptions = this.deliveryMethodSelect.locator('option');
  readonly confirmOrder = this.page.getByTestId('ConfirmOrder');
  readonly submitButton = this.confirmOrder.getByTestId('checkout-button').first();

  async expectLoaded(): Promise<void> {
    await expect(this.deliverySummary).toBeVisible({ timeout: TIMEOUTS.slowContent });
    // Delivery options load asynchronously after checkout opens; the dropdown
    // starts disabled with no choices until the cart-backed checkout is ready.
    await expect(this.deliveryMethodSelect).toBeEnabled({ timeout: TIMEOUTS.slowContent });
    await expect(this.submitButton).toBeVisible({ timeout: TIMEOUTS.slowContent });
  }

  async selectDeliveryMethod(method: DeliveryMethod = 'dayDelivery'): Promise<void> {
    await expect(this.deliveryMethodSelect).toBeEnabled({ timeout: TIMEOUTS.slowContent });
    const label = deliveryLabel(method, getLocale());
    await expect(this.deliveryOptions.filter({ hasText: label })).toHaveCount(1, {
      timeout: TIMEOUTS.slowContent,
    });
    await this.deliveryMethodSelect.selectOption({ label });
  }

  // Submits the order; the confirmation-page transition is verified by
  // OrderConfirmationPage.
  async submitOrder(): Promise<void> {
    await this.submitButton.click();
  }
}
