Feature: Feedback Form
  As a centeral administrator
  I want to be able to view submitted feedback from the web application and see a prisoners location via their ID
  As a prisoner
  I want to create and submit a feedback form

  Background: 
    Given I am logged in as a user with the "administrator" role
    Given prisons:
      | name       | code |
      | HMP Durham | DUR  |
    Given users:
      | name      | status | field_related_prisons | role     |
      | prisoner3 | 1      | HMP Durham            | Prisoner |

  ###############First Test is waiting on prisoner set-up###############
  @api @javascript @feedbackform
  Scenario: As a prisoner fill in a feedback form which then should give the admin the
    prisoners location

    Given I am logged in as "prisoner3"
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Feedback title"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test prisoner Id check"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Given I am logged in as a user with the "administrator" role
    When I am on "admin/reports/feedback"
    Then I should see the text "HMP Durham"

  @api @javascript @feedbackform
  Scenario: When a user does not enter any text into the Subject field then a prompt will display
    'Subject field is required to continue'

    When I am on "contact/web_application_feedback"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test prisoner subject field required"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Feedback Form"

  @api @javascript @feedbackform
  Scenario: When a user does not enter any text into the Feedback Type then a prompt will display
    'Feedback Type is required to continue'

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Feedback title"
    And I fill in "Message" with "This is a test message designed to test prisoner Feedback type required"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Feedback Form"

  @api @javascript @feedbackform
  Scenario: When a user does not enter any text into the Message field then a prompt will display
    'Message field is required to continue'

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Feedback title"
    And I select "Comment" from "Feedback Type"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Feedback Form"

  @api @javascript @feedbackform
  Scenario: Feedback Form is completed with every field and is successfully sent and displayed

    When I am on "/contact/web_application_feedback"
    And I fill in "Subject" with "Complaint1"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message entered."
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    When I am on "admin/reports/feedback"
    Then I should see the text "Feedback Messages"
    Then I should see the text "Complaint1"
    Then I should see the text "Comment"
    And I click "View" in the "Complaint1" row
    Then I should see the text "This is a test message entered."

  @api @javascript @feedbackform
  Scenario: When viewing feedback forms, filter by Feedback Type is working correctly when selected comment

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Comment Title 1"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Comment Title 2"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Question title"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Then I am on "admin/reports/feedback"
    And I select "Comment" from "Feedback Type"
    And I press the "Apply" button
    Then I should see the text "Comment Title 1"
    Then I should see the text "Comment Title 2"
    And I should not see the text "Question title"

  @api @javascript @feedbackform
  Scenario: When viewing feedback forms, filter by Feedback Type is working correctly when selected report

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Report Title 1"
    And I select "Report" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Report Title 2"
    And I select "Report" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Question title"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Then I am on "admin/reports/feedback"
    And I select "Report" from "Feedback Type"
    And I press the "Apply" button
    Then I should see the text "Report Title 1"
    Then I should see the text "Report Title 2"
    And I should not see the text "Question title"

  @api @javascript @feedbackform
  Scenario: When viewing feedback forms, filter by Feedback Type is working correctly when selected Question

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Question Title 1"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Question Title 2"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Other title"
    And I select "Other" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Then I am on "admin/reports/feedback"
    And I select "Question" from "Feedback Type"
    And I press the "Apply" button
    Then I should see the text "Question Title 1"
    Then I should see the text "Question Title 2"
    And I should not see the text "Other title"

  @api @javascript @feedbackform
  Scenario: When viewing feedback forms, filter by Feedback Type is working correctly when selected Other

    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Other Title 1"
    And I select "Other" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Other Title 2"
    And I select "Other" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Question title"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering feedback forms"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Then I am on "admin/reports/feedback"
    And I select "Other" from "Feedback Type"
    And I press the "Apply" button
    Then I should see the text "Other Title 1"
    Then I should see the text "Other Title 2"
    And I should not see the text "Question title"

  @api @javascript @feedbackform
  Scenario: Filter by Prisons is working correctly when viewing feedback forms
  
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Prisoner Title 1"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering prisons"
    And I fill in "Prison" with "Wayland HMP"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Prisoner Title 2"
    And I select "Comment" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering prisons"
    And I fill in "Prison" with "Swansea"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    When I am on "contact/web_application_feedback"
    And I fill in "Subject" with "Prisoner Title 3"
    And I select "Question" from "Feedback Type"
    And I fill in "Message" with "This is a test message designed to test filtering prisons"
    And I fill in "Prison" with "Wayland HMP"
    Then I press the "Send message" button
    Then I wait for AJAX to finish
    Then I should see the text "Your message has been sent."
    Then I am on "admin/reports/feedback"
    And I fill in "Prison" with "Wayland HMP"
    And I press the "Apply" button
    Then I should see the text "Prisoner Title 1"
    Then I should see the text "Prisoner Title 3"
    And I should not see the text "Prisoner Title 2"


  @api @javascript @feedbackform
  Scenario: When a user does not have the permissons to view the feedback form submissions

    Given I am logged in as a user with the "Local Administrator" role
    When I am on "admin/reports/feedback"
    Then I should see the text "Access denied"