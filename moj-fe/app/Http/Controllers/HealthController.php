<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class HealthController extends Controller
{
  function checkHealth()
  {
    // Disable page cache
  //  $this->killSwitch->trigger();

    // Use plain response with timestamp
    $response = new Response();
    $response->setContent(time());

    return $response;

    // return view('hub.hub', ['links' => $links]);
  }
}
