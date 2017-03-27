<?php

namespace App\Helpers;

class LangSelectPath {
  public static function getPath($path)
  {
    $parts = explode('/', $path);
		if($parts[0] == 'cy' && empty($parts[1]))
		{
			array_shift($parts);
      $url = implode('/', $parts);
      return $url . '/';
		}
    if($parts[0] == 'cy' && $parts[1] == 'hub')
		{
			array_shift($parts);
      $url = implode('/', $parts);
      return '/' . $url . '/';
		}

    if($parts[0] == 'hub')
		{
      $url = implode('/', $parts);
      return '/' . $url;
		}

  }
}
