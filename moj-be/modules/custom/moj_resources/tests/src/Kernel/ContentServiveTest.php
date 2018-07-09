<?php

namespace Drupal\Tests\moj_resources\Kernel;

use Drupal\node\Entity\Node;
use Drupal\KernelTests\KernelTestBase;
use Drupal\moj_resources\ContentApiClass;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;

/**
 * Test to ensure 'moj_resources' service is reachable.
 *
 * @group kernel_moj_resources
 * 
 */

class ContnetServiceTest extends EntityKernelTestBase 
{
    /**
     * {@inheritdoc}
     */

    public static $modules = [
        'moj_pdf_item',
        'moj_resources',
        'node'
        ];

    /**
     * Test for existence of 'events_example_subscriber' service.
     */
    public function testContnetService() 
    {
        $contnetService = $this->container->get('moj_resources.content_api_class');
        $this->assertTrue($contnetService instanceof ContentApiClass);
    }
}