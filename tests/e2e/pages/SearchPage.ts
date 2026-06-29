import { expect, type Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/timeouts';

export class SearchPage {
  constructor(private readonly page: Page) {}

  readonly searchInput = this.page.getByTestId('header-search-input');
  readonly searchSubmit = this.page.getByTestId('header-search-submit');
  readonly firstResult = this.page.getByTestId('products-item').first();

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
    await this.page.waitForURL('**/search/**');
    await this.expectResults();
  }

  async expectResults(): Promise<void> {
    // The grid first shows skeleton placeholders and swaps in real products
    // once the search request resolves, which can be slow, so allow extra time.
    await expect(this.firstResult).toBeVisible({ timeout: TIMEOUTS.slowContent });
  }

  async openFirstProduct(): Promise<void> {
    await this.firstResult.getByTestId('item-tile-title').click();
    await this.page.waitForURL('**/p/**');
  }
}
