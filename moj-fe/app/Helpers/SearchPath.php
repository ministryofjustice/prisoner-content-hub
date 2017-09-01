<?php

namespace App\Helpers;

class SearchPath
{
    static $locale;

    public static function getSearchPath()
    {
        self::$locale = \App::getLocale();
        return self::$locale === 'cy' ? '/cy/search' : '/search';
    }
}