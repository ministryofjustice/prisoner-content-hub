<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Plugin\BackupMigrateSource\DefaultDBSourcePlugin
 */


namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;


use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Filter\DBExcludeFilter;
use BackupMigrate\Core\Main\BackupMigrateInterface;
use BackupMigrate\Core\Source\MySQLiSource;
use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;
use BackupMigrate\Drupal\Source\DrupalSiteArchiveSource;

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
    if ($info['driver'] == 'mysql') {
      $conf = $this->getConfig();
      foreach ($info as $key => $value) {
        $conf->set($key, $value);
      }
      return new MySQLiSource($conf);
    }

    return null;
  }

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    if ($source = $this->getObject()) {
      $bam->sources()->add($key, $source);

      $config = [
        'exclude_tables' => [],
        'nodata_tables' => [],
      ];

      // @TODO: Allow modules to add their own excluded tables.
      $bam->plugins()->add('db_exclude', new DBExcludeFilter(new Config($config)));
    }
  }

}