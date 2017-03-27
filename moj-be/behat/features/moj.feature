Feature: Moj module

  #  As a
  #  I want to
  #  So that
  #
  Background: 
    Given "moj_radio_categories" terms:
      | name                |
      | test radio category |
    Given "moj_video_categories" terms:
      | name                |
      | test video category |
    Given "moj_pdf_categories" terms:
      | name              |
      | test pdf category |
    Given I am logged in as a user with the "Local Content Manager" role

  @api @javascript
  Scenario: Local Content Manager accessing and editing pdf category
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    Then I should see the text "test pdf category"

  @api @javascript
  Scenario: Local Content Manager accessing and editing video category
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    Then I should see the text "test video category"

  @api @javascript
  Scenario: Local Content Manager accessing and editing radio category
    When I am on "admin/structure/taxonomy/manage/moj_radio_categories/overview"
    Then I should see the text "test radio category"

  @api @javascript
  Scenario: Local Content Manager creating content
    When I am on "/node/add"
    Then I should see the text "News item"
    Then I should see the text "PDF item"
    Then I should see the text "Radio item"

  @api @javascript
  Scenario: Non Local Content Manager accessing and editing video category
    Given I am logged in as a user with the "View video" role
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    Then I should see the text "access denied"

  @api @javascript
  Scenario: Non Local Content Manager accessing and editing radio category    
    Given I am logged in as a user with the "View video" role
    When I am on "admin/structure/taxonomy/manage/moj_radio_categories/overview"
    Then I should see the text "access denied"

  @api @javascript
  Scenario: Local Content Manager accessing and editing pdf category    
    Given I am logged in as a user with the "View video" role
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    Then I should see the text "access denied"

  @api @javascript
  Scenario: Non Local Content Manager creating content    
    Given I am logged in as a user with the "View video" role
    When I am on "/node/add"
    Then I should see the text "access denied"    