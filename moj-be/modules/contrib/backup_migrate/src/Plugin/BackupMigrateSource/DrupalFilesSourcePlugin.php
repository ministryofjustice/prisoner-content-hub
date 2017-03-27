<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Plugin\BackupMigrateSource\DefaultDBSourcePlugin
 */


namespace Drupal\backup_migrate\Plugin\BackupMigrateSource;


use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Filter\FileExcludeFilter;
use BackupMigrate\Core\Main\BackupMigrateInterface;
use BackupMigrate\Core\Source\MySQLiSource;
use BackupMigrate\Drupal\EntityPlugins\SourcePluginBase;

/**
 * Defines an default database source plugin.
 *
 * @BackupMigrateSourcePlugin(
 *   id = "DrupalFiles",
 *   title = @Translation("Public Files"),
 *   description = @Translation("Back up the Drupal public files."),
 *   wrapped_class = "\BackupMigrate\Core\Source\FileDirectorySource",
 *   locked = true
 * )
 */
class DrupalFilesSourcePlugin extends SourcePluginBase {

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []) {
    $source = $this->getObject();
    $bam->sources()->add($key, $source);

    $config = [
      'exclude_filepaths' => [],
      'source' => $source
    ];

    switch ($this->getConfig()->get('directory')) {
      case 'public://':
        $config['exclude_filepaths'] = [
          'js',
          'css',
          'php',
          'styles',
          'config_*',
          '.htaccess',
        ];
        break;
      case 'private://':
        $config['exclude_filepaths'] = [
          'backup_migrate',
        ];
        break;
    }

    // @TODO: Allow modules to add their own excluded defaults.

    $bam->plugins()->add($key . '_exclude', new FileExcludeFilter(new Config($config)));
  }
}