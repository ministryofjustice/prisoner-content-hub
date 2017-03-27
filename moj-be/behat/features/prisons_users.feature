Feature: Associating users with Prisons
  As an Administrator
  I want to associate users with prisons

  @api @prisons
  Scenario: Adding a related prison to a user
    Given prisons:
      | name        | code |
      | HMP Wayland | WAY  |
    And users:
      | name      | status |
      | prisoner5 | 1      |
    And I am logged in as a user with the "administrator" role
    When I am on "admin/people"
    And I click "Edit" in the "prisoner5" row
    And I fill in "Related prisons" with "HMP Wayland"
    And I press the "Save" button
    And I click "prisoner5" in the "prisoner5" row
    Then I should see the heading "prisoner5"
    And I should see the link "HMP Wayland"

  @api @prisons @javascript
  Scenario: Adding multiple prisons when creating a prisoner user
    Given prisons:
      | name     | code |
      | Prison 1 | PR1  |
      | Prison 2 | PR2  |
    And I am logged in as a user with the "administrator" role
    When I am on "admin/people/create"
    And I fill in "Username" with "testprisoner"
    And I fill in "Password" with "testpassword"
    And I fill in "Confirm password" with "testpassword"
    And I fill in "Related prisons" with "Prison 1"
    And I press the "Add another item" button
    And I wait for AJAX to finish
    And I fill in "field_related_prisons[1][target_id]" with "Prison 2"
    And I check "Prisoner"
    And I press the "Create new account" button
    Then I should see the text "A prisoner can only be related to a single prison."

  @api @prisons @javascript
  Scenario: Adding multiple prisons to a prisoner user
    Given prisons:
      | name           | code |
      | HMP Wayland    | WAY  |
      | HMP Frankland  | FRA  |
    And users:
      | name      | status |
      | prisoner5 | 1      |
    And I am logged in as a user with the "administrator" role
    When I am on "admin/people"
    And I click "Edit" in the "prisoner5" row
    And I fill in "Related prisons" with "HMP Wayland"
    And I press the "Add another item" button
    And I wait for AJAX to finish
    And I fill in "field_related_prisons[1][target_id]" with "HMP Frankland"
    And I check "Prisoner"
    And I press the "Save" button
    Then I should see the text "A prisoner can only be related to a single prison."

  @api @prisons @javascript
  Scenario: No "Add another item" button for prisoner user
    And users:
      | name      | status | roles    |
      | prisoner5 | 1      | prisoner |
    And I am logged in as a user with the "administrator" role
    When I am on "admin/people"
    And I click "Edit" in the "prisoner5" row
    Then I should not see the text "Add another item"

  @api @prisons @javascript
  Scenario: Associate a prisoner with a prison not administered by local admin
    Given prisons:
      | name     | code |
      | Prison 1 | PR1  |
    And users:
      | name      | roles               |
      | prisoner5 | prisoner            |
      | ladmin1   | local_administrator |
    And I am logged in as "ladmin1"
    When I am on "admin/people"
    And I click "Edit" in the "prisoner5" row
    And I fill in "Related prisons" with "Prison 1"
    And I press the "Save" button
    Then I should see the text 'There are no entities matching "Prison 1".'
