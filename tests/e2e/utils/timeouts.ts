// Per-assertion timeout overrides for steps that are slower than the default
// expect timeout in playwright.config.ts. Centralized here so the values have
// one source of truth and a clear intent at each call site.
export const TIMEOUTS = {
  // Content that loads asynchronously and can be slow on the demo: search
  // results swapping in from skeletons, the product buy block, checkout
  // delivery options, and the post-login redirect.
  slowContent: 20_000,
  // An element that may legitimately never appear (e.g. the cookie banner):
  // wait briefly, then move on. Kept short so an absent banner costs little.
  optionalElement: 5_000,
} as const;
