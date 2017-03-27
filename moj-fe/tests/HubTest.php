<?php

use App\Facades\HubLinks;
use App\Models\Video;
use Symfony\Component\HttpKernel\Exception\HttpException;

class HubTest extends TestCase
{

	protected $mockVideo;
	protected $hubLandingPageMockData = '[{
		"tid": 7,
		"name": "Video",
		"thumbnail": "http://192.168.33.9/sites/default/files/2016-07/hubthumb_2.png",
		"url": "/video",
		"folder": false,
		"parent": ""
		},
		 {
		"tid": 6,
		"name": "Radio",
		"thumbnail": "http://192.168.33.9/sites/default/files/2016-07/hubthumb_1.png",
		"url": "/radio",
		"folder": false,
		"parent": ""
		},
		 {
		"tid": 8,
		"name": "Education",
		 "thumbnail": "http://192.168.33.9/sites/default/files/2016-07/folderthumb_2.png",
		 "url": null,
		 "folder": true,
		 "parent": ""
		},
		 {
		"tid": 9,
		"name": "Local News",
		 "thumbnail": "http://192.168.33.9/sites/default/files/2016-07/folderthumb_3.png",
		 "url": "null",
		 "folder": true,
		 "parent": ""
		}
	]';
	protected $hubSubPageMockedData = '[
		{
	    "tid": 10,
		"name": "Minute Maths",
		"thumbnail": "http://192.168.33.9/sites/default/files/2016-07/mathsthumb.jpg",
		"url": "/video/195",
		"folder": false,
		"parent": "Education"
		},
		{
		"tid": "11",
		"name": "BBC Bitesize",
		"thumbnail": "http://192.168.33.9/sites/default/files/2016-07/bitesize.png",
		"url": "http://www.bbc.co.uk/education",
		"folder": false,
		"parent": "Education"
		}
	]';

	public function __construct()
	{
		$tags = array(
			(object) array("id" => 1, "name" => 'Documentary'),
			(object) array("id" => 2, "name" => 'Shape')
		);

		$category = (object) array(
				"id" => 1,
				"name" => 'Minute Maths',
				"description" => 'The category description'
		);

		$this->mockVideo = new Video(
			1, "Episode 1: Area - The Space inside a shape", "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .", "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4", "http://placehold.it/300x300", "1:20", $category, $tags, "Way2Learn"
		);
	}

	/**
	 * Tests that hub link titles are displayed within H2 tags.
	 *
	 * @return void
	 */
	public function testLinkTitle()
	{
		HubLinks::shouldReceive('topLevelItems')
			->once()
			->andReturn(json_decode($this->hubLandingPageMockData));

		$this->visit('/')
			->seeInElement('h4', 'Video')
			->seeInElement('h4', 'Radio')
			->seeInElement('h4', 'Education')
			->seeInElement('h4', 'Local News');
	}

	/**
	 * Tests that hub link thumbnails are displayed correctly.
	 *
	 * @return void
	 */
	public function testLinkThumbs()
	{
		HubLinks::shouldReceive('topLevelItems')
			->once()
			->andReturn(json_decode($this->hubLandingPageMockData));

		$this->visit('/')
			->seeInElement('a', '<img src="http://192.168.33.9/sites/default/files/2016-07/hubthumb_2.png" alt="">')
			->seeInElement('a', '<img src="http://192.168.33.9/sites/default/files/2016-07/hubthumb_1.png" alt="">')
			->seeInElement('a', '<img src="http://192.168.33.9/sites/default/files/2016-07/folderthumb_2.png" alt="">')
			->seeInElement('a', '<img src="http://192.168.33.9/sites/default/files/2016-07/folderthumb_3.png" alt="">');
	}

	/**
	 * Tests that hub link paths are correct.
	 *
	 * @return void
	 */
	public function testLinkPaths()
	{
		HubLinks::shouldReceive('topLevelItems')
			->once()
			->andReturn(json_decode($this->hubLandingPageMockData));

		$this->visit('/')
			->click('term-7')
			->seePageIs('/video');
	}

	/**
	 * Tests that hub link paths to sub hub pages are correct.
	 *
	 * @return void
	 */
	public function testLinksToSubHub()
	{
		HubLinks::shouldReceive('topLevelItems')
			->once()
			->andReturn(json_decode($this->hubLandingPageMockData));

		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(json_decode($this->hubSubPageMockedData));

		$this->visit('/')
			->click('term-8')
			->seePageIs('/hub/8');
	}

	/**
	 * Tests that sub hub link paths are correct
	 *
	 * @return void
	 */
	public function testSubHubLinkPaths()
	{
		\App\Facades\Videos::shouldReceive('find')
			->with(195)
			->once()
			->andReturn($this->mockVideo);

		\App\Facades\Videos::shouldReceive('getCategoryEpisodes')
			->with(195)
			->once()
			->andReturn(array());

		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(json_decode($this->hubSubPageMockedData));

		$this->visit('/hub/8')
			->click('term-10')
			->seePageIs('/video/195');
	}

	/**
	 * Tests that sub hub link paths are correct
	 *
	 * @return void
	 */
	public function testSubHubExternalLinkPaths()
	{
		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(json_decode($this->hubSubPageMockedData));

		$this->visit('/hub/8')
			->seeInElement('li', '<a href="http://www.bbc.co.uk/education" target="_blank" rel="noopener" id="term-11">');
	}

	/**
	 * Tests that sub hub titles are correct
	 *
	 * @return void
	 */
	public function testSubHubTitles()
	{
		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(json_decode($this->hubSubPageMockedData));

		$this->visit('/hub/8')
			->seeInElement('h1', 'Education');
	}

	/**
	 * Tests that sub hub 'no links' title is correct
	 *
	 * @return void
	 */
	public function testSubHubNoLinksPage()
	{
		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(array());

		$this->visit('/hub/9')
			->seeInElement('h1', 'No links');
	}

	/**
	 * Tests that sub hub 'back link' returns to hub
	 *
	 * @return void
	 */
	public function testSubHubBackLink()
	{

		HubLinks::shouldReceive('topLevelItems')
			->once()
			->andReturn(json_decode($this->hubLandingPageMockData));

		HubLinks::shouldReceive('subLevelItems')
			->once()
			->andReturn(array());

		$this->visit('/hub/9')
			->click('hub-back')
			->seePageIs('/');
	}

	/**
	 * Test that the sub hub page throws 404 with invalid term id
	 */
	public function testSubHub404()
	{

		HubLinks::shouldReceive('subLevelItems')
			->with(666)
			->once()
			->andThrow(new HttpException(404, "Term ID not found"));

		$response = $this->call('GET', '/hub/666');
		$this->assertEquals(404, $response->status());
		$this->assertContains('Page 404 error.', $response->content());
		$this->assertContains('Term ID not found', $response->content());
	}

}
