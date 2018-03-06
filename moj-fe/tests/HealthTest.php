<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Http\Controllers\HealthController;

class HealthTest extends TestCase
{
    protected $timeStamp;
    protected $healthController;

    public function __construct()
    {
    }

    public function setUp()
    {
        parent::setUp();
        $this->healthController = new HealthController();
    }

    public function tearDown()
    {
        parent::tearDown();
    }

    public function testFrontEndCheckHealthEndpointCodeIs200()
    {
        $HttpResponse = $this->healthController->getResponse();

        $this->assertEquals($HttpResponse->getStatusCode(), 200);
    }

    public function testHttpResponseIsJson()
    {
        $this->healthController->setHttpResponse();
        $HttpResponse = $this->healthController->getResponse();

        $this->assertEquals($HttpResponse->headers->get('Content-Type'), 'application/json');
    }

    public function testHttpResponseHasTimeStamp()
    {
        $this->healthController->setHttpResponse();
        $HttpResponse = $this->healthController->getResponse();
        $Json = json_decode($HttpResponse->getContent());

        $this->assertEquals($Json->timestamp, time());
    }
}