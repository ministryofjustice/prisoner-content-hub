<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class NewContentRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('newcontent.repository', 'App\Repositories\NewContentRepository');
  }
  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}