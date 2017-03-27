<?php

namespace App\Providers;

use App\Models\News;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class NewsRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('news.repository', 'App\Repositories\NewsRepository');
  }

  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}
