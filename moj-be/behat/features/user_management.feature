Feature: Prison officers managing a user's permissions
  As a Prison Officer
  I want to alter a prisoner's content permissions

  Background:
    Given users:
      | name        | status | roles    |
      | prisoner123 | 1      | Prisoner |

  @api @javascript
  Scenario: A prison office should only see content-related roles
    Given I am logged in as a user with the "moj_prison_officer" role
    When I am on "admin/people"
    And I click "Edit" in the "prisoner123" row
    Then I should see the heading "prisoner123"
    And I should see a "View video" form element
    And I should see a "View radio" form element
    And I should see a "View PDF" form element
    And I should not see an "Administrator" form element
    And I should not see a "Prison officer" form element
    And I should not see a "Prisoner" form element
    And I should not see a "Local Content Manager" form element

  @api @javascript
  Scenario: Removing and adding a prisoner's content roles
    Given I am logged in as a user with the "moj_prison_officer" role
    When I am on "admin/people"
    Then I should see "View video" in the "prisoner123" row
    When I click "Edit" in the "prisoner123" row
    And I uncheck the box "View video"
    And I press the "Save" button
    Then I should not see "View video" in the "prisoner123" row
    When I click "Edit" in the "prisoner123" row
    And I check the box "View video"
    And I press the "Save" button
    Then I should see "View video" in the "prisoner123" row