<?php

namespace Drupal\Tests\events_example\Kernel;

use Drupal\KernelTests\KernelTestBase;
use Drupal\moj_resources\FeaturedContentApiClass;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;
use Drupal\events_example\EventSubscriber\EventsExampleSubscriber;

/**
 * Test to ensure 'moj_resources' service is reachable.
 *
 * @group kernel_moj_resources
 * 
 */

class FeaturedContnetServiceTest extends EntityKernelTestBase 
{
  /**
   * {@inheritdoc}
   */

  public static $modules = ['moj_resources'];

  /**
   * Test for existence of 'events_example_subscriber' service.
   */
  public function testFeaturedContnetService() {
    $featuredContnetService = $this->container->get('moj_resources.featured_content_api_class');
    $this->assertInstanceOf(FeaturedContnetApiClass::class, $featuredContnetService);
  }

}