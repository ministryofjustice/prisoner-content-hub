<?php

namespace BackupMigrate\Drupal\Filter;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Filter\FileExcludeFilter;

/**
 * Class DrupalPublicFileExcludeFilter.
 *
 * A file exclusion filter that includes Drupal's cache directories by default.
 *
 * @package BackupMigrate\Drupal\Filter
 */
class DrupalPublicFileExcludeFilter extends FileExcludeFilter {
  /**
   * Get the default values for the plugin.
   *
   * @return \BackupMigrate\Core\Config\Config
   */
  public function configDefaults() {
    $config = [
      'exclude_filepaths' => [
        'js',
        'css',
        'php',
        'styles',
        'config_*',
        '.htaccess',
      ],
    ];

    // @TODO: Allow modules to add their own excluded defaults.
    return new Config($config);
  }

}
