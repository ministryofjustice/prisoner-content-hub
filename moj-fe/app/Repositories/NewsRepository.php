<?php

namespace App\Repositories;

use App\Exceptions\VideoNotFoundException;
use App\Models\News;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class NewsRepository
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

    public function landingPageNews()
    {
        $response = $this->client->get($this->locale . '/api/news/landing');

        $responseNews = json_decode($response->getBody());

        $news = array();

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
