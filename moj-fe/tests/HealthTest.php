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
        $this->healthController = new HealthController();
    }

    public function setUp()
    {
        $this->timeStamp = time();
    }

    public function testResponseContentIsADateStamep()
    {
       $this->assertEquals($this->healthController->checkHealth()->getContent(), $this->timeStamp);
    }

    public function testResponseCodeIs200()
    {
        $this->assertEquals($this->healthController->checkHealth()->getStatusCode(), 200);
    }

}
