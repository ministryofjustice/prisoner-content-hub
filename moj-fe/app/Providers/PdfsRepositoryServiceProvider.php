<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

class PdfsRepositoryServiceProvider extends ServiceProvider {

  public function register() {
    $this->app->bind('pdfs.repository', 'App\Repositories\PdfsRepository');
  }

  public function boot(DispatcherContract $events)
  {
    parent::boot($events);
  }

}
