<?php

namespace App\Repositories;

use App\Exceptions\VideoNotFoundException;
//use App\Models\Video;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class PdfsRepository
{
    protected $client;
    protected $locale = '';

    public function __construct()
    {
        $this->client = new Client(array(
            'base_uri' => config('app.api_uri'),
            'timeout' => 60.0
        ));

        $this->locale = \App::getLocale();
        if ($this->locale == 'en') {
          $this->locale = '';
        }
    }

    public function landingPagePdfs($tid)
    {
        $response = $this->client->get($this->locale . '/api/pdf/course/' . $tid);
        $responseTree = json_decode($response->getBody());
		
        return $responseTree;

    }
	
	public function show($tid)
	{
		$response = $this->client->get($this->locale . '/api/pdf/course/pdfs/' . $tid);
        $responseTree = json_decode($response->getBody());
		
        return $responseTree;
	}
	
	
}
