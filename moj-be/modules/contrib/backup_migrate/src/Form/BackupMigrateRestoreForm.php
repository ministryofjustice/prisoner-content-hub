<?php

/**
 * @file
 * Contains \Drupal\backup_migrate\Form\BackupMigrateQuickBackupForm.
 */

namespace Drupal\backup_migrate\Form;

use BackupMigrate\Drupal\Config\DrupalConfigHelper;
use Drupal\Component\Utility\Unicode;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a form for performing a 1-click site backup.
 */
class BackupMigrateRestoreForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'backup_migrate_ui_manual_backup_quick';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = array();

    $bam = backup_migrate_get_service_object();

    $form['backup_migrate_restore_upload'] = array(
      '#title' => t('Upload a Backup File'),
      '#type' => 'file',
      '#description' => t("Upload a backup file created by Backup and Migrate. For other database or file backups please use another tool for import. Max file size: %size", array("%size" => format_size(file_upload_max_size()))),
    );

    $form['source_id'] = DrupalConfigHelper::getPluginSelector(
      $bam->sources(), $this->t('Restore To'));


    $conf_schema = $bam->plugins()->map('configSchema', array('operation' => 'restore'));
    $form += DrupalConfigHelper::buildFormFromSchema($conf_schema, $bam->plugins()->config());

    $form['quickbackup']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Restore now'),
      '#weight' => 1,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $form_state->getValues();
    backup_migrate_perform_restore($config['source_id'], 'upload', 'backup_migrate_restore_upload', $config);
  }


}
