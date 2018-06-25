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

    public static $modules = ['moj_resources','node'];

    // public function setup()
    // {
    //     $node = Node::create(array(
    //         'title' => t('Sample content'),
    //         'type' => 'moj_pdf_item',
    //         'language' => 'en',
    //     ));
    //     $node->save();
    // }
    /**
     * Test for existence of 'events_example_subscriber' service.
     */
    public function testContnetService() 
    {
        $contnetService = $this->container->get('moj_resources.content_api_class');
        $this->assertTrue($contnetService instanceof ContentApiClass);
    }

    // public function testFeaturedContnetServiceOne() 
    // {
    //     $featuredContnetService = $this->container->get('moj_resources.featured_content_api_class');
    //     print_r($featuredContnetService->FeaturedContentApiEndpoint('en'));
    //     $this->assertTrue($featuredContnetService->FeaturedContentApiEndpoint('en') instanceof FeaturedContentApiClass);
    // }

}