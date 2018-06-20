<?php

namespace Drupal\Tests\moj_resources\Kernel;

use Drupal\node\Entity\Node;
use Drupal\KernelTests\KernelTestBase;
use Drupal\moj_resources\FeaturedContentApiClass;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;

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

    public static $modules = ['moj_resources','node'];

    protected function setUp()
    {
        parent::setUp();
        // $node = Node::create(array(
        //     'title' => t('Sample content'),
        //     'type' => 'moj_pdf_item',
        //     'language' => 'en',
        // ));
        // $node->save();
    }
    /**
     * Test for existence of 'events_example_subscriber' service.
     */
    public function testFeaturedContnetService() 
    {
        $featuredContnetService = $this->container->get('moj_resources.featured_content_api_class');
        $this->assertTrue($featuredContnetService instanceof FeaturedContentApiClass);
    }
}