# Kramp E-Commerce QA Automation Assignment

Playwright end-to-end tests for the Kramp demo shop customer journey: login, product search, cart, checkout, and order confirmation.

**Demo:** [https://qa-task.demo.kramp.com/shop-nl](https://qa-task.demo.kramp.com/shop-nl)

For repository conventions and agent guidance, see [AGENTS.md](AGENTS.md).

---

## Quick start

Follow these steps to run the suite locally.

### 1. Prerequisites

- Node.js 24 (matches CI)
- npm

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Purpose | Example |
|----------|---------|---------|
| `E2E_BASE_URL` | Host root (no shop or locale segment) | `https://qa-task.demo.kramp.com` |
| `E2E_SHOP` | Shop region segment | `shop-nl` |
| `E2E_LOCALE` | Language segment for this run | `nl` |
| `E2E_PLATFORM_USER` | HTTP basic-auth username | from assignment |
| `E2E_PLATFORM_PASSWORD` | HTTP basic-auth password | from assignment |
| `E2E_USERNAME` | Application login username | from assignment |
| `E2E_PASSWORD` | Application login password | from assignment |

`E2E_LOCALE=nl` in `.env` is fine as a **default for local runs**. It tells Playwright which URL to open (`…/shop-nl/nl/`). It is not meant to lock the project to Dutch only — see [Regions and locales](#regions-and-locales) below.

Never commit `.env`. Credentials belong in environment variables or CI secrets only.

### 4. Install Playwright browsers

```bash
npx playwright install
```

On Linux CI, Chromium is installed with system dependencies:

```bash
npx playwright install --with-deps chromium
```

### 5. Run the tests

```bash
npm run test:e2e
```

### 6. Run a subset (optional)

One spec file:

```bash
npx playwright test tests/e2e/specs/login.spec.ts
```

By tag:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @critical
```

Headed mode (see the browser):

```bash
npx playwright test --headed
```

Interactive UI mode:

```bash
npm run test:e2e:ui
```

### 7. Quality checks before pushing

```bash
npm run lint
npm run typecheck
npm run test:e2e
```

Husky runs lint and typecheck on `git push`.

---

## Authentication approach

**Preferred approach:** authenticate through API calls, store the resulting session (token or cookies) in Playwright `storageState`, and reuse it across specs. UI login is exercised only in a dedicated `@smoke @login` spec.

| | UI login in every spec | API login + stored session |
|--|------------------------|----------------------------|
| Speed | Slow — full login flow per test | Fast — session injected once |
| Stability | More steps, more flake | Fewer UI steps after setup |
| Coverage | Login retested redundantly | Login tested once where it belongs |

**How this would work in practice:**

1. A `globalSetup` (or `beforeAll` in a setup project) calls the login API and writes `storageState` to disk.
2. Journey specs (`@search`, `@checkout`, `@critical`) load that state and start already authenticated.
3. Only `login.spec.ts` drives the login form — valid credentials and invalid-credentials error handling.

**What this repo does today:** journey specs (`search`, `full-flow`) still log in through the UI. The demo environment does not expose a documented public auth API in the assignment scope, so UI login keeps the suite self-contained for reviewers. The structure (page objects, fixtures, separated login spec) is ready to swap in API-based setup without rewriting the journeys.

---

## Regions and locales

A single `.env` with `E2E_LOCALE=nl` is a practical default for day-to-day runs. The goal is **not** to test only one language forever.

**Environment variables** select the target for a given run:

```txt
# Netherlands, Dutch
E2E_BASE_URL=https://qa-task.demo.kramp.com
E2E_SHOP=shop-nl
E2E_LOCALE=nl

# Belgium, French
E2E_SHOP=shop-be
E2E_LOCALE=fr
```

**Test data** holds values that vary by locale or region, so specs stay free of hardcoded translations:

- `tests/e2e/test-data/checkout.data.ts` — delivery method labels keyed by locale (`nl`, `fr`, …)
- `tests/e2e/test-data/login.data.ts` — credentials from env today; in a multi-account setup, accounts would be keyed by region here
- `tests/e2e/test-data/search.data.ts` — catalog items that must exist in the target shop

`tests/e2e/utils/locale.ts` reads `E2E_LOCALE` at runtime so page objects resolve the correct label without embedding Dutch strings.

**To exercise another region or language:**

1. Set `E2E_SHOP` and `E2E_LOCALE` in `.env` (or pass them inline for one run).
2. Add the matching entries in test data (delivery labels, account, product) for that locale.
3. Re-run the suite.

For parallel multi-locale CI, Playwright [projects](https://playwright.dev/docs/test-projects) — one per `shop` + `locale` combination — are the natural next step.

---

## E2E tests

E2E tests are written with TypeScript and Playwright.

### Folder structure

```txt
test-cases/e2e/       Gherkin test case documentation (not executable)
tests/e2e/specs/      Playwright spec files
tests/e2e/pages/      Page Object Models
tests/e2e/test-data/  Test data
tests/e2e/fixtures/   Playwright fixtures (page object injection)
tests/e2e/utils/      Shared helpers (cookies, locale, timeouts)
```

### Tags

| Tag | Used for |
|-----|----------|
| `@smoke` | Fast confidence checks (`login`) |
| `@regression` | Broader coverage (`search`) |
| `@critical` | End-to-end business path (`full-flow`) |
| `@login` `@search` `@checkout` | Feature-area filtering |

```bash
npx playwright test --grep @smoke
npx playwright test --grep @critical
```

### Selector convention

Use `data-testid` for E2E selectors. Page objects call `page.getByTestId(...)`; specs do not contain selectors directly.

Where an element has no stable test id (the delivery-method dropdown), localized labels live in test data and are resolved via `getLocale()`.

### Gherkin

Feature files under `test-cases/e2e/` document user journeys for reviewers. Playwright specs in `tests/e2e/specs/` are the executable tests.

---

## Approach and decisions

- **Page Object Model** — page objects own locators and actions; specs read as user journeys. Objects are injected via `tests/e2e/fixtures/pages.fixture.ts`.
- **Scope** — one reliable happy-path E2E covering the required scenario, plus focused login and search specs.
- **Locators** — `data-testid` everywhere possible; locale-specific text only in test data.
- **Waits** — Playwright assertions and locators; no fixed `waitForTimeout`.
- **Traces** — retained on failure for debugging the slow, occasionally flaky demo.

---

## Assumptions

- Demo credentials from the assignment are used (`assignment_demo` / platform auth via config).
- A searchable product exists and remains available in the demo environment (`VPJ4524` in test data).
- **Invoice payment is implicit.** The assignment lists "select the invoice payment option", but this demo build exposes no payment-method UI. B2B accounts are invoiced by default. The test validates the journey through to order confirmation.

---

## Known limitations

- **Single shared account.** Every test signs in as the one demo user; cart state is server-side per account. High parallelism against the same account can interfere — run with limited workers or use per-worker accounts.
- **Demo stability.** The demo spans two domains and is slow; order submission can intermittently return "Unable to load". CI retries twice; traces are kept on failure.
- **UI login in journey specs.** See [Authentication approach](#authentication-approach) — API-based session setup is the preferred direction.

---

## CI

GitHub Actions runs on pull requests, pushes to `main`, and `workflow_dispatch`.

Configure these repository secrets:

```txt
E2E_BASE_URL
E2E_SHOP
E2E_LOCALE
E2E_PLATFORM_USER
E2E_PLATFORM_PASSWORD
E2E_USERNAME
E2E_PASSWORD
```

The workflow installs dependencies, runs lint, typecheck, and the full E2E suite, then uploads `playwright-report/` and `test-results/` as artifacts.

---

## What I would improve with more time and data

Several next steps depend on more than engineering effort — documented auth APIs, stable catalog items per region, and additional test accounts would unlock most of the list below.

- API-based login with `storageState` reuse across journey specs
- Per-worker test accounts for safe parallel checkout
- Additional checkout and search edge cases
- Broader locale and region coverage once delivery labels, products, and accounts exist in test data
