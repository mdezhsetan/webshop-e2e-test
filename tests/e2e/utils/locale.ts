// The active language segment, taken from E2E_LOCALE (e.g. nl, en, fr) and
// kept in sync with the baseURL locale in playwright.config.ts. Locale-specific
// test data (such as delivery method labels) is resolved against this value.
export const DEFAULT_LOCALE = 'nl';

export function getLocale(): string {
  return process.env.E2E_LOCALE ?? DEFAULT_LOCALE;
}
