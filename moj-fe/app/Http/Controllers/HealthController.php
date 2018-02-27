<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\Response;

class HealthController extends Controller
{
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    function checkHealth()
  {
    // Use plain response with timestamp
    $response = new Response();
    $response->setContent(time());
    return $response;
  }
}
