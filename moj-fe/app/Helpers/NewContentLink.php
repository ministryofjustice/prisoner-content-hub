<?php

namespace App\Helpers;

class NewContentLink
{
    static $locale;

    public static function getNewContentLink()
    {
        self::$locale = \App::getLocale();
        return self::$locale === 'cy' ? '/cy/new-content' : '/new-content';
    }
}