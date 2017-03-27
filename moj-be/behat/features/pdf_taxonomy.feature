 Feature: PDF Taxonomy
  As an Administrator
  I want to create/edit/delete the PDF taxonomy
  So that administrators can create PDF taxonomy categories

  Background: 
    Given "moj_pdf_categories" terms:
      | name          | description      | field_moj_pdf_additional_desc |
      | test category | test description |   test additional description | 
    Given I am logged in as a user with the "administrator" role

  @javascript @api
  Scenario: Viewing a PDF taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    Then I should see the text "test category"

  @javascript @api
  Scenario: Editing PDF taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Edit" in the "test category" row
    And I fill in "Name" with "Test PDF Category"
    And I press the "Save" button
    Then I should see the text "Updated term Test PDF Category"

  @api
  Scenario: Deleting PDF taxonomy term
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Delete" in the "test category" row
    Then I should see the text "Are you sure you want to delete the taxonomy term test category"
    And I press the "Delete" button
    Then I should see the text "Deleted term test category"

  @javascript @api
  Scenario: Creating a PDF taxonomy without a required field
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Edit" in the "test category" row
    And I fill in "Name" with " "
    And I press the "Save" button
    Then I should see the text "field is required"

  @javascript @api
  Scenario: Uploading a non-image file to PDF category banner field
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Edit" in the "test category" row
    And I attach the file "Tessitura.mp3" to "PDF category banner"
    And I wait for AJAX to finish
    Then I should see the text "Only files with the following extensions are allowed: png gif jpg jpeg."

  @api @javascript
  Scenario: Uploading a PDF Category Banner
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Edit" in the "test category" row
    And I attach the file "TestImage.png" to "PDF category banner"
    And I wait for AJAX to finish
    Then I should see the text "TestImage.png"

  @api @javascript
  Scenario: Creating a new PDF category
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/add"
    And I fill in "Name" with "Test PDF Category"
    When I fill in the "edit-field-moj-pdf-additional-desc-0-value" WYSIWYG editor with "New description"    
    And I press the "Save" button
    Then I should see the text "Created new term Test PDF Category"
    When I am on "admin/structure/taxonomy/manage/moj_pdf_categories/overview"
    And I click "Edit" in the "Test PDF Category" row
    Then I should see the text "Test PDF Category"
