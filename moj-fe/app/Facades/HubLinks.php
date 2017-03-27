<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class HubLinks extends Facade {
  protected static function getFacadeAccessor() {
    return 'hublinks.repository';
  }
}