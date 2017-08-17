<?php

namespace App\Repositories;

use App\Exceptions\VideoNotFoundException;
use App\Models\News;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class NewsRepository {

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

	public function landingPageNews() {
		$response = $this->client->get($this->locale . '/api/news/landing');

		$responseNews = json_decode($response->getBody());

		$news = [];

		foreach ($responseNews as $item) {
			array_push($news, new News(
				$item->nid,
				$item->title,
				$item->description,
				$item->date,
				$item->sticky
			));
		}

		return $news;
	}

}
