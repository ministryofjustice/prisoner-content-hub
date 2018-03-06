<?php

namespace Drupal\moj_healthcheck\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Database;

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
        return $this->databaseSimpleTest() ? time() : 'FALSE';
    }

		public function databaseSimpleTest()
    {
        $connection = \Drupal::database();
        $query = $connection->query("SELECT version()");
        return $query->execute();
    }
}
