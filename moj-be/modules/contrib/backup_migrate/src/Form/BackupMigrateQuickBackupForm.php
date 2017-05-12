<?php

/**
 * @file
 * Contains \Drupal\backup_migrate\Form\BackupMigrateQuickBackupForm.
 */

namespace Drupal\backup_migrate\Form;

use BackupMigrate\Drupal\Config\DrupalConfigHelper;
use Drupal\backup_migrate\Entity\SettingsProfile;
use Drupal\Component\Utility\Unicode;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a form for performing a 1-click site backup.
 */
class BackupMigrateQuickBackupForm extends FormBase {

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

    // Theme the form if we want it inline.
    // @FIXME
    // $form['#theme'] = 'backup_migrate_ui_manual_quick_backup_form_inline';

    $bam = backup_migrate_get_service_object();

    $form['quickbackup'] = array(
      '#type' => 'fieldset',
      "#title" => t("Quick Backup"),
      "#collapsible" => FALSE,
      "#collapsed" => FALSE,
      "#tree" => FALSE,
    );

    $form['quickbackup']['source_id'] = DrupalConfigHelper::getSourceSelector($bam, t('Backup Source'));
    $form['quickbackup']['destination_id'] = DrupalConfigHelper::getDestinationSelector($bam, t('Backup Destination'));
    $form['quickbackup']['settings_profile_id'] = DrupalConfigHelper::getSettingsProfileSelector(t('Settings Profile'));

    // Create the service
//    $bam = backup_migrate_get_service_object();
//    $bam->setConfig($config);
//    $bam->plugins()->get('namer')->confGet('filename');

    // $form['quickbackup']['source_id'] = _backup_migrate_get_source_pulldown(\Drupal::config('backup_migrate.settings')->get('backup_migrate_source_id'));
    // $form['quickbackup']['destination'] = _backup_migrate_get_destination_pulldown('manual backup', \Drupal::config('backup_migrate.settings')->get('backup_migrate_destination_id'), \Drupal::config('backup_migrate.settings')->get('backup_migrate_copy_destination_id'));

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
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $config = [];

    // Load the settings profile if one is selected.
    if (!empty($values['settings_profile_id'])) {
      $config = SettingsProfile::load($values['settings_profile_id'])->get('config');
    }

    backup_migrate_perform_backup($values['source_id'], $values['destination_id'], $config);
  }


}
