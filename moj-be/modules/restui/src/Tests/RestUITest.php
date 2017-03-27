<?php

namespace Drupal\restui\Tests;

use Drupal\simpletest\WebTestBase;

/**
 * Tests restui functionality.
 *
 * @group REST
 */
class RestUITest extends WebTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  public static $modules = array('node', 'restui');

  /**
   * Tests enabling a resource and accessing it.
   */
  function testConsumers() {
    // Create a user with permissions to manage
    $permissions = array('administer site configuration', 'administer rest resources');
    $account = $this->drupalCreateUser($permissions);

    // Initiate user session.
    $this->drupalLogin($account);

    // Check that user can access the administration interface.
    $this->drupalGet('admin/config/services/rest');
    $this->assertResponse(200);

    // Adjust the node resource so it allows GET method, JSON format and
    // Cookie authentication.
    $values = array(
      'methods[GET][GET]' => TRUE,
      'methods[GET][settings][formats][json]' => TRUE,
      'methods[GET][settings][auth][cookie]' => TRUE,
      'methods[POST][POST]' => FALSE,
      'methods[DELETE][DELETE]' => FALSE,
      'methods[PATCH][PATCH]' => FALSE,
    );
    $this->drupalPostForm('admin/config/services/rest/resource/entity%3Anode/edit', $values, 'Save configuration');
    $this->assertText(t('The resource has been updated.'));
  }

}
