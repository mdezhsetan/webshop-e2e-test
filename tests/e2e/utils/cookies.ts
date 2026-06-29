import { type Page } from '@playwright/test';
import { TIMEOUTS } from './timeouts';

/**
 * Dismiss the OneTrust cookie consent banner if it is shown.
 * Consent is tracked per domain, so this is called after navigating
 * to a new domain (e.g. the shop and the separate login host).
 */
export async function acceptCookies(page: Page): Promise<void> {
  const acceptButton = page.locator('#onetrust-accept-btn-handler');
  try {
    await acceptButton.waitFor({ state: 'visible', timeout: TIMEOUTS.optionalElement });
    await acceptButton.click();
  } catch {
    // No banner on this domain/visit; nothing to dismiss.
  }
}
