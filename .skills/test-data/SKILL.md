# Test Data Skill

## Purpose

Use this skill when creating or updating test data for Playwright E2E tests.

Test data must be separated from test logic when it is reusable, shared, or may need updating later.

## Location

Reusable test data must be written in:

```txt
tests/e2e/test-data/
```

## Naming

Use feature-based file names:

```txt
login.data.ts
checkout.data.ts
search.data.ts
cart.data.ts
```

## Rules

Do not hardcode reusable test data in spec files.

Put data in a test data file when it is:

* Used in more than one test
* Shared across specs
* A credential, secret, or environment-specific value
* Likely to change or may need updating later
* Something you may want to change in one place without editing the spec

Single-use values may stay inline in a spec when they are simple, stable, and unlikely to need updating later.

Avoid reusable data inline in specs:

```ts
await loginPage.login('test@example.com', 'Password123!');
```

Use imported test data for reusable values:

```ts
import { validUser } from '../test-data/login.data';

await loginPage.login(validUser.email, validUser.password);
```

Single-use inline values are acceptable when they are stable:

```ts
await cartPage.setQuantity(2);
```

Prefer a test data file when the value may change later:

```ts
import { searchTerms } from '../test-data/search.data';

await searchPage.search(searchTerms.defaultProduct);
```

## Example

```ts
export const validUser = {
  email: 'test.user@example.com',
  password: 'Password123!',
};

export const invalidUser = {
  email: 'invalid.user@example.com',
  password: 'WrongPassword123!',
};
```

Do not store translated UI copy such as error messages in test data unless you maintain it per locale. Prefer asserting that the error element is visible.

## Secrets

Never commit real credentials, tokens, or private user data.

Use environment variables for secrets:

```ts
export const adminUser = {
  email: process.env.E2E_ADMIN_EMAIL ?? '',
  password: process.env.E2E_ADMIN_PASSWORD ?? '',
};
```

## Good Test Data

Good test data is:

* Reusable, shared, or likely to change later
* Feature-specific
* Easy to read
* Free of real secrets
* Imported into specs instead of duplicated when reused or maintained centrally
