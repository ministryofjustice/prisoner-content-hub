<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Filter\DrupalUtils
 */


namespace BackupMigrate\Drupal\Filter;
use BackupMigrate\Core\File\BackupFileReadableInterface;
use BackupMigrate\Core\Plugin\PluginBase;
use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Translation\TranslatableTrait;
use Drupal\Core\Database\Database;


/**
 * Class DrupalUtils
 * @package BackupMigrate\Drupal\Filter
 */
class DrupalUtils extends PluginBase {

  /**
   * @var boolean Whether the site was put in maintenance mode before the operation.
   */
  protected $maintenance_mode;

  /**
   * {@inheritdoc}
   */
  public function configSchema($params = array()) {
    $schema = array();

    // Backup configuration

    if ($params['operation'] == 'backup' || $params['operation'] == 'restore') {
      $schema['groups']['advanced'] = [
        'title' => 'Advanced Settings',
      ];
      $schema['fields']['site_offline'] = [
        'group' => 'advanced',
        'type' => 'boolean',
        'title' => $this->t('Take site offline'),
        'description' => $this->t('Take the site offline during backup and show a maintenance message. Site will be taken back online once the backup is complete.'),
      ];
    }
    return $schema;
  }

  /**
   * Get the default values for the plugin.
   *
   * @return \BackupMigrate\Core\Config\Config
   */
  public function configDefaults() {
    return new Config([
      'disable_query_log' => TRUE,
      'site_offline' => FALSE,
    ]);
  }


  /**
   * Run before the backup/restore begins.
   */
  public function setUp() {
    $this->takeSiteOffline();
  }

  /**
   * Run after the operation is complete.
   */
  public function tearDown() {
    $this->takeSiteOnline();
  }

  /**
   * Take the site offline if we need to.
   */
  protected function takeSiteOffline() {
    // Take the site offline.
    if ($this->confGet('site_offline') && !\Drupal::state()->get('system.maintenance_mode')) {
      \Drupal::state()->set('system.maintenance_mode', TRUE);
      $this->maintenance_mode = TRUE;
    }
  }

  /**
   * Take the site online if it was taken offline for this operation.
   */
  protected function takeSiteOnline() {
    // Take the site online again.
    if ($this->maintenance_mode) {
      \Drupal::state()->set('system.maintenance_mode', FALSE);
    }
  }

}