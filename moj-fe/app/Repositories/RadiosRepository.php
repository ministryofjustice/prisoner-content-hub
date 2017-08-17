<?php

namespace App\Repositories;

use GuzzleHttp\Client;

class RadiosRepository {

	protected $client;

	protected $locale = '';

	public function __construct() {
		$this->client = new Client([
			'base_uri' => config('app.api_uri'),
			'timeout' => config('app.timeout'),
		]);

		$this->locale = \App::getLocale();
		if ($this->locale == 'en') {
			$this->locale = '';
		}
	}

	public function landingPageRadios() {
		$response = $this->client->get($this->locale . '/api/radio/landing');

		$responseTree = json_decode($response->getBody());

		return $responseTree;
	}

	public function show($nid) {
		$response = $this->client->get($this->locale . '/api/radio/show/' . $nid);

		$responseTree = json_decode($response->getBody());

		return $responseTree;
	}

	public function channelRadioShows($nid) {
		$response = $this->client->get($this->locale . '/api/radio/shows/' . $nid);

		$responseTree = json_decode($response->getBody());

		return $responseTree;
	}

}
