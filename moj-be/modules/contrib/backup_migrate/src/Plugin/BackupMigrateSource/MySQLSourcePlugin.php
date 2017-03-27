<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Source\MySQLSourcePlugin
 */

namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;

use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;

/**
 * Defines an mysql source plugin.
 *
 * @BackupMigrateSourcePlugin(
 *   id = "MySQL",
 *   title = @Translation("MySQL Database"),
 *   description = @Translation("Back up a MySQL compatible database."),
 *   wrapped_class = "\BackupMigrate\Core\Source\MySQLiSource"
 * )
 */
class MySQLSourcePlugin extends SourcePluginBase {}