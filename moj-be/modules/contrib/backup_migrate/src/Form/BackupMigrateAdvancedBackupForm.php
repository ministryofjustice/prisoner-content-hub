<?php

/**
 * @file
 * Contains \Drupal\backup_migrate\Form\BackupMigrateQuickBackupForm.
 */

namespace Drupal\backup_migrate\Form;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Drupal\Config\DrupalConfigHelper;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a form for performing a 1-click site backup.
 */
class BackupMigrateAdvancedBackupForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'backup_migrate_ui_manual_backup_advanced';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = array();

    // Theme the form if we want it inline.
    // @FIXME
    // $form['#theme'] = 'backup_migrate_ui_manual_quick_backup_form_inline';
    
    $bam = backup_migrate_get_service_object();

    $form['source'] = array(
      '#type' => 'fieldset',
      "#title" => t("Source"),
      "#collapsible" => TRUE,
      "#collapsed" => FALSE,
      "#tree" => FALSE,
    );
    $form['source']['source_id'] = DrupalConfigHelper::getSourceSelector($bam, t('Backup Source'));
    $form['source']['source_id']['#default_value'] = \Drupal::config('backup_migrate.settings')->get('backup_migrate_source_id');

    $form += DrupalConfigHelper::buildAllPluginsForm($bam->plugins(), 'backup');

    $form['destination'] = array(
      '#type' => 'fieldset',
      "#title" => t("Destination"),
      "#collapsible" => TRUE,
      "#collapsed" => FALSE,
      "#tree" => FALSE,
    );

    $form['destination']['destination_id'] = DrupalConfigHelper::getDestinationSelector($bam, t('Backup Destination'));
    $form['destination']['destination_id']['#default_value'] = \Drupal::config('backup_migrate.settings')->get('backup_migrate_destination_id');

    $form['quickbackup']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Backup now'),
      '#weight' => 1,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    $bam = backup_migrate_get_service_object($form_state->getValues());

    // Let the plugins validate their own config data.
    if ($plugin_errors = $bam->plugins()->map('configErrors', array('operation' => 'backup'))) {
      foreach ($plugin_errors as $plugin_key => $errors) {
        foreach ($errors as $error) {
          $form_state->setErrorByName($plugin_key . '][' . $error->getFieldKey(), $this->t($error->getMessage(), $error->getReplacement()));
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $form_state->getValues();
    backup_migrate_perform_backup($config['source_id'], $config['destination_id'], $config);
  }


}
