<?php

namespace Drupal\Tests\flood_unblock\Functional;


use Drupal\Tests\BrowserTestBase;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests that the Flood Unblock UI pages are reachable.
 *
 * @group flood_unblock
 */
class FloodUnblockUiPageTest extends BrowserTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  protected static $modules = ['flood_unblock'];

  /**
   * The admin user that can access the admin page.
   */
  private $admin_user;

  /**
   * A simple user that cannot access the admin page.
   */
  private $simple_user;

  public function setUp() {
    parent::setUp();

    $this->admin_user = $this->drupalCreateUser(['access flood unblock']);
    $this->simple_user = $this->drupalCreateUser();

    // Flood backends need a request object. Create a dummy one and insert it
    // to the container.
    $request = Request::createFromGlobals();
    $this->container->get('request_stack')->push($request);
  }

  public function testFloodUnblockUiPageAdminUser() {
    $this->drupalLogin($this->admin_user);

    $this->drupalGet('admin/config/system/flood-unblock');
    $this->assertSession()->statusCodeEquals(200, 'Status code is equal to 200');

    // Test that there is an empty flood list.
    $this->assertSession()
      ->pageTextContains('There are no failed logins at this time.');
  }

  public function testFloodUnblockUiPageSimpleUser() {
    $this->drupalLogin($this->simple_user);

    $this->drupalGet('admin/config/system/flood-unblock');
    $this->assertSession()->statusCodeEquals(403, 'Status code is equal to 403');
  }

}
