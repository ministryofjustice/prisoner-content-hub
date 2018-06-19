<?php

namespace Drupal\Tests\moj_resources\Unit;

use Drupal\Tests\UnitTestCase;
use Drupal\Tests\Core\Form\FormTestBase;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\moj_resources\_FeaturedContentApiClass;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\DependencyInjection\ContainerBuilder;

/**
 * Featured contnet API Unit tests
 *
 * @group unit_moj_resources
 */

class NewContentTest extends FormTestBase
{
    /**
     * @var \Drupal\moj_resources\Controller\_FeaturedContentApiController
     */
    public $featuredContentApiClass;

    public $entityManager;

    public $entityQuery;

    public $entityQueryFactory;

    public $node;

    public $nodeStorage;

    public $node_title;

    public function setUp()
    {
        parent::setUp(); 

        /* Entity Manager */

        $this->node_title = $this->getRandomGenerator()->word(10);

        $this->node = $this->getMockBuilder('Drupal\node\Entity\Node')
            ->disableOriginalConstructor()
            ->getMock();
        
        $this->node->expects($this->any())
            ->method('getTitle')
            ->will($this->returnValue($this->node_title));
        
        // print_r($this->node);
        
        $this->nodeStorage = $this->getMockBuilder('Drupal\node\NodeStorage')
            ->disableOriginalConstructor()
            ->getMock();
        
        $this->nodeStorage->expects($this->any())
            ->method('loadMultiple')
            ->will($this->returnValue(array(4727 => $this->node)));
        
        $this->entityManager = $this->getMockBuilder('Drupal\Core\Entity\EntityManagerInterface')
            ->disableOriginalConstructor()
            ->getMock();
        
        $this->entityManager->expects($this->any())
            ->method('getStorage')
            ->with('node')
            ->willReturn($this->nodeStorage); 
        
        /* Query Factory */

        $this->entityQuery = $this->getMockBuilder('Drupal\Core\Entity\Query\QueryInterface')
            ->disableOriginalConstructor()
            ->getMock();

        $this->entityQueryFactory = $this->getMockBuilder('Drupal\Core\Entity\Query\QueryFactory')
            ->disableOriginalConstructor()
            ->setMethods(array('get', 'condition', 'sort', 'range', 'execute'))
            ->getMock();
        
        $this->entityQueryFactory->expects($this->at(5)) // on index 5 of call 6
            ->method('execute')
            ->will($this->returnValue(array(4727 => 4727)));
        
        $this->entityQueryFactory->expects($this->any())
            ->method($this->anything())
            ->will($this->returnSelf());
        
        $this->featuredContentApiClass = new _FeaturedContentApiClass($this->entityManager, $this->entityQueryFactory);
    }

    public function testGetFeaturedContentReturnsNodeId()
    {

        $nids = $this->featuredContentApiClass->getNids();
        
        $this->assertEquals(array(4727 => 4727), $nids);
    }
}
