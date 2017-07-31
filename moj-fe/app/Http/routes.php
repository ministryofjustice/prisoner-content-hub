<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the controller to call when that URI is requested.
  |
 */

Route::group(['prefix' => LaravelLocalization::setLocale()], function()
{
    Route::get('/', ['as' => 'hub.landing', 'uses' => 'HubLinksController@getItem']);
    Route::get('/hub/{id?}', ['as' => 'hub.sub', 'uses' => 'HubLinksController@getItem']);
		Route::get('/new-content', ['as' => 'hub.newcontent', 'uses' => 'HubLinksController@getNewContent']);
		Route::get('/search', ['as' => 'hub.seach', 'uses' => 'HubLinksController@searchContent']);

    Route::get('/video', ['as' => 'video.landing', 'uses' => 'VideosController@showVideoLandingPage']);
    Route::get('/video/{nid}', ['as' => 'video.detail', 'uses' => 'VideosController@show']);
    Route::get('/video/channel/{tid}', ['as' => 'video.channel', 'uses' => 'VideosController@showChannelLandingPage']);

    Route::get('/radio', ['as' => 'radio.landing', 'uses' => 'RadiosController@showRadioLandingPage']);
    Route::get('/radio/{nid}', ['as' => 'radio.detail', 'uses' => 'RadiosController@show']);

    Route::get('/education/{tid}', ['as' => 'pdf.landing', 'uses' => 'PdfsController@showPdfLandingPage']);
    Route::get('/education/course/{tid}', ['as' => 'pdf.detail', 'uses' => 'PdfsController@show']);
    Route::get('/epub', ['as' => 'pdf.epub', 'uses' => 'PdfsController@epub']);

    Route::get('/games/chess', ['as' => 'games.chess', 'uses' => 'GamesController@showGamesChess']);
    Route::get('/games/sudoku', ['as' => 'games.sudoku', 'uses' => 'GamesController@showGamesSudoku']);
    Route::get('/games/draughts', ['as' => 'games.draughts', 'uses' => 'GamesController@showGamesDraughts']);
    Route::get('/games/neontroids', ['as' => 'games.neontroids', 'uses' => 'GamesController@showGamesNeontroids']);
});
Route::get('/news', 'NewsController@showNewsLandingPage');
