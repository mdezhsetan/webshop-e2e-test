import { expect, type Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/timeouts';

const confirmationUrl = /\/confirmation\?quotationId=\d+/;

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  readonly confirmationText = this.page.getByTestId('ConfirmationText');
  readonly orderNumber = this.page.getByTestId('OrderNumber');
  readonly cartCounter = this.page.getByTestId('shopping-cart-counter');

  async expectOrderPlaced(): Promise<void> {
    // Successful submit lands on /confirmation?quotationId=<order number>.
    await expect(this.page).toHaveURL(confirmationUrl, { timeout: TIMEOUTS.slowContent });
    await expect(this.confirmationText).toBeVisible({ timeout: TIMEOUTS.slowContent });
    await expect(this.orderNumber).toBeVisible({ timeout: TIMEOUTS.slowContent });

    const orderNumber = ((await this.orderNumber.textContent()) ?? '').trim();
    const quotationId = new URL(this.page.url()).searchParams.get('quotationId') ?? '';

    expect(quotationId).toBe(orderNumber);
    await expect(this.cartCounter).toHaveText('0');
  }
}
