<?php

/**
 * @file
 * Contains \Drupal\backup_migrate\Form\SettingsProfileForm.
 */

namespace Drupal\backup_migrate\Form;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Drupal\Config\DrupalConfigHelper;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsProfileForm.
 *
 * @package Drupal\backup_migrate\Form
 */
class SettingsProfileForm extends EntityForm {
  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);


    $backup_migrate_settings = $this->entity;
    $form['label'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $backup_migrate_settings->label(),
      '#required' => TRUE,
    );

    $form['id'] = array(
      '#type' => 'machine_name',
      '#default_value' => $backup_migrate_settings->id(),
      '#machine_name' => array(
        'exists' => '\Drupal\backup_migrate\Entity\SettingsProfile::load',
      ),
      '#disabled' => !$backup_migrate_settings->isNew(),
    );

    $bam = backup_migrate_get_service_object($backup_migrate_settings->get('config'));

    $form['config'] = DrupalConfigHelper::buildAllPluginsForm($bam->plugins(), 'backup', ['config']);


    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $backup_migrate_settings = $this->entity;

    $status = $backup_migrate_settings->save();

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label Settings Profile.', [
          '%label' => $backup_migrate_settings->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Settings Profile.', [
          '%label' => $backup_migrate_settings->label(),
        ]));
    }
    $form_state->setRedirectUrl($backup_migrate_settings->urlInfo('collection'));
  }

}
