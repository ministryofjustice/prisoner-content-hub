Feature: FAQ items
  As an Administrator
  I want to create/edit/delete faq items
  So that prisoners can find answers to frequently asked questions
#
#Background:
#Given "moj_faq_item" content:
# | title            | field_moj_description | 
# | First item | The first faq item  |
#
# Given "moj_faq_categories" terms:
#    | name |
#   | test category |
#  Given I am logged in as a user with the "administrator" role
#
#@javascript @api
#Scenario: Creating a FAQ item
#And I should see the heading "First item"
#And I should see the text "The first faq item"
#
#
#@api @javascript
#Scenario: Editing FAQ Items
#When I am on "admin/content"
#And I click "Edit" in the "First item" row
#And I fill in "Title" with "Updated title"
#And I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "Updated description"
#And I press the "Save and keep published" button
#Then I should see the text "faq item Updated title has been updated"
#And I should see the link "Updated title"
#
#
#@api
#Scenario: Deleting FAQ Items
#When I am on "admin/content"
#And I click "Delete" in the "First item" row
#And I press the "Delete" button
#Then I should see the text "The faq item First item has been deleted"
#
#
#@api @javascript
# Scenario: Creating a faq item without a title
# When I am on "node/add/moj_faq_item"
# And I fill in "Title" with ""
# When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New faq item description"           
# And I press the "Save and publish" button
# Then I should see the text "Create FAQ item"
#
#
#@api @javascript
# Scenario: Creating a faq item without a description
#When I am on "node/add/moj_faq_item"        
#And I fill in "Title" with "New title"
#When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with ""      
#And I press the "Save and publish" button
#Then I should see the text "Create FAQ item"
#
#
# @api @javascript
#  Scenario: Creating a faq item and adding a category
#    When I am on "node/add/moj_faq_item"
#    And I fill in "Title" with "New faq item"     
#    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New faq item description"   
#    And I select the radio button "test category"
#    And I press the "Save and publish" button
#    Then I should see the text "FAQ item New faq item has been created."
#    Then I should see the text "test category"
#
#
#
#@api @javascript
#  Scenario: Creating a faq item with tags
#    When I am on "node/add/moj_faq_item"
#    And I fill in "Title" with "New faq item"
#    When I fill in the "edit-field-moj-description-0-value" WYSIWYG editor with "New faq item description"
#    And I fill in "Tags" with "Education"
#    And I press the "Save and publish" button
#    Then I should see the text "FAQ item New faq item has been created."
#    Then I should see the text "Education"
#
#
#@api 
#Scenario: Create a single FAQ term and verify they exist on FAQ screen
#Given "moj_faq_categories" terms:
#| name |
#| termname |
#When I am on "node/add/moj_faq_item"
#Then I should see the text "termname"
#
#
#@api 
#Scenario: Create multiple FAQ terms and verify that they exist on FAQ screen
#Given "moj_faq_categories" terms:
#| name |
#| term1 | 
#Given "moj_faq_categories" terms:
#| name |
#| term2 | 
#Given "moj_faq_categories" terms:
#| name |
#| term3 | 
#When I am on "node/add/moj_faq_item"
#Then I should see the text "term1"
#Then I should see the text "term2"
#Then I should see the text "term3"
#
#
