<?php

namespace App\Providers;

use App\Models\Video;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class VideosRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('videos.repository', 'App\Repositories\VideosRepository');
  }

  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}
