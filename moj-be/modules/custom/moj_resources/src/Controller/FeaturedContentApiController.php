<?php

namespace Drupal\moj_resources\Controller;

use Drupal\rest\ResourceResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;

class FeaturedContentApiController extends ControllerBase implements ContainerInjectionInterface
{
    protected $nids = array();
    protected $nodes = array();
    protected $node_storage;
    protected $entity_query;

    public function __construct(EntityTypeManagerInterface $entityTypeManager, QueryFactory $entityQuery)
    {        
        $this->node_storage = $entityTypeManager->getStorage('node');
        $this->entity_query = $entityQuery;
        $this->nids = self::getFeaturedContentNodeIds();
        $this->nodes = self::loadNodesDetails($this->nids);
    }
    
    /**
     * {@inheritdoc}
     */
    
    public static function create(ContainerInterface $container) 
    {
        return new static(
            $container->get('entity_type.manager'),
            $container->get('entity.query')
        );
    }       

    public function FeaturedContentApiEndpoint()
    {   
        $featured = array_map('self::serialize', $this->nodes);
        
        if (!empty($featured)) {
            return new ResourceResponse($featured);
        }
        throw new NotFoundHttpException(t('No featured content found'));    }

    protected function getFeaturedContentNodeIds() 
    {
        return \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('promote', 1)
            ->sort('created', 'DESC')
            ->range(0, 1)
            ->execute(); // TODO: Inject dependency
    }

    protected function loadNodesDetails(array $nids)
    {
        return array_filter(
            $this->node_storage->loadMultiple($nids), function ($item) {
                return $item->access();
            }
        );
    }
    /**
     * Undocumented function
     *
     * @param array $item
     * @return void
     */
    protected function serialize($item) {
        $serializer = \Drupal::service($item->getType().'.serializer.default'); // TODO: Inject dependency
        return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
    }
    /**
     * Testing function
     * 
     * A small test function 
     *
     * @return Boolean
     */
    public function test()
    {
        return true;
    }
}
