<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Symfony\Component\HttpKernel\Exception\HttpException;

use App\Facades\Videos;
use App\Models\Video;

class ErrorPageTest extends TestCase
{
    /**
     * Tests for a 404 against the front end's routes.
     */
    public function testRouting404()
    {
        try {
            $this->visit('/notavalidroute');
        } catch (Exception $e) {
            $this->assertContains("Received status code [404]", $e->getMessage());
        }
    }

    /**
     * Tests for an API 404 error.
     */
    public function testApi404()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(12345)
          ->once()
          ->andThrow(new HttpException(404, 'There is no video with this ID.'));

        $response = $this->call('GET', '/video/12345');
        $this->assertEquals(404, $response->status());
        $this->assertContains('Page 404 error.', $response->content());
        $this->assertContains('There is no video with this ID.', $response->content());
    }

    /**
     * Tests for an API 403 error.
     */
    public function testApi403()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(12345)
          ->once()
          ->andThrow(new HttpException(403, 'You do not have permission to view this video.'));
        
        $response = $this->call('GET', '/video/12345');
        $this->assertEquals(403, $response->status());
        $this->assertContains('Page 403 error.', $response->content());
        $this->assertContains('You do not have permission to view this video.', $response->content());
    }

    /**
     * Tests for an API 500 error.
     */
    public function testApi500()
    {
        \App\Facades\Videos::shouldReceive('find')
          ->with(12345)
          ->once()
          ->andThrow(new HttpException(500, 'Internal server error.'));
        
        $response = $this->call('GET', '/video/12345');
        $this->assertEquals(500, $response->status());
        $this->assertContains('Page 500 error.', $response->content());
        $this->assertContains('Internal server error.', $response->content());
    }
}