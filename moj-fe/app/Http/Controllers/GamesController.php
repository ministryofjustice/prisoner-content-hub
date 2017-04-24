<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class GamesController extends Controller {

  function showGamesLandingPage() {

    return view('games.landingPage');
  }

    function showGamesChess() {

        return view('games.chess');
    }
}
