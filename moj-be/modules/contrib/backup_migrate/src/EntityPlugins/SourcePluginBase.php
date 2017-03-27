<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\EntityPlugins\DestinationPluginBase
 */


namespace BackupMigrate\Drupal\EntityPlugins;


use BackupMigrate\Core\Main\BackupMigrateInterface;

/**
 * Class SourcePluginBase
 * @package BackupMigrate\Drupal\EntityPlugins
 */
abstract class SourcePluginBase extends WrapperPluginBase implements SourcePluginInterface {

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    $bam->sources()->add($key, $this->getObject());
  }
}