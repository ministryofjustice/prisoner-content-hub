<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Plugin\BackupMigrateSource\FileDirectorySourcePlugin
 */


namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;
use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;

/**
 * Defines an mysql source plugin.
 *
 * @BackupMigrateSourcePlugin(
 *   id = "FileDirectory",
 *   title = @Translation("File Directory"),
 *   description = @Translation("Back up a server file directory."),
 *   wrapped_class = "\BackupMigrate\Core\Source\FileDirectorySource"
 * )
 */
class FileDirectorySourcePlugin extends SourcePluginBase {}
