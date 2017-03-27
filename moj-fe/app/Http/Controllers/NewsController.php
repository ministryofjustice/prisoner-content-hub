<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News as NewsItem;
use App\Facades\News;

class NewsController extends Controller {

  function showNewsLandingPage() {
    $news = News::landingPageNews();

    $groupedNews = array();
    $promotedNews = array();

    foreach($news as $item) {
      if ($item->isSticky()) {
        $promotedNews[] = $item;
        continue;
      }

      $daysAgo = $item->postAge();
      $daysAgo = $daysAgo > 7 ? 8 : $daysAgo;
      $groupedNews[$daysAgo][] = $item;
    }

    return view('news.landingPage', ['promoted' => $promotedNews, 'news' => $groupedNews]);
  }
}
