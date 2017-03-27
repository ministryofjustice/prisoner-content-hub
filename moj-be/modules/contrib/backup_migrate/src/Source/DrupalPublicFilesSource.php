<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Source\DrupalPublicFilesSource
 */


namespace BackupMigrate\Drupal\Source;


use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Source\FileDirectorySource;

/**
 * Class DrupalPublicFilesSource
 * @package BackupMigrate\Drupal\Source
 */
class DrupalPublicFilesSource extends FileDirectorySource {
  /**
   * Get the default values for the plugin.
   *
   * @return \BackupMigrate\Core\Config\Config
   */
  public function configDefaults() {
    $config = [
      'directory' => 'public://',
    ];

    return new Config($config);
  }
}