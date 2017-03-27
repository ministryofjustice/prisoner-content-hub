<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Videos extends Facade {
  protected static function getFacadeAccessor() {
    return 'videos.repository';
  }
}
