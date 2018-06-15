<?php

namespace Drupal\Tests\moj_resources\Unit;

use Drupal\Tests\UnitTestCase;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\moj_resources\Controller\FeaturedContentApiController;

/**
 * Featured contnet API Unit tests
 *
 * @group moj_resources
 */

class NewContentTest extends UnitTestCase
{
    /**
     * @var \Drupal\moj_resources\Controller\FeaturedContentApiController
     */
    public $featuredContentApiController;

    public $mockEntityTypeManager;

    public $mockEntityQuery;

    public function setUp()
    {
        $this->mockEntityTypeManager = $this->getMock('Drupal\Core\Entity\EntityTypeManagerInterface');

        $this->mockEntityQuery = $this->getMockBuilder('Drupal\Core\Entity\Query\QueryFactory')
            ->disableOriginalConstructor()
            ->getMock();
        
        $this->mockEntityQuery->expects($this->any())
            ->method('get')
            ->will($this->returnValue(array(4727 => 4727)));
    }

    public function testMockEntityManager() 
    {
        $this->assertTrue($this->mockEntityTypeManager instanceof EntityTypeManagerInterface);
    }

    public function testMockEntityQuery() 
    {
        $this->assertTrue($this->mockEntityQuery instanceof QueryFactory);
    }

    public function testMockEntityQueryReturnsAnArray() 
    {
        $this->assertInternalType("array", $this->mockEntityQuery->get('node'));

    }
}
