Feature: Translations
  As a content editor
  I want to be able to publish content in multiple languages
  So that users can view content in multuple languages

  Background: 
    Given "moj_radio_item" content:
      | title            | field_moj_description      | field_moj_audio                  |
      | First radio item | The first item description | file;Tessitura.mp3;Tessitura.mp3 |
    Given "moj_video_item" content:
      | title            | field_moj_description            | field_moj_video                      |
      | First video item | The first video item description | file;placeholder.mp4;placeholder.mp4 |
#    Given "moj_faq_item" content:
#      | title          | field_moj_description          |
#      | First faq item | The first faq item description |
    Given "moj_pdf_item" content:
      | title          | field_moj_description          | field_moj_pdf                  |
      | First pdf item | The first pdf item description | file;dummyPDF.pdf;dummyPDF.pdf |
#    Given "moj_video_collection" content:
#      | title                  | field_moj_videos |
#      | First video collection | First video item |
    Given the following languages are available:
      | languages |
      | fr        |
    Given I am logged in as a user with the "administrator" role

  @api
  Scenario: Adding a new language
    When I am on "admin/config/regional/language"
    And I click "Add language"
    When I select "Italian" from "edit-predefined-langcode"
    And I press the "Add language" button
    Then I should see "The language Italian has been created and can now be used."

  @api
  Scenario: Deleting a language
    When I am on "admin/config/regional/language"
    And I click "Delete" in the "Italian" row
    And I press the "Delete" button
    Then I should see "The Italian (it) language has been removed."

  @api
  Scenario: Translating a radio item
    When I am on "admin/content"
    And I click "Translate" in the "First radio item" row
    And I click "Add" in the "French" row
    And I fill in the following:
      | Title       | First radio item - French                 |
      | Description | The first radio item description - French |
    And I press the "Save and keep published (this translation)" button
    Then I should see "Radio item First Radio item - French has been updated."
    Then I should see "First Radio item - French"
    Then I should see "The first radio item description - French"

  @api
  Scenario: Translating a video item
    When I am on "admin/content"
    And I click "Translate" in the "First video item" row
    And I click "Add" in the "French" row
    And I fill in the following:
      | Title       | First video item - French                 |
      | Description | The first video item description - French |
    And I press the "Save and keep published (this translation)" button
    Then I should see "Video item First Video item - French has been updated."
    Then I should see "First Video item - French"
    Then I should see "The first video item description - French"

#  @api
#  Scenario: Translating a faq item
#    When I am on "admin/content"
#    And I click "Translate" in the "First faq item" row
#    And I click "Add" in the "French" row
#    And I fill in the following:
#      | Title       | First faq item - French                 |
#      | Description | The first faq item description - French |
#    And I press the "Save and keep published (this translation)" button
#    Then I should see "FAQ item First faq item - French has been updated."
#    Then I should see "First faq item - French"
#    Then I should see "The first faq item description - French"

#

#  @api
#  Scenario: Translating a video collection
#    When I am on "admin/content"
#    And I click "Translate" in the "First video collection" row
#    And I click "Add" in the "French" row
#    And I fill in the following:
#      | Title | First video collection - French |
#    And I press the "Save and keep published (this translation)" button
#    Then I should see "Video collection First video collection - French has been updated."
#    Then I should see "First Video collection - French"