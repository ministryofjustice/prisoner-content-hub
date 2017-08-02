<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class NewContent extends Facade {
    protected static function getFacadeAccessor() {
        return 'newcontent.repository';
    }
}