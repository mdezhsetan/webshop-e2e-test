// Delivery method labels per locale. The checkout <option>s have no stable id —
// their value is the localized label — so we keep the translations here, keyed
// by E2E_LOCALE, instead of hardcoding one language in the page object. Only the
// locales actually exercised are filled in; add more as they are run.
export const deliveryMethods = {
  dayDelivery: {
    nl: 'Daglevering',
  },
  pickup: {
    nl: 'Afhalen Kramp Varsseveld',
  },
} as const;

export type DeliveryMethod = keyof typeof deliveryMethods;


export function deliveryLabel(method: DeliveryMethod, locale: string): string {
  const label = (deliveryMethods[method] as Record<string, string | undefined>)[locale];
  if (!label) {
    throw new Error(
      `No "${method}" delivery label for locale "${locale}". Add it to deliveryMethods in test-data/checkout.data.ts.`,
    );
  }
  return label;
}

// The assignment's "select invoice payment" step has no UI in this build: B2B
// demo accounts are invoiced by default, so it is implicit and nothing renders a
// payment selector. Kept as documentation of the expected default.
export const paymentMethods = {
  invoice: 'Factuur',
} as const;
