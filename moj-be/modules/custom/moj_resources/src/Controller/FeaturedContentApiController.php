<?php

namespace Drupal\moj_resources\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Config\Entity\Query\QueryFactory;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class FeaturedContentApiController extends ControllerBase
{   
    protected $nids = array();

    protected $nodes = array();
    
    protected $node_storage;

    function __construct() {
        $this->node_storage = \Drupal::entityTypeManager()->getStorage('node'); // TODO: Inject dependency
        $this->nids = self::getFeaturedContentNodeIds();
        $this->nodes = self::loadNodesDetails($this->nids);
    }

    public function FeaturedContentApiEndpoint()
    {   
        return array_map('self::serialize', $this->nodes);
    }

    protected function getFeaturedContentNodeIds() 
    {
        return \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('promote', 1)
            ->sort('created', 'DESC')
            ->range(0, 1)
            ->execute(); // TODO: Inject dependency
    }

    protected function loadNodesDetails($nids)
    {
        return array_filter(
            $this->node_storage->loadMultiple($nids), function ($item) {
                return $item->access();
            }
        );
    }

    protected function serialize($item) {
        $serializer = \Drupal::service($item->getType().'.serializer.default'); // TODO: Inject dependency
        return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
    }

}
