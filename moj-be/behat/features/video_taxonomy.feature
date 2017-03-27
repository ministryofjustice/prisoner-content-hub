 Feature: Video Taxonomy
  As an Administrator
  I want to create/edit/delete the Video taxonomy
  So that administrators can create Video taxonomy categories

Background:
    Given "moj_video_categories" terms:
    | name          |  Description      | field_landing_page_exist  | field_info              |
    | test category |  Test description | 0                         | Test more description   |
  Given I am logged in as a user with the "administrator" role

@api @javascript
  Scenario: Viewing a video taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    Then I should see the text "test category"

@api @javascript
  Scenario: Editing video item taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    And I click "Edit" in the "test category" row
    And I fill in "Name" with "Test video category"
    And I press the "Save" button 
    Then I should see the text "Updated term Test video category" 

@api @javascript
  Scenario: Updating taxonomy to be a channel landing page
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    And I click "Edit" in the "test category" row
    And I check "Landing page exists" 
    When I fill in the "edit-field-info-0-value" WYSIWYG editor with "Channel info"
    And I attach the file "placeholder.mp4" to "Channel landing page video"
    And I wait for AJAX to finish
    And I press the "Save" button 
    Then I should see the text "Updated term test category"
    And I click "Edit" in the "test category" row
    Then I should see the text "placeholder.mp4"
    And the "Landing page exists" checkbox should be checked
    
@api
  Scenario: Deleting the video taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    And I click "Delete" in the "test category" row
    Then I should see the text "Are you sure you want to delete the taxonomy term test category?"
    And I press the "Delete" button
    Then I should see the text "Deleted term test category"
 
@javascript @api
 Scenario: Uploading an image file to the Thumbnail for the channel video field
   When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
   And I click "Edit" in the "test category" row
   And I attach the file "TestImage.png" to "Thumbnail for the channel video"
   And I wait for AJAX to finish
   Then I should see the text "TestImage.png"

@javascript @api
 Scenario: Uploading a non-image file to the Thumbnail for the channel video field
   When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
   And I click "Edit" in the "test category" row
   And I attach the file "placeholder.mp4" to "Thumbnail for the channel video"
   And I wait for AJAX to finish
   Then I should see the text "Only files with the following extensions are allowed: png gif jpg jpeg."

@javascript @api
 Scenario: Uploading a non-video file to "Channel landing page video"
   When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
   And I click "Edit" in the "test category" row
   And I attach the file "Tessitura.mp3" to "Channel landing page video"
   And I wait for AJAX to finish
   Then I should see the text "Only files with the following extensions are allowed: mp4 ogv webm."

  @api @javascript
  Scenario: Creating a new Video category which is a channel
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/add"
    And I fill in "Name" with "Test Video Category Channel"
    And I check "Landing page exists" 
    When I fill in the "edit-field-info-0-value" WYSIWYG editor with "Channel info"
    And I attach the file "placeholder.mp4" to "Channel landing page video"
    And I wait for AJAX to finish
    And I press the "Save" button
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    And I click "Edit" in the "Test Video Category Channel" row
    Then I should see the text "Test Video Category Channel"
    Then I should see the text "placeholder.mp4"
    And the "Landing page exists" checkbox should be checked

  @api @javascript
  Scenario: Creating a new Video category which is not a channel
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/add"
    And I fill in "Name" with "Test Video Category"
    And I press the "Save" button
    When I am on "admin/structure/taxonomy/manage/moj_video_categories/overview"
    And I click "Edit" in the "Test Video Category" row
    Then I should see the text "Test Video Category"
    And the "Landing page exists" checkbox should not be checked