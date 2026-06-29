@regression @search
Feature: Product search
  As a logged-in customer
  I want to search for a product and open its detail page
  So that I can review the product before buying it

  Background:
    Given the user is logged in to the shop

  Scenario: User can search for a product and open its detail page
    When the user searches for a product
    And the user opens the first search result
    Then the product detail page should be displayed
