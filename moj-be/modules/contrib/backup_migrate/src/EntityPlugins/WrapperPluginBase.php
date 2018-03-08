<?php

namespace BackupMigrate\Drupal\EntityPlugins;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Main\BackupMigrateInterface;
use Drupal\Component\Plugin\PluginBase;

/**
 * Class WrapperPluginBase.
 *
 * A base class for a drupal source or destination wrapper plugin.
 *
 * @package BackupMigrate\Drupal\EntityPlugins
 */
abstract class WrapperPluginBase extends PluginBase implements WrapperPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->setConfiguration($configuration);
  }

  /**
   * Get the Backup and Migrate plugin object.
   *
   * @return BackupMigrate\Core\Plugin\PluginInterface;
   */
  public function getObject() {
    // If the class to wrap was specified in the annotation then add that class.
    $info = $this->getPluginDefinition();
    if ($info['wrapped_class']) {
      return new $info['wrapped_class']($this->getConfig());
    }
  }

  /**
   * {@inheritdoc}
   */
  abstract public function alterBackupMigrate(BackupMigrateInterface $bam, $key, $options = []);

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    $this->configuration = $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    return [];
  }

  /**
   * Return a Backup and Migrate Config object with the plugin configuration.
   *
   * @return \BackupMigrate\Core\Config\Config
   */
  public function getConfig() {
    return new Config($this->getConfiguration());
  }

}
