<?php

namespace Drupal\moj_healthcheck\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\moj_healthcheck\Controller\HealthcheckApiController;

/**
 * Provides a Health Resource
 *
 * @RestResource(
 *   id = "health_resource",
 *   label = @Translation("Health Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/health"
 *   }
 * )
 */

class HealthResource extends ResourceBase {
  /**
     * Responds to entity GET requests.
     * @return \Drupal\rest\ResourceResponse
     */
    public function get() {
      $HealthcheckApiController = new HealthcheckApiController();
      $response = $HealthcheckApiController->healthcheckApiEndpoint();
      return new ResourceResponse($response);
    }
}


