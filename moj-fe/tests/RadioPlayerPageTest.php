<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use Symfony\Component\HttpKernel\Exception\HttpException;

use App\Facades\Radios;

class RadioPlayerPageTest extends TestCase
{
  protected $playerPageMockEpisodeData = '[
{
"title": "Porridge: Friday 12th May",
"nid": "35",
"description": "<p>Description - Porridge: Friday 12th May.</p>\r\n",
"duration": "2:08",
"date": "1471947657",
"radio_show_url": "http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_1.mp3",
"thumbnail": "",
"added_today": true
},
{
"title": "Porridge: Thursday 11th May ",
"nid": "34",
"description": "<p>Description - Porridge: Thursday 11th May.</p>\r\n",
"duration": "1:30",
"date": "1471947657",
"radio_show_url": "http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_0.mp3",
"thumbnail": "",
"added_today": false
}
]';

  protected $playerPageMockPlayerData = '{
"episode": {
"title": "Porridge: Thursday 11th May ",
"nid": "34",
"description": "<p>Description - Porridge: Thursday 11th May.</p>\r\n",
"duration": "1:30",
"date": "1471947657",
"radio_show_url": "http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_0.mp3",
"thumbnail": "",
"added_today": false
},
"parent": {
"channel_name": "Porridge",
"channel_description": "<p>The worlds first national breakfast show made by and for prisoners. Includes the quiz, 7:40 Shout Out and the Work Out Song.</p>\r\n",
"channel_banner": "http://192.168.33.9/sites/default/files/2016-09/img_porridge-light.png"
}
}';

  /**
  * Tests the programme episodes appear in the list
  */
  public function testProgrammeEpisodes()
  {
    Radios::shouldReceive('show')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockPlayerData));

    Radios::shouldReceive('channelRadioShows')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockEpisodeData));

    $this->visit('/radio/34')
      ->seeInElement('li', 'Porridge: Thursday 11th May')
      ->seeInElement('li', 'Porridge: Friday 12th May');
  }

  public function testMockRadioPlayer()
  {
    Radios::shouldReceive('show')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockPlayerData));

    Radios::shouldReceive('channelRadioShows')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockEpisodeData));

    $this->visit('/radio/34')
      ->see('Porridge: Thursday 11th May')
      ->see('Tuesday 23rd August')
      ->see('1:30')
      ->seeElement('source', ['src' => 'http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_0.mp3']);
  }

  public function testRadioHeader()
  {
    Radios::shouldReceive('show')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockPlayerData));

    Radios::shouldReceive('channelRadioShows')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockEpisodeData));

      $this->visit('/radio/34')
          ->seeInElement('h2', "Radio")
          ->seeElement('.page-title a img', ['src' => '/img/icon-radio.png'])
          ->seeInElement('h1', "Porridge")
          ->seeInElement('p', "The worlds first national breakfast show made by and for prisoners. Includes the quiz, 7:40 Shout Out and the Work Out Song.");
  }

  public function testListAudioFiles()
  {
    Radios::shouldReceive('show')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockPlayerData));

    Radios::shouldReceive('channelRadioShows')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockEpisodeData));

      $this->visit('/radio/34')
          ->seeInElement('li', 'http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_0.mp3')
          ->seeInElement('li', 'http://192.168.33.9/sites/default/files/audio/2016-08/fire_bow_sound-mike-koenig_1.mp3');
  }

  /**
  * Tests the 404 error page with an invalid radio id
  */
  public function testMockRadioWithNoId()
  {
    Radios::shouldReceive('show')
    ->with(345)
    ->once()
    ->andThrow(new HttpException(404, "Radio not found"));

      $response = $this->call('GET', '/radio/345');
      $this->assertEquals(404, $response->status());
      $this->assertContains('Page 404 error.', $response->content());
      $this->assertContains('Radio not found', $response->content());
  }

  /**
  * Tests if added today was displayed
  */
  public function testAddedToday()
  {
    Radios::shouldReceive('show')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockPlayerData));

    Radios::shouldReceive('channelRadioShows')
    ->with(34)
    ->once()
    ->andReturn(json_decode($this->playerPageMockEpisodeData));

      $this->visit('/radio/34')
          ->seeInElement('a#show-35', 'Added Today')
          ->dontSeeInElement('a#show-34', 'Added Today');
  }
}
