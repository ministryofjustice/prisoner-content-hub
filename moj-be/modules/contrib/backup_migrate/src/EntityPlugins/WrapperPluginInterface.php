<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\EntityPlugins\WrapperPluginInterface
 */


namespace BackupMigrate\Drupal\EntityPlugins;

use BackupMigrate\Core\Main\BackupMigrateInterface;
use Drupal\Component\Plugin\ConfigurablePluginInterface;

/**
 * An interface for a plugin which wraps a Backup and Migrate plugin.
 *
 * Class WrapperPluginInterface
 * @package BackupMigrate\Drupal\EntityPlugins
 */
interface WrapperPluginInterface extends ConfigurablePluginInterface {
  /**
   * Alter the backup and migrate object to add the source and required services.
   *
   * @param \BackupMigrate\Core\Main\BackupMigrateInterface $bam
   *  The BackupMigrate object to add plugins and services to.
   * @param $key
   *  The id of the source to add.
   * @param array $options
   *  The alter options.
   *  @see hook_backup_migrate_service_object_alter()
   * @return mixed
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []);
}