<?php

namespace Drupal\moj_healthcheck\Controller;

use Drupal\Core\Controller\ControllerBase;

class HealthcheckApiController extends ControllerBase
{
    public $response;

    public function healthcheckApiEndpoint()
    {
        $this->response = $this->setResponse();
        return $this->response;
    }

		public function setResponse()
    {
        return array(
          'backend' => array(
            'timestamp' => $this->databaseSimpleTest() ? time() : 'FALSE',
            'Drupal Version' => \DRUPAL::VERSION
          ),
          'db' => array(
            'database' => 'mysql',
            'status'=> 'up'
          )
        );
    }

		public function databaseSimpleTest()
    {
        $connection = \Drupal::database();
        $query = $connection->query("SELECT /*+ MAX_EXECUTION_TIME(1000) */ version()");
        return $query->execute();
    }

}
