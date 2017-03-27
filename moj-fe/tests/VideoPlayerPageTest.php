<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use Symfony\Component\HttpKernel\Exception\HttpException;

use App\Models\Video;

class VideoPlayerTest extends TestCase
{
    protected $mockVideo;
    protected $mockEpisodeVideos = array();

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
            1,
            "Episode 1: Area - The Space inside a shape",
            "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .",
            "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
            "http://placehold.it/300x300",
            "1:20",
            $category,
            $tags,
            "Way2Learn"
        );

        $this->mockEpisodeVideos[] = new Video(
            2,
            "Episode 2: Area - The Space inside a shape",
            "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .",
            "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
            "http://placehold.it/300x300",
            "1:20",
            $category,
            $tags,
            "Way2Learn"
        );

        $this->mockEpisodeVideos[] = new Video(
            3,
            "Episode 3: Area - The Space inside a shape",
            "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .",
            "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
            "http://placehold.it/300x300",
            "1:20",
            $category,
            $tags,
            "Way2Learn"
        );

        $this->mockEpisodeVideos[] = new Video(
            4,
            "Episode 4: Area - The Space inside a shape",
            "Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf .",
            "http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4",
            "http://placehold.it/300x300",
            "1:20",
            $category,
            $tags,
            "Way2Learn"
        );
    }

    public function testMockVideoPlayer()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(1)
          ->once()
          ->andReturn($this->mockVideo);

        \App\Facades\Videos::shouldReceive('getCategoryEpisodes')
          ->with(1)
          ->once()
          ->andReturn(array());

        $this->visit('/video/1')
             ->seeInElement('h2', 'Episode 1: Area - The Space inside a shape')
             ->see('Lorem ipsum dolor sit amet conestur adoijvcsa elit. Sed commdoino or ojoasd ds. Donec porta lcudaj funsaoir congie. Sed adjnai sfshgdfhfd hfhrthgd iuy dhgd daf ')
             ->see('http://placehold.it/300x300')
             ->see('1:20')
             ->see('Minute Maths')
             ->seeElement("#video_player > source[src='http://192.168.33.9/sites/default/files/videos/2016-07/SampleVideo_1280x720_2mb_2.mp4']");
    }

    public function testMockVideoWithNoId()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(202)
          ->once()
          ->andThrow(new HttpException(404, "Video not found"));


        $response = $this->call('GET', '/video/202');
        $this->assertEquals(404, $response->status());
        $this->assertContains('Page 404 error.', $response->content());
        $this->assertContains('Video not found', $response->content());
    }

    public function testMockVideoPlayerRelatedEpisodes()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(1)
          ->once()
          ->andReturn($this->mockVideo);

        \App\Facades\Videos::shouldReceive('getCategoryEpisodes')
          ->with(1)
          ->once()
          ->andReturn($this->mockEpisodeVideos);

        $this->visit('/video/1')
             ->see('Episodes')
             ->see('Episode 2: Area - The Space inside a shape')
             ->see('Episode 3: Area - The Space inside a shape')
             ->see('Episode 4: Area - The Space inside a shape')
             ->see('http://placehold.it/300x300');
    }

    public function testMockVideoPlayerAboutSection()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(1)
          ->once()
          ->andReturn($this->mockVideo);

        \App\Facades\Videos::shouldReceive('getCategoryEpisodes')
          ->with(1)
          ->once()
          ->andReturn($this->mockEpisodeVideos);

        $this->visit('/video/1')
             ->see('About')
             ->see('The category description');
    }
}
