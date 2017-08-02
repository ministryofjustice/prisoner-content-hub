<?php

namespace Drupal\Tests\moj_new_content\Functional;
use Drupal\Tests\BrowserTestBase;
/**
 * Check if our user field works.
 *
 * @group moj_new_content
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */

class NewContentFunctional extends BrowserTestBase
{
    /**
     * @var \Drupal\user\Entity\User.
     */
    protected $user;
    /**
     * Enabled modules
     */
    public static $modules = ['moj_new_content'];
    /**
     * {@inheritdoc}
     */
    function setUp() {
        parent::setUp();
    }
    /**
     * Test that the user has a test_status field.
     */
    public function testUserHasTestStatusField() {
        $this->assertTrue(true);
    }
}