Feature: Associating content with Prisons
  As an Administrator
  I want to associate content with prisons

  @api @prisons
  Scenario: Related prisons should pre-populate with users prisons
    Given prisons:
      | name     | code |
      | Prison 1 | PR1  |
    And users:
      | name   | roles               |
      | ladmin | local_administrator |
    And user "ladmin" is associated with prison "Prison 1"
    And I am logged in as "ladmin"
    When I am on "node/add/moj_radio_item"
    Then the "edit-field-related-prisons-0-target-id" field should match "/Prison 1/"

  @api @prisons
  Scenario: Local admins should only be able to edit radio content for their prisons
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
      | ladmin2 | local_administrator |
    And "moj_radio_item" content:
      | title         | field_moj_description      |
      | Local radio 1 | The first item description |
    And "moj_radio_item" content:
      | title         | field_moj_description      |
      | Local radio 2 | The first item description |
    And user "ladmin1" is associated with prison "Prison 1"
    And user "ladmin2" is associated with prison "Prison 2"
    And node "Local radio 1" is associated with prison "Prison 1"
    And node "Local radio 2" is associated with prisons "Prison 1;Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Local radio 1"
    Given I click "Edit" in the "Local radio 1" row
    Then I should see the heading "Edit Radio item Local radio 1"
    When I am on "admin/content"
    Then I should see the link "Local radio 2"
    Given I click "Edit" in the "Local radio 2" row
    Then I should see the heading "Edit Radio item Local radio 2"
    Given I am logged in as "ladmin2"
    When I am on "admin/content"
    Then I should not see the link "Local radio 1"
    Then I should see the link "Local radio 2"
    Given I click "Edit" in the "Local radio 2" row
    Then I should see the heading "Edit Radio item Local radio 2"

  @api @prisons
  Scenario: Local admins should only be able to edit video content for their prisons
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
      | ladmin2 | local_administrator |
    And "moj_video_item" content:
      | title         | field_moj_description      |
      | Local video 1 | The first item description |
    And "moj_video_item" content:
      | title         | field_moj_description      |
      | Local video 2 | The first item description |
    And user "ladmin1" is associated with prison "Prison 1"
    And user "ladmin2" is associated with prison "Prison 2"
    And node "Local video 1" is associated with prison "Prison 1"
    And node "Local video 2" is associated with prisons "Prison 1;Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Local video 1"
    Given I click "Edit" in the "Local video 1" row
    Then I should see the heading "Edit Video item Local video 1"
    When I am on "admin/content"
    Then I should see the link "Local video 2"
    Given I click "Edit" in the "Local video 2" row
    Then I should see the heading "Edit Video item Local video 2"
    Given I am logged in as "ladmin2"
    When I am on "admin/content"
    Then I should not see the link "Local video 1"
    Then I should see the link "Local video 2"
    Given I click "Edit" in the "Local video 2" row
    Then I should see the heading "Edit Video item Local video 2"

  @api @prisons
  Scenario: Local admins should only be able to edit PDF content for their prisons
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
      | ladmin2 | local_administrator |
    And "moj_pdf_item" content:
      | title       | field_moj_description      |
      | Local PDF 1 | The first item description |
    And "moj_pdf_item" content:
      | title       | field_moj_description      |
      | Local PDF 2 | The first item description |
    And user "ladmin1" is associated with prison "Prison 1"
    And user "ladmin2" is associated with prison "Prison 2"
    And node "Local PDF 1" is associated with prison "Prison 1"
    And node "Local PDF 2" is associated with prisons "Prison 1;Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Local PDF 1"
    Given I click "Edit" in the "Local PDF 1" row
    Then I should see the heading "Edit PDF item Local PDF 1"
    When I am on "admin/content"
    Then I should see the link "Local PDF 2"
    Given I click "Edit" in the "Local PDF 2" row
    Then I should see the heading "Edit PDF item Local PDF 2"
    Given I am logged in as "ladmin2"
    When I am on "admin/content"
    Then I should not see the link "Local PDF 1"
    Then I should see the link "Local PDF 2"
    Given I click "Edit" in the "Local PDF 2" row
    Then I should see the heading "Edit PDF item Local PDF 2"

  #  @api @prisons
  #  Scenario: Local admins should only be able to edit News content for their prisons
  #    Given prisons:
  #      | name     | code |
  #      | prison 1 | PR1  |
  #      | prison 2 | PR2  |
  #    And users:
  #      | name    | roles               |
  #      | ladmin1 | local_administrator |
  #      | ladmin2 | local_administrator |
  #    And "moj_news_item" content:
  #      | title        | body                       |
  #      | Local News 1 | The first item description |
  #    And "moj_news_item" content:
  #      | title        | body                       |
  #      | Local News 2 | The first item description |
  #    And user "ladmin1" is associated with prison "Prison 1"
  #    And user "ladmin2" is associated with prison "Prison 2"
  #    And node "Local News 1" is associated with prison "Prison 1"
  #    And node "Local News 2" is associated with prisons "Prison 1;Prison 2"
  #    Given I am logged in as "ladmin1"
  #    When I am on "admin/content"
  #    Then I should see the link "Local News 1"
  #    Given I click "Edit" in the "Local News 1" row
  #    Then I should see the heading "Edit News item Local News 1"
  #    When I am on "admin/content"
  #    Then I should see the link "Local News 2"
  #    Given I click "Edit" in the "Local News 2" row
  #    Then I should see the heading "Edit News item Local News 2"
  #    Given I am logged in as "ladmin2"
  #    When I am on "admin/content"
  #    Then I should not see the link "Local News 1"
  #    Then I should see the link "Local News 2"
  #    Given I click "Edit" in the "Local News 2" row
  #    Then I should see the heading "Edit News item Local News 2"
  @api @prisons @javascript
  Scenario: Local admins should only be able to edit global radio content related to their prison(s)
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
    And "moj_radio_item" content:
      | title          | field_moj_description      | field_is_global_content |
      | Global radio 1 | The first item description | 1                       |
    And "moj_radio_item" content:
      | title          | field_moj_description      | field_is_global_content |
      | Global radio 2 | The first item description | 1                       |
    And user "ladmin1" is associated with prison "Prison 1"
    And node "Global radio 1" is associated with prison "Prison 1"
    And node "Global radio 2" is associated with prisons "Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Global radio 1"
    Given I click "Edit" in the "Global radio 1" row
    Then I should see the heading "Edit Radio item Global radio 1"
    When I am on "admin/content"
    Then I should not see the text "Edit" in the "Global radio 2" row

  @api @prisons @javascript
  Scenario: Local admins should only be able to edit global video content related to their prison(s)
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
    And "moj_video_item" content:
      | title          | field_moj_description      | field_is_global_content |
      | Global video 1 | The first item description | 1                       |
    And "moj_video_item" content:
      | title          | field_moj_description      | field_is_global_content |
      | Global video 2 | The first item description | 1                       |
    And user "ladmin1" is associated with prison "Prison 1"
    And node "Global video 1" is associated with prison "Prison 1"
    And node "Global video 2" is associated with prisons "Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Global video 1"
    Given I click "Edit" in the "Global video 1" row
    Then I should see the heading "Edit Video item Global video 1"
    When I am on "admin/content"
    Then I should not see the text "Edit" in the "Global video 2" row

  @api @prisons @javascript
  Scenario: Local admins should only be able to edit global PDF content related to their prison(s)
    Given prisons:
      | name     | code |
      | prison 1 | PR1  |
      | prison 2 | PR2  |
    And users:
      | name    | roles               |
      | ladmin1 | local_administrator |
    And "moj_pdf_item" content:
      | title        | field_moj_description      | field_is_global_content |
      | Global PDF 1 | The first item description | 1                       |
    And "moj_pdf_item" content:
      | title        | field_moj_description      | field_is_global_content |
      | Global PDF 2 | The first item description | 1                       |
    And user "ladmin1" is associated with prison "Prison 1"
    And node "Global PDF 1" is associated with prison "Prison 1"
    And node "Global PDF 2" is associated with prisons "Prison 2"
    Given I am logged in as "ladmin1"
    When I am on "admin/content"
    Then I should see the link "Global PDF 1"
    Given I click "Edit" in the "Global PDF 1" row
    Then I should see the heading "Edit PDF item Global PDF 1"
    When I am on "admin/content"
    Then I should not see the text "Edit" in the "Global PDF 2" row
