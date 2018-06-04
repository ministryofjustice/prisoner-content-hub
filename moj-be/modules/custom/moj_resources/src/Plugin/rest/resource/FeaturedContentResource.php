<?php

namespace Drupal\moj_resources\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;

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
    public function get() {
      $response = json_encode('Featured Contnet');
      return new ResourceResponse($response);
    }
}


