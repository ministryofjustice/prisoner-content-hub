<?php
/**
 * Created by PhpStorm.
 * User: stevenwilson
 * Date: 22/08/2017
 * Time: 15:27
 */

namespace App\Helpers;


class TranslatedDate
{
    static $locale;

    public static function getTranslatedDate(){

        self::$locale = \App::getLocale();

        switch (self::$locale) {
            case 'cy':
                setlocale(LC_TIME, 'cy_CA.UTF-8');
                return strftime("%B %e, %G");
                break;
            default:
                setlocale(LC_TIME, 'en_CA.UTF-8');
                return strftime("%e %B %G");
                break;
        }
    }
}