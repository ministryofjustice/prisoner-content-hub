<?php

namespace App\Http\Controllers;

use App\Facades\Videos;
use App\Http\Controllers\Controller;
use App\Models\Video;
use App\User;

class VideosController extends Controller {

  function showVideoLandingPage() {
    $videos = Videos::landingPageVideos();
    $recentVideos = Videos::getRecent();

    return view('video.landingPage', ['videos' => $videos, 'recentVideos' => $recentVideos]);
  }

  function show($nid) {
    $video = Videos::find($nid);
    $categoryEpisodes = Videos::getCategoryEpisodes($nid);

    return view('video.detail', ['video' => $video, 'categoryEpisodes' => $categoryEpisodes]);
  }

  function showChannelLandingPage($tid) {
	  $data = Videos::channelLandingPage($tid);
	  
	  return view('video.channelLandingPage', ['data' => $data]);	  
  }
}