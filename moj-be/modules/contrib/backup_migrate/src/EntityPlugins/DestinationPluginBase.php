<?php

namespace BackupMigrate\Drupal\EntityPlugins;

use BackupMigrate\Core\Main\BackupMigrateInterface;

/**
 * Class DestinationPluginBase.
 *
 * @package BackupMigrate\Drupal\EntityPlugins
 */
abstract class DestinationPluginBase extends WrapperPluginBase implements DestinationPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    $bam->destinations()->add($key, $this->getObject());
  }

}
