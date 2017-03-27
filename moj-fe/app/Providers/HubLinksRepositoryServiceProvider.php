<?php

namespace App\Providers;

use App\Models\Video;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class HubLinksRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('hublinks.repository', 'App\Repositories\HubLinksRepository');
  }

  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}