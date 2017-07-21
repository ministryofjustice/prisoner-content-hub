<?php

namespace App\Repositories;

use App\Exception\VideoNotFoundException;
use App\Models\Video;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class HubLinksRepository {
	protected $client;
	protected $locale = '';

	public function __construct() {
		$this->client = new Client(array(
			'base_uri' => config('app.api_uri'),
			'timeout' => 60.0
		));

		$this->locale = \App::getLocale();

		if ($this->locale == 'en') {
			$this->locale = '';
		}
	}

	public function getItem($id = NULL, $user_id = NULL) {
		$url = $this->locale . '/api/hub/' . $id;

		$headers = [];

		if ($user_id) {
			$headers['custom-auth-id'] = $user_id;
		}

		$response	= $this->client->get($url, [ 'headers' => $headers ]);

		return json_decode($response->getBody());
	}

    public function checkNewContent($user_id = NULL) {
        $url = $this->locale . '/api/checknewcontent';

        $headers = [];

        if ($user_id) {
            $headers['custom-auth-id'] = $user_id;
        }

        $response	= $this->client->get($url, [ 'headers' => $headers ]);

        return json_decode($response->getBody());
    }
}
