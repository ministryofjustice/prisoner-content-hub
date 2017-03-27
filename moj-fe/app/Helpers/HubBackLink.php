<?php

namespace App\Helpers;

class HubBackLink {

  static $locale = '';

  public static function getBackLink() {
		self::$locale = \App::getLocale();
		switch (self::$locale) {
			case 'cy':
				self::$locale = '/cy';
				break;
			default:
				self::$locale = '';
				break;
		}
		return self::$locale . '/hub';
	}
}
