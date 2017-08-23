<?php

namespace App\Http\Controllers;

use App\Helpers\HubBackLink;

class GamesController extends Controller
{
	function showGamesLandingPage()
	{
		return view('games.landingPage');
	}

	function showGamesChess()
	{
	    $backlink = HubBackLink::getBackLink();

	    return view('games.chess',
        [
          'backlink' => $backlink,
        ]
      );
	}

	function showGamesSudoku()
	{
	    $backlink = HubBackLink::getBackLink();

		return view('games.sudoku',
      [
        'backlink' => $backlink,
      ]
    );
	}

	function showGamesDraughts()
	{
      $backlink = HubBackLink::getBackLink();

		return view('games.draughts',
      [
        'backlink' => $backlink,
      ]
    );
	}
    function showGamesNeontroids()
    {
        $backlink = HubBackLink::getBackLink();

        return view('games.neontroids',
          [
            'backlink' => $backlink,
          ]
        );
    }

}