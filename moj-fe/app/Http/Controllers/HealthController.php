<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
use GuzzleHttp\Client;

class HealthController extends Controller
{

    protected $client;

    protected $response;

    protected $cms;

    protected $cmsHealth;

    public function getResponse()
    {
        return $this->response;
    }

    public function getCmsHealth()
    {
        return $this->cmsHealth;
    }

    public function __construct()
    {
        $this->response = new Response();
        $this->client = new Client(
          [
            'base_uri' => config('app.api_uri'),
            'timeout' => config('app.timeout'),
          ]
        );
    }

    public function frontEndCheckHealthEndpoint()
    {
        $this->setHttpResponse(200);

        return $this->response;
    }

    public function backEndCheckHealthEndpoint()
    {
        $this->cms = $this->checkCmsHealth();

        if ($this->cms) {
            $this->setHttpResponse($this->cms->getStatusCode());
            return $this->response;
        }
        return response()->view('errors.500', [], 500);
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

    public function setHttpResponse($code = 200)
    {
        $this->response->setStatusCode($code);
        $this->response->headers->set('Content-Type', 'application/json');
        $this->response->setContent(
          json_encode(
            array(
              'timestamp' => time()
            )
          )
        );
    }
}
