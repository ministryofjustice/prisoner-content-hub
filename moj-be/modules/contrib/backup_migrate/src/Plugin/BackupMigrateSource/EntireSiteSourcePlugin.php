<?php

namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Drupal\Source\DrupalMySQLiSource;
use BackupMigrate\Core\Main\BackupMigrateInterface;
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

  protected $db_source;

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
      $this->db_source = new DrupalMySQLiSource(new Config($info));
      return new DrupalSiteArchiveSource($conf, $this->db_source);
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    if ($source = $this->getObject()) {
      $bam->sources()->add($key, $source);
      $bam->sources()->add('default_db', $this->db_source);
    }
  }

}
