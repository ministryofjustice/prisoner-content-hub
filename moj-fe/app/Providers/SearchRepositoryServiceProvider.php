<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class SearchRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('search.repository', 'App\Repositories\SearchRepository');
  }
  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}