@smoke @login
Feature: Login
  As a customer
  I want to log in to the shop
  So that I can place orders with my account

  Background:
    Given the user is on the shop home page
    And the user has accepted the cookie consent

  Scenario: User can log in with valid credentials
    When the user opens the login page
    And the user enters valid credentials
    And the user submits the login form
    Then the user should be logged in to the shop

  Scenario: User sees an error with invalid credentials
    When the user opens the login page
    And the user enters invalid credentials
    And the user submits the login form
    Then the user should see an invalid credentials error
    And the user should remain on the login page
