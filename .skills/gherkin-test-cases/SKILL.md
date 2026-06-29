# Gherkin Test Cases Skill

## Purpose

Use this skill when creating or updating Gherkin test case documentation.

Gherkin files are documentation only. They describe intended user behavior and should not be treated as executable Playwright tests.

## Location

Gherkin files must be written in:

```txt
test-cases/e2e/
```

## Naming

Use the `.feature` extension.

Examples:

```txt
test-cases/e2e/login.feature
test-cases/e2e/checkout.feature
test-cases/e2e/search.feature
```

## Rules

Gherkin should describe behavior, not implementation details.

Good:

```gherkin
When the user submits the login form
```

Bad:

```gherkin
When the user clicks the element with data-testid "login-submit-button"
```

## Tags

Use tags that match the related Playwright test tags where possible.

This repository contains E2E tests only, so an `@e2e` tag is redundant.

Recommended tags:

```txt
@smoke
@regression
@critical
@login
@checkout
@search
@cart
@dashboard
```

## Example

```gherkin
@regression @login
Feature: Login

  Scenario: User can log in with valid credentials
    Given the user is on the login page
    When the user enters valid credentials
    And the user submits the login form
    Then the user should see the dashboard

  Scenario: User sees an error for invalid credentials
    Given the user is on the login page
    When the user enters invalid credentials
    And the user submits the login form
    Then the user should see an invalid credentials error
```

## Maintenance

When a Playwright spec is added or changed, update the matching Gherkin file.
