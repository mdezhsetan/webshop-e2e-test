@critical @checkout
Feature: Full flow
  As a customer
  I want to log in, search for a product, add it to my cart, and complete checkout
  So that I receive an order confirmation

  Scenario: User can complete the full flow from login to order confirmation
    When the user opens the login page
    And the user enters valid credentials
    And the user submits the login form
    Then the user should be logged in to the shop
    When the user searches for a product
    And the user opens the first search result
    And the user adds the product to the cart
    Then the shopping cart counter should increase
    And the user opens the shopping cart
    Then the product should be visible in the cart
    And the user proceeds to checkout
    And the user selects a delivery method
    And the user submits the order
    Then the user should see the order confirmation page
    And the shopping cart counter should be zero
