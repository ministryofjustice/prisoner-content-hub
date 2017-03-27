<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Plugin\BackupMigrateSource\DefaultDBSourcePlugin
 */


namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;


use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Source\MySQLiSource;
use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;
use BackupMigrate\Drupal\Source\DrupalSiteArchiveSource;

/**
 * Defines an default database source plugin.
 *
 * @BackupMigrateSourcePlugin(
 *   id = "EntireSite",
 *   title = @Translation("Entire Site"),
 *   description = @Translation("Back up the entire Drupal site."),
 *   locked = true
 * )
 */
class EntireSiteSourcePlugin extends SourcePluginBase {

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
      $conf->set('directory', DRUPAL_ROOT);
      $db = new MySQLiSource(new Config($info));
      return new DrupalSiteArchiveSource($conf, $db);
    }

    return null;
  }

}