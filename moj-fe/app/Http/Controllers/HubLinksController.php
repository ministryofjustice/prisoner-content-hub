<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Facades\HubLinks;
use App\Facades\Search;
use App\Facades\NewContent;
use App\Helpers\LangSelectPath;
use App\Helpers\HubBackLink;
use App\Http\Controllers\Controller;

class HubLinksController extends Controller
{

    function getItem(Request $request, $id = null)
    {
        $page_data = HubLinks::getItem($id, $request->input('user_id'));
        $path = LangSelectPath::getPath($request->path());
        $backlink = HubBackLink::getBackLink();
        $new_content = HubLinks::checkNewContent($request->input('user_id'));


        return view(
          'hub.item',
          [
            'page' => $page_data,
            'path' => $path,
            'backlink' => $backlink,
            'newcontent' => $new_content,
          ]
        );
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

    function getNewContent(Request $request, $id = null)
    {
        $page_data = NewContent::getItem($request->input('user_id'));
        $path = LangSelectPath::getPath($request->path());
        $backlink = HubBackLink::getBackLink();

        return view(
          'hub.newcontent',
          [
            'page' => $page_data,
            'path' => $path,
            'backlink' => $backlink,
          ]
        );
    }

    function searchContent(Request $request)
    {
        $keywords = Input::get('q', '');
        $results = Search::getResults($request->input('user_id'), $keywords);
        $path = LangSelectPath::getPath($request->path());
        $backlink = HubBackLink::getBackLink();

        return view(
          'hub.search',
          [
            'results' => $results,
            'path' => $path,
            'backlink' => $backlink,
            'keywords' => $keywords,
          ]
        );
    }

}
