import { expect, type Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/timeouts';

export class ProductPage {
  constructor(private readonly page: Page) {}

  readonly itemName = this.page.getByTestId('ItemName');
  readonly itemNumber = this.page.getByTestId('ItemNumber');
  readonly grossPrice = this.page.getByTestId('ProductGrossPrice');
  readonly buyBlock = this.page.getByTestId('BuyBlock');
  // Despite its name, "AddToQuotationButton" is the add-to-cart button (its CSS
  // class is "add-to-cart-button"). The same button appears on every
  // related-product tile, so we scope it to the BuyBlock to target this product.
  readonly addToCartButton = this.buyBlock.getByTestId('AddToQuotationButton');

  async expectLoaded(): Promise<void> {
    await expect(this.itemName).toBeVisible({ timeout: TIMEOUTS.slowContent });
    await expect(this.buyBlock).toBeVisible({ timeout: TIMEOUTS.slowContent });
    // Price fetch can fail on the demo environment ("brutoprijs kon niet worden
    // opgehaald"). The add-to-cart button is the reliable signal that the buy
    // block is interactive; clicking before it appears is silently ignored.
    await expect(this.addToCartButton).toBeVisible({ timeout: TIMEOUTS.slowContent });
  }

  async expectItemNumber(itemNumber: string): Promise<void> {
    await expect(this.itemNumber).toHaveText(itemNumber);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
