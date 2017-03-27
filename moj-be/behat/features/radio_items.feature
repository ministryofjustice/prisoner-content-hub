Feature: Radio items
  As an Administrator
  I want to create/edit/delete radio items
  So that prisoners can listen to pre-recorded shows

  Background: 
    Given "moj_radio_item" content:
      | title      | field_moj_description      | field_moj_audio                  |
      | First item | The first item description | file;Tessitura.mp3;Tessitura.mp3 |
    Given "moj_radio_categories" terms:
      | name          |
      | test category |
    Given I am logged in as a user with the "administrator" role

  @api
  Scenario: Creating a radio item
    And I should see the heading "First item"
    And I should see the text "The first item description"

  @api
  Scenario: Editing radio items
    When I am on "admin/content"
    And I click "Edit" in the "First item" row
    And I fill in the following:
      | Title       | Updated title       |
      | Description | Updated description |
    And I press the "Save and keep published" button
    Then I should see the text "Radio item Updated title has been updated"
    And I should see the link "Updated title"

  @api
  Scenario: Deleting radio items
    When I am on "admin/content"
    And I click "Delete" in the "First item" row
    And I press the "Delete" button
    Then I should see the text "The Radio item First item has been deleted"

  @api @javascript
  Scenario: Create radio item without uploading required audio file
    When I am on "node/add/moj_radio_item"
    And I fill in "Title" with "New radio item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New radio item description"
    And I press the "Remove" button
    And I wait for AJAX to finish
    And I press the "Save and publish" button
    Then I should see the text "Audio field is required"

  @api @javascript
  Scenario: Creating a radio item with tags
    When I am on "node/add/moj_radio_item"
    And I fill in "Title" with "New radio item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New radio item description"
    And I attach the file "Tessitura.mp3" to "Audio"
    And I wait for AJAX to finish
    And I fill in "Tags" with "Maths"
    And I press the "Save and publish" button
    Then I should see the text "Radio item New radio item has been created."
    Then I should see the text "Maths"

  @api @javascript
  Scenario: Creating a radio item with the incorrect audio file type
    When I am on "node/add/moj_radio_item"
    And I attach the file "placeholder.mp4" to "Audio"
    And I wait for AJAX to finish
    And I should see the text "Only files with the following extensions are allowed: mp3 m4a ogg."

  @api @javascript
  Scenario: Adding thumbnail with incorrect file type
    When I am on "node/add/moj_radio_item"
    And I attach the file "opensource.tif" to "Thumbnail image"
    And I wait for AJAX to finish
    And I should see the text "Only files with the following extensions are allowed: png gif jpg jpeg."

  @api @javascript
  Scenario: Creating a radio item and adding a category
    When I am on "node/add/moj_radio_item"
    And I fill in "Title" with "New radio item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New radio item description"
    And I attach the file "Tessitura.mp3" to "Audio"
    And I wait for AJAX to finish
    And I select the radio button "test category"
    And I press the "Save and publish" button
    Then I should see the text "Radio item New radio item has been created."
    Then I should see the text "test category"

  @api @javascript
  Scenario: Radio duration field is hidden
    When I am on "node/add/moj_radio_item"
    Then I should not see the text "Duration"

  @api @javascript
  Scenario: Radio duration field is automatocally populated
    When I am on "node/add/moj_radio_item"
    And I fill in "Title" with "New radio item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New radio item description"
    And I attach the file "Tessitura.mp3" to "Audio"
    And I wait for AJAX to finish
    And I select the radio button "test category"
    And I press the "Save and publish" button
    Then I should see the text "Radio item New radio item has been created."
    Then I should see the text "test category"
    Then I should not see the text "Unable to retrieve radio duration"

@api @javascript
  Scenario: Creating radio item without the description 
    When I am on "node/add/moj_radio_item"
    And I fill in "Title" with "New test radio item"
    And I attach the file "Tessitura.mp3" to "Audio"
    And I wait for AJAX to finish
    And I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with ""
    And I press the "Save and publish" button
    Then I should not see "Description field is required"
    Then I should see "Radio item New test radio item has been created."