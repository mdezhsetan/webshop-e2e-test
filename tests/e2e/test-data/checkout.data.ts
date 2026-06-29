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

// The assignment asks to "select the invoice payment option", but this demo build
// exposes no payment-method control anywhere: neither the checkout page nor the
// order confirmation page renders a payment selector or a "Factuur" label
// (verified by inspecting both pages' DOM). B2B demo accounts are invoiced by
// default, so invoice payment is implicit and there is nothing to select.
// Kept as documentation of the expected default and for a future build that
// surfaces payment selection.
export const paymentMethods = {
  invoice: 'Factuur',
} as const;
