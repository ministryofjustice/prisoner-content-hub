Feature: Video items
  As an Administrator
  I want to create/edit/delete video items
  So that prisoners can watch videos

  Background: 
    Given "moj_video_item" content:
      | title            | field_moj_description | field_moj_video                      |
      | First video item | The first video item  | file;placeholder.mp4;placeholder.mp4 |
    Given "moj_video_categories" terms:
      | name          |
      | test category |
    Given I am logged in as a user with the "administrator" role

    @api
    Scenario: Creating a video item
      And I should see the heading "First video item"
      And I should see the text "The first video item"
  
    @api @javascript
    Scenario: Creating a video item and adding a category
      When I am on "node/add/moj_video_item"
      And I fill in "Title" with "New video item"
      When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New video item description"
      And I attach the file "placeholder.mp4" to "Video"
      And I wait for AJAX to finish
      And I select the radio button "test category"
      And I press the "Save and publish" button
      Then I should see the text "Video item New video item has been created."
      Then I should see the text "test category"
  
    @api @javascript
    Scenario: Creating a video item with tags
      When I am on "node/add/moj_video_item"
      And I fill in "Title" with "New video item"
      When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New video item description"
      And I attach the file "placeholder.mp4" to "Video"
      And I wait for AJAX to finish
      And I fill in "Tags" with "Education"
      And I press the "Save and publish" button
      Then I should see the text "Video item New video item has been created."
      Then I should see the text "Education"
  
    @api @javascript
    Scenario: Editing video items
      When I am on "admin/content"
      And I click "Edit" in the "First video item" row
      And I fill in "Title" with "Updated title"
      And I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "Updated description"
      And I press the "Save and keep published" button
      Then I should see the text "Video item Updated title has been updated"
      And I should see the link "Updated title"
  
    @api
    Scenario: Deleting video items
      When I am on "admin/content"
      And I click "Delete" in the "First video item" row
      And I press the "Delete" button
      Then I should see the text "The video item First video item has been deleted"
  
    @api
    Scenario: Creating a video item without uploading a video
      When I am on "node/add/moj_video_item"
      And I fill in "Title" with "New video item"
      And I press the "Save and publish" button
      Then I should see the text "Video field is required"
  
    @api @javascript
    Scenario: Creating a video item without a title
      When I am on "node/add/moj_video_item"
      And I fill in "Title" with ""
      And I wait for AJAX to finish
      And I press the "Save and publish" button
      Then I should see the text "Create Video item"
  
    @api @javascript
    Scenario: Adding incorrect subtitle file type
      When I am on "node/add/moj_video_item"
      And I wait for AJAX to finish
      And I attach the file "placeholder.mp4" to "Subtitles"
      And I wait for AJAX to finish
      Then I should see the text "Only files with the following extensions are allowed: vtt."
  
    @api @javascript
    Scenario: Adding incorrect video file type
      When I am on "node/add/moj_video_item"
      And I attach the file "Tessitura.mp3" to "Video"
      And I wait for AJAX to finish
      Then I should see the text "Only files with the following extensions are allowed: mp4 ogv webm."
  @api @javascript
  Scenario: Video duration field is hidden
    When I am on "node/add/moj_video_item"
    Then I should not see the text "Duration"

  @api @javascript
  Scenario: Video duration field is automatically populated
    When I am on "node/add/moj_video_item"
    And I fill in "Title" with "New video item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New video item description"
    And I attach the file "placeholder.mp4" to "Video"
    And I wait for AJAX to finish
    And I select the radio button "test category"
    And I press the "Save and publish" button
    Then I should see the text "Video item New video item has been created."
    Then I should see the text "test category"    
    Then I should not see the text "Unable to retrieve video duration"