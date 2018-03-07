<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
use GuzzleHttp\Client;
use Drupal;

class HealthController extends Controller
{

    protected $client;

    protected $response;

    protected $cms;

    protected $cmsHealth;

    protected $laravel;

    public function __construct()
    {
        $this->response = new Response();
        $this->laravel = app();
        $this->client = new Client(
          [
            'base_uri' => config('app.api_uri'),
            'timeout' => 2.0,
          ]
        );
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function getCmsHealth()
    {
        return $this->cmsHealth;
    }

    public function appCheckHealthEndpoint()
    {
        $this->cms = $this->checkCmsHealth();

        if ($this->cms) {
            $this->setHttpResponse($this->cms->getStatusCode(), json_decode($this->cms->getBody(), true), 'up');
        } else {
            $this->setHttpResponse(500, array('backend' => array('status' => 'down')), 'down');
        }

        return $this->response;
    }

    public function checkCmsHealth()
    {
        try {
            return $this->client->get('/api/health',[
              'query' => [
                '_format' => 'json'
                ]
              ]
            );
        } catch (RequestException $error) {
            Log::error(Psr7\str($error->getRequest()));
            if ($error->hasResponse()) {
                Log::error(Psr7\str($error->getResponse()));
            }
        }
    }

    public function setHttpResponse($code = 200, $body, $status)
    {
        $this->response->setStatusCode($code);
        $this->response->headers->set('Content-Type', 'application/json');
        $this->response->setContent(json_encode($this->createJson($body, $status), JSON_PRETTY_PRINT));
    }

    public function createJson($body, $status)
    {
        $frontend = array(
          'status' => $status,
          'frontend' => array(
            'laravel version' => $this->laravel->version(),
            'status' => 'up',
            'timestamp' => time())
          );
        return array_merge($frontend, $body);
    }
}
