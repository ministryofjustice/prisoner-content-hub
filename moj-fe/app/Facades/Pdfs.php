<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Pdfs extends Facade {
  protected static function getFacadeAccessor() {
    return 'pdfs.repository';
  }
}