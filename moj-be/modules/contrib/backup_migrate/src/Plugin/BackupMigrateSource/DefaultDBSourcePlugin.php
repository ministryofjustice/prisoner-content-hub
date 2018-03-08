<?php

namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Filter\DBExcludeFilter;
use BackupMigrate\Core\Main\BackupMigrateInterface;
use BackupMigrate\Drupal\Source\DrupalMySQLiSource;
use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;

/**
 * Defines an default database source plugin.
 *
 * @BackupMigrateSourcePlugin(
 *   id = "DefaultDB",
 *   title = @Translation("Default Database"),
 *   description = @Translation("Back up the Drupal db."),
 *   locked = true
 * )
 */
class DefaultDBSourcePlugin extends SourcePluginBase {

  /**
   * Get the Backup and Migrate plugin object.
   *
   * @return BackupMigrate\Core\Plugin\PluginInterface;
   */
  public function getObject() {
    // Add the default database.
    $info = \Drupal\Core\Database\Database::getConnectionInfo('default', 'default');
    $info = $info['default'];

    // Set a default port if none is set. Because that's what core does.
    $info['port'] = (empty($info['port']) ? 3306 : $info['port']);
    if ($info['driver'] == 'mysql') {
      $conf = $this->getConfig();
      foreach ($info as $key => $value) {
        $conf->set($key, $value);
      }
      return new DrupalMySQLiSource($conf);
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    if ($source = $this->getObject()) {
      $bam->sources()->add($key, $source);
      // @TODO: This needs a better solution.
      $config = [
        'exclude_tables' => [],
        'nodata_tables' => [
          'cache_advagg_minify',
          'cache_bootstrap',
          'cache_config',
          'cache_container',
          'cache_data',
          'cache_default',
          'cache_discovery',
          'cache_discovery_migration',
          'cache_dynamic_page_cache',
          'cache_entity',
          'cache_menu',
          'cache_migrate',
          'cache_render',
          'cache_rest',
          'cache_toolbar',
          'sessions',
          'watchdog',
          'webprofiler',
        ],
      ];

      // @TODO: Allow modules to add their own excluded tables.
      $bam->plugins()->add('db_exclude', new DBExcludeFilter(new Config($config)));
    }
  }

}
