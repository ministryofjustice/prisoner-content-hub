<?php

namespace App\Providers;

use App\Models\Radio;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class RadiosRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('radios.repository', 'App\Repositories\RadiosRepository');
  }

  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}
