<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Facades\Radios;
use App\Models\Radio;

class RadioLandingPageTest extends TestCase
{
    protected $landingPageMockData = '[{"title":"Porridge","tid":"37","episode_nid":"34","description":"\u003Cp\u003EThe worlds first national breakfast show made by and for prisoners. Includes the quiz, 7:40 Shout Out and the Work Out Song..\u003C\/p\u003E\r\n","thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/porridge_1.png"},{"title":"Monday Special","tid":"38","episode_nid":"36","description":"\u003Cp\u003EStart the week by listening to our presenters on the Monday Special show airing every Monday giving you updates on the week ahead.\u003C\/p\u003E\r\n","thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/Monday%20Special_0.png"},{"title":"Hot 20","tid":"39","episode_nid":null,"description":"\u003Cp\u003EKeep up to date with the most popular music around and listen to our Hot 20 tracks.\u003C\/p\u003E\r\n","thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/Hot%2020.png"},{"title":"Past Present \u0026 Future","tid":"40","episode_nid":null,"description":null,"thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/Past%20Present%20and%20Future.png"},{"title":"The Request Show","tid":"41","episode_nid":null,"description":"\u003Cp\u003ESend us your song requests and we will play them on the radio.\u0026nbsp;\u003C\/p\u003E\r\n","thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/The%20Request%20Show.png"},{"title":"The Selector","tid":"42","episode_nid":null,"description":null,"thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-08\/The%20Selector.png"}]';

    /**
     * Tests that programme titles are displayed within H6 tags.
     *
     * @return void
     */
    public function testProgrammeTitles()
    {
        Radios::shouldReceive('landingPageRadios')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        $this->visit('/radio')
            ->seeInElement('h6', 'Porridge')
            ->seeInElement('h6', 'Monday Special')
            ->seeInElement('h6', 'Hot 20')
            ->seeInElement('h6', 'Past Present & Future')
            ->seeInElement('h6', 'The Request Show')
            ->seeInElement('h6', 'The Selector');
    }

    public function testProgrammeDescriptions()
    {
        Radios::shouldReceive('landingPageRadios')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        $this->visit('/radio')
            ->seeInElement('p', "The worlds first national breakfast show made by and for prisoners. Includes the quiz, 7:40 Shout Out and the Work Out Song..")
            ->seeInElement('p', 'Start the week by listening to our presenters on the Monday Special show airing every Monday giving you updates on the week ahead.')
            ->seeInElement('p', 'Keep up to date with the most popular music around and listen to our Hot 20 tracks.')
            ->seeInElement('p', 'Send us your song requests and we will play them on the radio.');
    }

    public function testProgrammeThumbNails()
    {
        Radios::shouldReceive('landingPageRadios')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        $this->visit('/radio')
            ->see('http://192.168.33.9/sites/default/files/2016-08/porridge_1.png')
            ->see('http://192.168.33.9/sites/default/files/2016-08/Monday%20Special_0.png')
            ->see('http://192.168.33.9/sites/default/files/2016-08/Hot%2020.png')
            ->see('http://192.168.33.9/sites/default/files/2016-08/Past%20Present%20and%20Future.png')
            ->see('http://192.168.33.9/sites/default/files/2016-08/The%20Request%20Show.png')
            ->see('http://192.168.33.9/sites/default/files/2016-08/The%20Selector.png');
    }

    public function testRadioHeader()
    {
        Radios::shouldReceive('landingPageRadios')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        $this->visit('/radio')
            ->seeInElement('h2', "Radio")
            ->see('/img/icon-radio.png')
            ->seeInElement('p', 'Welcome to the radio section. Please select a radio programme below to start listening to your favorite show. Our programmes will be updated on a regular basis.')
            ->see('Send us your song requests and we will play them on the radio.');
    }

    public function testRadioThumbNailLinks()
    {
        Radios::shouldReceive('landingPageRadios')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        $this->visit('/radio')
             ->seeElement('a', ['href' => 'radio/34'])
             ->seeElement('a', ['href' => 'radio/36']);
    }
  }
