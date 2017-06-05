<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Facades\HubLinks;
use App\Helpers\LangSelectPath;
use App\Helpers\HubBackLink;
use App\Http\Controllers\Controller;

class HubLinksController extends Controller
{
	function getItem(Request $request, $id = NULL)
	{
		$page_data = HubLinks::getItem($id, $request->input('user_id'));
		$path = LangSelectPath::getPath($request->path());
		$backlink = HubBackLink::getBackLink();

		return view('hub.item', [
			'page' => $page_data,
			'path' => $path,
			'backlink' => $backlink
		]);
	}

	function showHubPage()
	{
		$links = HubLinks::topLevelItems();

		return view('hub.hub', ['links' => $links]);
	}

	function showHubSubPage($tid)
	{
		$links = HubLinks::subLevelItems($tid);

		return view('hub.subHub', ['links' => $links]);
	}
}
