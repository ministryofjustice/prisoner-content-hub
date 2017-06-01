<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Facades\Videos;
use App\Models\Video;

class VideoLandingPageTest extends TestCase
{
    protected $landingPageMockData = '[{"tid":"1","channel":"Way2Learn","programmes":[{"tid":"2","title":"Minute Maths","episodes":{"nid":"9","title":"Global video 3","description":[{"value":"<p>Description of the third global video item.<\/p>\r\n","summary":"","format":"basic_html"}],"category":{"id":"2","title":"Minute Maths"},"thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-07\/minute-maths.png"}},{"tid":"3","title":"Job Smart","episodes":{"nid":"7","title":"Global video 1","description":[{"value":"<p>Description of the first global video item.<\/p>\r\n","summary":"","format":"basic_html"}],"category":{"id":"3","title":"Job Smart"},"thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-07\/job-smart.png"}}]},{"tid":"5","channel":"Prison Video Trust","programmes":[{"tid":"6","title":"PVT Series 1","episodes":{"nid":"8","title":"Global video 2","description":[{"value":"<p>The description of the second global video item.<\/p>\r\n","summary":"","format":"basic_html"}],"category":{"id":"6","title":"PVT Series 1"},"thumbnail":"http:\/\/192.168.33.9\/sites\/default\/files\/2016-07\/pvt-series-1.png"}}]}]';
    protected $mockVideo;
    protected $mockRecentVideos = array();
    protected $mockCategoryEpisodes = array();

    public function __construct() {
      $tags = array(
          (object) array("id" => 2, "name" => 'Documentary'),
          (object) array("id" => 3, "name" => 'Shape')
      );

      $category = (object) array(
          "id" => 4,
          "name" => 'Minute Maths',
          "description" => 'The category description'
      );

      $this->mockVideo = new Video(
          9,
          "Episode 1: Area - The Space inside a shape",
          "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .",
          "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
          "http://placehold.it/300x300",
          "1:20",
          $category,
          $tags,
          "Way2Learn"
      );
	  
		$this->mockRecentVideo = array(
			new Video(
				9,
				"Video title",
				"Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds.",
				"http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
				"http://placehold.it/600x600",
				"1:20",
				$category,
				$tags,
				"Way2Learn"
			),
			new Video(
				10,
				"Video title 2",
				"Work out the space inside a shape with Ryan. This episode relates to page 3 of your Minute Maths work book.",
				"http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
				"http://placehold.it/300x300",
				"1:20",
				$category,
				$tags,
				"Minute Maths"
			)
      );
    }

    /**
     * Tests that channel titles are displayed within H2 tags.
     *
     * @return void
     */
    public function testChannelTitles()
    {
        Videos::shouldReceive('landingPageVideos')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        Videos::shouldReceive('getRecent')
          ->once()
          ->andReturn($this->mockRecentVideos);

        $this->visit('/video')
             ->seeInElement('h2', 'Way2Learn')
             ->seeInElement('h2', 'Prison Video Trust');
    }

    /**
     * Tests that programme titles are displayed within H6 tags.
     *
     * @return void
     */
    public function testProgrammeTitles()
    {
        Videos::shouldReceive('landingPageVideos')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        Videos::shouldReceive('getRecent')
          ->once()
          ->andReturn($this->mockRecentVideos);

        $this->visit('/video')
             ->seeInElement('h6', 'Minute Maths')
             ->seeInElement('h6', 'Job Smart')
             ->seeInElement('h6', 'PVT Series 1');
    }

    /**
     * Tests that programmes link through to videos.
     *
     * @return void
     */
    public function testProgrammeLinks()
    {
        Videos::shouldReceive('landingPageVideos')
          ->once()
          ->andReturn(json_decode($this->landingPageMockData));

        Videos::shouldReceive('getRecent')
          ->once()
          ->andReturn($this->mockRecentVideos);

        Videos::shouldReceive('getCategoryEpisodes')
          ->once()
          ->andReturn($this->mockCategoryEpisodes);

        Videos::shouldReceive('find')
          ->with(9)
          ->once()
          ->andReturn($this->mockVideo);

        $this->visit('/video')
             ->click('programme-9')
             ->seePageIs('/video/9');
    }
	
	 /**
     * Tests that video title is displayed on carousel slide.
     *
     * @return void
     */
    public function testCarouselSlideTitle() {
       
        Videos::shouldReceive('landingPageVideos')
          ->once()
         ->andReturn(json_decode($this->landingPageMockData));
       
        Videos::shouldReceive('getRecent')
                ->once()
                ->andReturn($this->mockRecentVideo);
 
 
        $this->visit('/video')
                ->seeInElement('.bxslider', 'Video title')
                 ->seeInElement('.bxslider', 'Video title 2');
    }
	
	/**
     * Tests that video title is displayed on carousel slide.
     *
     * @return void
     */
    public function testCarouselSlideThumb() {
       
        Videos::shouldReceive('landingPageVideos')
          ->once()
         ->andReturn(json_decode($this->landingPageMockData));
       
        Videos::shouldReceive('getRecent')
                ->once()
                ->andReturn($this->mockRecentVideo);
 
 
        $this->visit('/video')
				->seeInElement('.bxslider', '<img src="http://placehold.it/600x600" alt="">')
                ->seeInElement('.bxslider', '<img src="http://placehold.it/300x300" alt="">');                 
    }
	
	/**
     * Tests that video's channel name is displayed on carousel slide.
     *
     * @return void
     */
    public function testCarouselSlideChannelName() {
       
        Videos::shouldReceive('landingPageVideos')
          ->once()
         ->andReturn(json_decode($this->landingPageMockData));
       
        Videos::shouldReceive('getRecent')
                ->once()
                ->andReturn($this->mockRecentVideo);
 
        $this->visit('/video')
				->seeInElement('.bxslider', 'Minute Maths')
                ->seeInElement('.bxslider', 'Way2Learn');                 
    }
	
	/**
     * Tests that video's channel name is displayed on carousel slide.
     *
     * @return void
     */
    public function testCarouselSlideDesciption() {
       
        Videos::shouldReceive('landingPageVideos')
          ->once()
         ->andReturn(json_decode($this->landingPageMockData));
       
        Videos::shouldReceive('getRecent')
                ->once()
                ->andReturn($this->mockRecentVideo);
 
        $this->visit('/video')
				->seeInElement('.bxslider', 'Work out the space inside a shape with Ryan. This episode relates to page 3 of your Minute Maths work book.')
                ->seeInElement('.bxslider', 'Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds.');                 
    }

}
