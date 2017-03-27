Feature: Archive Module
  As an Administrator
  I want to be able to archive and un-archive content
  So that content can be archived
#
#  Background: 
#    Given "moj_radio_item" content:
#      | title      | field_moj_description              | field_moj_audio                  |
#      | Radio item | The first archive item description | file;Tessitura.mp3;Tessitura.mp3 |
#    Given "moj_radio_item" content:
#      | title               | field_moj_description              | field_moj_audio                  | field_moj_archived |
#      | Archived radio item | The first archive item description | file;Tessitura.mp3;Tessitura.mp3 | 1                  |
#    Given "moj_faq_item" content:
#      | title    | field_moj_description |
#      | Faq item | The first faq item    |
#    Given "moj_faq_item" content:
#      | title    | field_moj_description | field_moj_archived |
#      | Archived faq item | The first faq item    | 1                  |
#    Given "moj_video_item" content:
#      | title      | field_moj_description | field_moj_video                      |
#      | Video item | The first video item  | file;placeholder.mp4;placeholder.mp4 |
#    Given "moj_video_item" content:
#      | title               | field_moj_description | field_moj_video                      | field_moj_archived |
#      | Archived video item | The first video item  | file;placeholder.mp4;placeholder.mp4 | 1                  |
#    Given "moj_pdf_item" content:
#      | title    | field_moj_description | field_moj_pdf                  |
#      | Pdf item | The first pdf item    | file;dummyPDF.pdf;dummyPDF.pdf |
#    Given "moj_pdf_item" content:
#      | title             | field_moj_description | field_moj_pdf                  | field_moj_archived |
#      | Archived pdf item | The first pdf item    | file;dummyPDF.pdf;dummyPDF.pdf | 1                  |
#    Given "article" content:
#      | title        |
#      | Article item |
#    Given I am logged in as a user with the "administrator" role
#
#  @api
#  Scenario: Archive radio
#    When I am on "admin/content"
#    And I click "Edit" in the "Radio item" row
#    And I press the "Archive" button
#    Then I should see "Radio item has been successfully archived"
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Radio item" row    
#    Then I should see the text "Not published"
#    And I should see the button "Unarchive"
#
#  @api
#  Scenario: Unarchive radio item    
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Archived radio item" row    
#    And I press the "Unarchive" button
#    Then I should see "Radio item has been successfully unarchived"
#    When I am on "admin/content"
#    And I click "Edit" in the "Archived radio item" row    
#    Then I should see the text "Published"
#    And I should see the button "Archive"
#
#  @api
#  Scenario: Archive FAQ item
#    When I am on "admin/content"
#    And I click "Edit" in the "Faq item" row
#    And I press the "Archive" button
#    Then I should see "Faq item has been successfully archived"
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Faq item" row
#    Then I should see "Not Published"    
#    And I should see the button "Unarchive"
#
#  @api
#  Scenario: Unarchive FAQ item
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Archived faq item" row
#    And I press the "Unarchive" button
#    Then I should see "Faq item has been successfully unarchived"
#    When I am on "admin/content"
#    And I click "Edit" in the "Archived faq item" row
#    Then I should see "Published"  
#    And I should see the button "Archive"
#
#  @api
#  Scenario: Archive Video item
#    When I am on "admin/content"
#    And I click "Edit" in the "Video item" row
#    And I press the "Archive" button
#    Then I should see "Video item has been successfully archived"
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Video item" row
#    Then I should see "Not Published"
#    And I should see the button "Unarchive"
#
#  @api
#  Scenario: Unarchive Video item
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Archived video item" row
#    And I press the "Unarchive" button
#    Then I should see "Archived video item has been successfully unarchived"
#    When I am on "admin/content"    
#    And I click "Edit" in the "Archived video item" row
#    Then I should see "Published"
#    And I should see the button "Archive"
#    
#
#  @api
#  Scenario: Archive PDF item
#    When I am on "admin/content"
#    And I click "Edit" in the "Pdf item" row
#    And I press the "Archive" button
#    Then I should see "Pdf item has been successfully archived"
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Pdf item" row
#    Then I should see "Not Published"
#    And I should see the button "Unarchive"
#
#  @api
#  Scenario: Unarchive PDF item
#    When I am on "admin/content/archived"
#    And I click "Edit" in the "Archived pdf item" row
#    And I press the "Unarchive" button
#    Then I should see "Pdf item has been successfully unarchived"
#    When I am on "admin/content"    
#    And I click "Edit" in the "Archived pdf item" row
#    Then I should see "Published"
#    And I should see the button "Archive"
#
#  @api
#  Scenario: Should not be able to Archive Article item
#    When I am on "admin/content"
#    And I click "Edit" in the "Article item" row
#    Then I should not see "Archive"