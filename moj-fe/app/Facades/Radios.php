<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Radios extends Facade {
  protected static function getFacadeAccessor() {
    return 'radios.repository';
  }
}
