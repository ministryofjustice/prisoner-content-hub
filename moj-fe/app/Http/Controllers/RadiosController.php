<?php

namespace App\Http\Controllers;

use App\Facades\Radios;
use App\Http\Controllers\Controller;

class RadiosController extends Controller
{

	function showRadioLandingPage()
	{
		$radios = Radios::landingPageRadios();

		return view('radio.landingPage', ['radios' => $radios]);
	}

	function show($nid)
	{
		$radioShow = Radios::show($nid);
		$shows = Radios::channelRadioShows($nid);

		return view('radio.detail', ['radioShow' => $radioShow, 'shows' => $shows]);
	}

}
