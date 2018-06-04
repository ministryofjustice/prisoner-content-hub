<?php

namespace Drupal\moj_resources\Controller;

use Drupal\Core\Controller\ControllerBase;

class FeaturedContentApiController extends ControllerBase
{   
    public $entity_query;

    public function __construct(QueryFactory $entity_query) 
    {
        $this->entity_query = $entity_query;
    }
        
    public static function create(ContainerInterface $container) 
    {
        return new static(
            $container->get('entity.query')
        );
    }

    public function FeaturedContentApiEndpoint()
    {
        $this->response = $this->setResponse();
        return $this->response;
    }

    // This function shows how to
    public function getFeaturedContent() 
    {
        $query = $this->entity_query->get('node');   
        // Add a filter (published).
        $query->condition('status', 1);
        // Run the query.
        return $query->execute();
  }

}
