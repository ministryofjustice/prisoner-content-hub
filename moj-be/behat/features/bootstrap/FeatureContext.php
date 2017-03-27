<?php

use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Drupal\DrupalExtension\Hook\Scope\EntityScope;
use Drupal\DrupalExtension\Context\RawDrupalContext;
use Behat\Mink\Element\Element;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends RawDrupalContext implements Context, SnippetAcceptingContext
{

	protected $prisonIds = array();

	/**
	 * Initializes context.
	 *
	 * Every scenario gets its own context instance.
	 * You can also pass arbitrary arguments to the
	 * context constructor through behat.yml.
	 */
	public function __construct()
	{

	}

	/**
	 * Before nodeCreate check field value for file, if present create file and replace with fid
	 * Field should be in format 'file;__file_source__;__file_name_
	 * @beforeNodeCreate
	 */
	public function nodeCreateAlter(EntityScope $scope)
	{
		$node = $scope->getEntity();
		foreach ($node as $key => $value)
		{
			if (strpos($value, 'file;') !== FALSE)
			{
				$file_info = explode(';', $value);
				$file_source = file_get_contents("/opt/tests/files/" . $file_info[1]);
				$file_name = explode('.', $file_info[2]);
				$file = file_save_data($file_source, "public://$file_name[0]" . time() . "." . $file_name[1]);
				$fid = $file->id();
				$node->$key = $fid;
			}
		}
	}

	/**
	 * @AfterScenario @prisons
	 */
	public function cleanPrisons(AfterScenarioScope $scope)
	{
		entity_delete_multiple('prison', $this->prisonIds);
	}
     
        /**
        * @AfterScenario @feedbackform
        */
        public function cleanFeedbackforms(AfterScenarioScope $scope)
        {
            // Load all contact submissions
           $messages = entity_load_multiple('contact_message');
           
           // Delete them all
           foreach ($messages as $message) {
               $message->delete();
           }
        }
        
        /**
	 * @Given prisons:
	 */
	public function prisons(TableNode $prisons)
	{
		foreach ($prisons->getHash() as $prison)
		{
			$prison = (object) $prison;

			$entity = \Drupal::entityQuery('prison')
				->condition('name', $prison->name, '=')
				->condition('code', $prison->code, '=')
				->execute();

			if (empty($entity))
			{
				$entity = entity_create('prison', array('name' => $prison->name, 'code' => $prison->code));
				$entity->save();

				array_push($this->prisonIds, $entity->id());
			}
		}
	}

	/**
	 * Get the instance variable to use in Javascript.
	 *
	 * @param string
	 *   The instanceId used by the WYSIWYG module to identify the instance.
	 *
	 * @throws Exeception
	 *   Throws an exception if the editor doesn't exist.
	 *
	 * @return string
	 *   A Javascript expression representing the WYSIWYG instance.
	 */
	// TODO - These WYSIWYG functions should take a label and get the instance id based on that
	protected function getWysiwygInstance($instanceId)
	{
		$instance = "CKEDITOR.instances['$instanceId']";

		if (!$this->getSession()->evaluateScript("return !!$instance"))
		{
			throw new \Exception(sprintf('The editor "%s" was not found on the page %s', $instanceId, $this->getSession()->getCurrentUrl()));
		}

		return $instance;
	}

	/**
	 * @When /^I fill in the "([^"]*)" WYSIWYG editor with "([^"]*)"$/
	 */
	public function iFillInTheWysiwygEditor($instanceId, $text)
	{
		$instance = $this->getWysiwygInstance($instanceId);
		$this->getSession()->executeScript("$instance.setData(\"$text\");");
	}

	/**
	 * @Given user :arg1 is associated with prison :arg2
	 */
	public function userIsAssociatedWithPrison($userName, $prisonName)
	{
		$userQuery = \Drupal::entityQuery('user')
			->condition('name', $userName);

		$userIds = $userQuery->execute();

		if (count($userIds) <= 0) {
			throw new \Exception(sprintf('The user "%s" was not found.', $userName));
		}

		$userId = array_shift($userIds);
		$prisonQuery = \Drupal::entityQuery('prison')
			->condition('name', $prisonName);

		$prisonIds = $prisonQuery->execute();

		if (count($prisonIds) <= 0) {
			throw new \Exception(sprintf('The prison "%s" was not found.', $prisonName));
		}

		$prisonId = array_shift($prisonIds);

		$user = user_load($userId);

		if ($user) {
			$user->field_related_prisons->setValue(array($prisonId));
			$user->save();
		}
	}

	/**
	 * @Given node :arg1 is associated with prison(s) :arg2
	 */
	public function contentIsAssociatedWithPrison($nodeTitle, $prisonName)
	{
		$nodeQuery = \Drupal::entityQuery('node')
			->condition('title', $nodeTitle);

		$nodeIds = $nodeQuery->execute();

		if (count($nodeIds) <= 0) {
			throw new \Exception(sprintf('The node "%s" was not found.', $nodeTitle));
		}

		$nodeId = array_shift($nodeIds);
		$prisonName = explode(';', $prisonName);
		$prisonQuery = \Drupal::entityQuery('prison')
			->condition('name', $prisonName, 'IN');

		$prisonIds = $prisonQuery->execute();

		if (count($prisonIds) <= 0) {
			throw new \Exception(sprintf('The prison "%s" was not found.', $prisonName));
		}

		$node = node_load($nodeId);

		if ($node) {
			$related_prisons = $prisonIds;

			$node->field_related_prisons->setValue($related_prisons);
			$node->save();
		}
	}

	/**
	 * Checks, that form field with specified id|name|label|value matches the regex
	 *
	 * @Then /^the "(?P<field>(?:[^"]|\\")*)" field should match (?P<pattern>"(?:[^"]|\\")*")$/
	 */
	public function assertFieldMatches($field, $pattern)
	{
		$fieldNode = $this->assertSession()->fieldExists($field);
		$fieldValue = $fieldNode->getValue();

		$pattern = substr($pattern, 1, count($pattern) - 2);

		$matches = array();
		$match = preg_match($pattern, $fieldValue, $matches);

		assert($match, sprintf("Field value \"%s\" does not match pattern \"%s\"", $fieldValue, $pattern));
	}

	/**
	 * Retrieve a table row containing specified text from a given element.
	 *
	 * @param \Behat\Mink\Element\Element
	 * @param string
	 *   The text to search for in the table row.
	 *
	 * @return \Behat\Mink\Element\NodeElement
	 *
	 * @throws \Exception
	 */
	public function getTableRow(Element $element, $search) {
		$rows = $element->findAll('css', 'tr');
		if (empty($rows)) {
			throw new \Exception(sprintf('No rows found on the page %s', $this->getSession()->getCurrentUrl()));
		}
		foreach ($rows as $row) {
			if (strpos($row->getText(), $search) !== FALSE) {
				return $row;
			}
		}
		throw new \Exception(sprintf('Failed to find a row containing "%s" on the page %s', $search, $this->getSession()->getCurrentUrl()));
	}

	/**
	 * Find text in a table row containing given text.
	 *
	 * @Then I should not see (the text ):text in the ":rowText" row
	 */
	public function assertTextNotInTableRow($text, $rowText) {
		$row = $this->getTableRow($this->getSession()->getPage(), $rowText);
		if (strpos($row->getText(), $text) !== FALSE) {
			throw new \Exception(sprintf('Found a row containing "%s", but it also contained the text "%s".', $rowText, $text));
		}
	}

	/*
	Following rules from: https://gist.github.com/pbuyle/7698675
	
	Copyright (c) 2014 Pierre Buyle

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/

	/**
	 * Checks, that form element with specified label is visible on page.
	 *
	 * @Then /^(?:|I )should see an? "(?P<label>[^"]*)" form element$/
	 */
	public function assertFormElementOnPage($label) {
		$element = $this->getSession()->getPage();
		$nodes = $element->findAll('css', '.form-item label');
		foreach ($nodes as $node) {
			if ($node->getText() === $label) {
				if ($node->isVisible()) {
					return;
				}
				else {
					throw new \Exception("Form item with label \"$label\" not visible.");
				}
			}
		}
		throw new \Behat\Mink\Exception\ElementNotFoundException($this->getSession(), 'form item', 'label', $label);
	}

	/**
	 * Checks, that form element with specified label and type is visible on page.
	 *
	 * @Then /^(?:|I )should see an? "(?P<label>[^"]*)" (?P<type>[^"]*) form element$/
	 */
	public function assertTypedFormElementOnPage($label, $type) {
		$container = $this->getSession()->getPage();
		$pattern = '/(^| )form-type-' . preg_quote($type). '($| )/';
		$label_nodes = $container->findAll('css', '.form-item label');
		foreach ($label_nodes as $label_node) {
			// Note: getText() will return an empty string when using Selenium2D. This
			// is ok since it will cause a failed step.
			if ($label_node->getText() === $label
				&& preg_match($pattern, $label_node->getParent()->getAttribute('class'))
				&& $label_node->isVisible()) {
				return;
			}
		}
		throw new \Behat\Mink\Exception\ElementNotFoundException($this->getSession(), $type . ' form item', 'label', $label);
	}

	/**
	 * Checks, that element with specified CSS is not visible on page.
	 *
	 * @Then /^(?:|I )should not see an? "(?P<label>[^"]*)" form element$/
	 */
	public function assertFormElementNotOnPage($label) {
		$element = $this->getSession()->getPage();
		$nodes = $element->findAll('css', '.form-item label');
		foreach ($nodes as $node) {
			// Note: getText() will return an empty string when using Selenium2D. This
			// is ok since it will cause a failed step.
			if ($node->getText() === $label && $node->isVisible()) {
				throw new \Exception();
			}
		}
	}

	/**
	 * Checks, that form element with specified label and type is not visible on page.
	 *
	 * @Then /^(?:|I )should not see an? "(?P<label>[^"]*)" (?P<type>[^"]*) form element$/
	 */
	public function assertTypedFormElementNotOnPage($label, $type) {
		$container = $this->getSession()->getPage();
		$pattern = '/(^| )form-type-' . preg_quote($type). '($| )/';
		$label_nodes = $container->findAll('css', '.form-item label');
		foreach ($label_nodes as $label_node) {
			// Note: getText() will return an empty string when using Selenium2D. This
			// is ok since it will cause a failed step.
			if ($label_node->getText() === $label
				&& preg_match($pattern, $label_node->getParent()->getAttribute('class'))
				&& $label_node->isVisible()) {
				throw new \Behat\Mink\Exception\ElementNotFoundException($this->getSession(), $type . ' form item', 'label', $label);
			}
		}
	}
}
