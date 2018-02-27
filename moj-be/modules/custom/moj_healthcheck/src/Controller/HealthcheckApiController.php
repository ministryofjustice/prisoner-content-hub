<?php

namespace Drupal\moj_healthcheck\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

class HealthcheckApiController extends ControllerBase
{
    protected $response;

    protected function __construct()
    {
        $this->response = new Response(); //TODO Dependency inject the Response Class
    }

    public function healthcheckApiEndpoint()
    {
        $this->response->setContent($this->setResponse());
        return $this->response;
    }

    protected function setResponse()
    {
        return $this->databaseSimpleTest() ? time() : 'FALSE';
    }

    protected function databaseSimpleTest()
    {
        $connection = \Drupal::database();
        $query = $connection->query("SELECT version()");
        return $query->execute();
    }
}