Feature: PDF items
  As an Administrator
  I want to create/edit/delete PDF items
  So that prisoners can view pdfs

  Background: 
    Given "moj_pdf_item" content:
      | title          | description | field_moj_pdf_additional_desc | field_moj_pdf                  |
      | First pdf item | dummyPDF    | The first pdf item            | file;dummyPDF.pdf;dummyPDF.pdf |
    Given "moj_pdf_categories" terms:
      | name          |
      | test category |
    Given I am logged in as a user with the "administrator" role

  @api @javascript
  Scenario: Creating a PDF items
    And I should see the heading "First pdf item"
    And I should see the text "dummyPDF"

  @javascript @api
  Scenario: Editing PDF items
    When I am on "admin/content"
    And I click "Edit" in the "First pdf item" row
    And I fill in "Title" with "Updated title"
    And I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "Updated description"
    And I press the "Save and keep published" button
    Then I should see the text "PDF item Updated title has been updated"
    And I should see the link "Updated title"

  @api
  Scenario: Deleting PDF items
    When I am on "admin/content"
    And I click "Delete" in the "First pdf item" row
    And I press the "Delete" button
    Then I should see the text "The PDF item First pdf item has been deleted"

  @api @javascript
  Scenario: Creating a PDF item without uploading a PDF
    When I am on "node/add/moj_pdf_item"
    And I fill in "Title" with "New pdf item"
    And I attach the file "" to "PDF"
    And I press the "Save and publish" button
    Then I should see the text "PDF field is required"

  @api @javascript
  Scenario: Uploading a non-pdf file to PDF field
    When I am on "node/add/moj_pdf_item"
    And I attach the file "Tessitura.mp3" to "PDF"
    And I wait for AJAX to finish
    Then I should see the text "Only files with the following extensions are allowed: pdf."

  @api @javascript
  Scenario: Creating a pdf item with tags
    When I am on "node/add/moj_pdf_item"
    And I fill in "Title" with "New pdf item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New pdf item description"
    And I attach the file "dummyPDF.pdf" to "PDF"
    And I wait for AJAX to finish
    And I fill in "Tags" with "English"
    And I press the "Save and publish" button
    Then I should see the text "PDF item New pdf item has been created."
    Then I should see the text "English"

  @api @javascript
  Scenario: Creating a pdf item and adding a category
    When I am on "node/add/moj_pdf_item"
    And I fill in "Title" with "New pdf item"
    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New pdf item description"
    And I attach the file "dummyPDF.pdf" to "PDF"
    And I select the radio button "test category"
    And I press the "Save and publish" button
    Then I should see the text "PDF item New pdf item has been created."
    Then I should see the text "test category"
