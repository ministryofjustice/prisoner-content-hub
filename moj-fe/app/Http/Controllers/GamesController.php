<?php

namespace App\Http\Controllers;

use /** @noinspection PhpUnusedAliasInspection */
	App\Http\Controllers\Controller;

class GamesController extends Controller
{
	function showGamesLandingPage()
	{
		return view('games.landingPage');
	}

	function showGamesChess()
	{
		return view('games.chess');
	}

	function showGamesSudoku()
	{
		return view('games.sudoku');
	}

	function showGamesDraughts()
	{
		return view('games.draughts');
	}
    function showGamesNeontroids()
    {
        return view('games.neontroids');
    }

}