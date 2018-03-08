<?php

namespace Drupal\backup_migrate\Plugin\BackupMigrateDestination;

use BackupMigrate\Drupal\EntityPlugins\DestinationPluginBase;

/**
 * Defines a file directory destination plugin.
 *
 * @BackupMigrateDestinationPlugin(
 *   id = "Directory",
 *   title = @Translation("Server File Directory"),
 *   description = @Translation("Back up to a directory on your web server."),
 *   wrapped_class = "\BackupMigrate\Drupal\Destination\DrupalDirectoryDestination"
 * )
 */
class DirectoryDestinationPlugin extends DestinationPluginBase {}
