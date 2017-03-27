Feature: Video collections
  As an Administrator
  I want to create/edit/delete video collections
  So that prisoners can browse collections of videos
#
#  @javascript @api
#  Scenario: Creating a video collection
#    Given I am logged in as an "Administrator"
#    Given "moj_video_item" content:
#      | title            | field_moj_description | field_moj_video                      |
#      | First video item | The first video item  | file;placeholder.mp4;placeholder.mp4 |
#    Given "moj_video_item" content:
#      | title             | field_moj_description | field_moj_video                      |
#      | Second video item | The second video item | file;placeholder.mp4;placeholder.mp4 |
#    When I am on "node/add/moj_video_collection"
#    And I fill in "Title" with "New video collection"
#    And I fill in "Video" with "First video item"
#    And I press the 'Add another item' button
#    And I wait for AJAX to finish
#    And I fill in "field_moj_videos[1][target_id]" with "Second video item"
#    And I press the "Save and publish" button
#    Then I should see the text "Video collection New video collection has been created."
#    And I should see the heading "New video collection"
#    And I should see the text "First video item"
#    And I should see the text "Second video item"
#
#  @javascript @api
#  Scenario: Editing video collections
#    Given "moj_video_item" content:
#      | title            | field_moj_description | field_moj_video                      |
#      | First video item | The first video item  | file;placeholder.mp4;placeholder.mp4 |
#    Given "moj_video_collection" content:
#      | title                  | field_moj_videos |
#      | First video collection | First video item |
#    And I am logged in as a user with the "administrator" role
#    When I am on "admin/content"
#    And I click "Edit" in the "First video collection" row
#    And I fill in "Title" with "Updated title"
#    And I press the "Save and keep published" button
#    Then I should see the text "Video collection Updated title has been updated"
#    And I should see the link "Updated title"
#
#  @api
#  Scenario: Deleting video collections
#    Given "moj_video_item" content:
#      | title      | field_moj_description |
#      | First item | The first video item  |
#    Given "moj_video_collection" content:
#      | title                  | field_moj_videos |
#      | First video collection | First item       |
#    And I am logged in as a user with the "administrator" role
#    When I am on "admin/content"
#    And I click "Delete" in the "First video collection" row
#    And I press the "Delete" button
#    Then I should see the text "The Video collection First video collection has been deleted."