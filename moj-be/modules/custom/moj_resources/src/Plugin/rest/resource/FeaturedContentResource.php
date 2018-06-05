<?php

namespace Drupal\moj_resources\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\moj_resources\Controller\FeaturedContentApiController;


/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "featured_content_resource",
 *   label = @Translation("Fatured Content Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/node/featured"
 *   }
 * )
 */

class FeaturedContentResource extends ResourceBase {
  
  /**
     * Responds to entity GET requests.
     * @return \Drupal\rest\ResourceResponse
     */
    public function get() 
    {
      $FeaturedContentApiController = new FeaturedContentApiController();
      $result = $FeaturedContentApiController->FeaturedContentApiEndpoint();
      $response = new ResourceResponse($result);
      return $response->addCacheableDependency($result);
    }
}


