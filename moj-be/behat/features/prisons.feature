Feature: Prison entities
  As an Administrator
  I want to create/edit/delete Prison entities
  So that content and users can be associated with a prison

  @api
  Scenario: Viewing the prisons settings
    Given I am logged in as a user with the "administrator" role
    When I am on "admin/config/moj/prison/settings"
    Then I should see the heading "Prison settings"

  @api @prisons
  Scenario: Listing Prison entities
    Given prisons:
      | name          | code |
      | HMP Wayland   | WAY  |
      | HMP Frankland | FRA  |
      | HMP Durham    | DUR  |
    And I am logged in as a user with the "administrator" role
    When I am on "admin/structure/prison"
    Then I should see the link "HMP Wayland"
    And I should see the link "HMP Durham"
    And I should see the link "HMP Frankland"

  @api
  Scenario: Creating a Prison entity
    Given I am logged in as a user with the "administrator" role
    When I am on "admin/structure/prison/add"
    And I fill in the following:
      | Name          | HMP Durham  |
      | Code          | DUR         |
    And I press the "Save" button
    And I am on "admin/structure/prison"
    Then I should see the link "HMP Durham"
    And I should see the text "DUR"

  @api @prisons
  Scenario: Editing a Prison entity
    Given prisons:
      | name          | code |
      | HMP Wayland   | WAY  |
    When I am logged in as a user with the "administrator" role
    And I am on "admin/structure/prison"
    And I click "Edit" in the "HMP Wayland" row
    And I fill in the following:
      | Name          | HMP Frankland |
      | Code          | FRA           |
    And I press the "Save" button
    And I am on "admin/structure/prison"
    Then I should see the link "HMP Frankland"
    And I should see the text "FRA" in the "HMP Frankland" row

  @api
  Scenario: Deleting a Prison entity
    Given prisons:
      | name          | code |
      | HMP Wayland   | WAY  |
    When I am logged in as a user with the "administrator" role
    And I am on "admin/structure/prison"
    And I click "Delete" in the "HMP Wayland" row
    And I press the "Delete" button
    Then I should see the text "The prison HMP Wayland has been deleted"
