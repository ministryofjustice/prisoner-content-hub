<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Form\BackupDeleteForm
 */


namespace Drupal\backup_migrate\Form;


use BackupMigrate\Drupal\Config\DrupalConfigHelper;
use Drupal\backup_migrate\Entity\Destination;
use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;

class BackupRestoreForm extends ConfirmFormBase {

  /**
   * @var Destination
   */
  var $destination;

  /**
   * @var string
   */
  var $backup_id;

  /**
   * Returns the question to ask the user.
   *
   * @return string
   *   The form question. The page title will be set to this value.
   */
  public function getQuestion() {
    return $this->t('Are you sure you want to restore this backup?');
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Restore');
  }

  /**
   * Returns the route to go to if the user cancels the action.
   *
   * @return \Drupal\Core\Url
   *   A URL object.
   */
  public function getCancelUrl() {
    return $this->destination->toUrl('backups');
  }

  /**
   * Returns a unique string identifying the form.
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'backup_migrate_backup_restore_confirm';
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   * @param null $backup_migrate_destination
   * @param null $backup_id
   * @return array
   */
  public function buildForm(array $form, FormStateInterface $form_state, $backup_migrate_destination = NULL, $backup_id = NULL) {
    $this->destination = $backup_migrate_destination;
    $this->backup_id = $backup_id;

    $bam = backup_migrate_get_service_object();
    $form['source_id'] = DrupalConfigHelper::getPluginSelector($bam->sources(), $this->t('Restore To'));

    $conf_schema = $bam->plugins()->map('configSchema', array('operation' => 'restore'));
    $form += DrupalConfigHelper::buildFormFromSchema($conf_schema, $bam->plugins()->config());

    return parent::buildForm($form, $form_state);
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $form_state->getValues();
    backup_migrate_perform_restore($config['source_id'], $this->destination->id(), $this->backup_id, $config);

    $form_state->setRedirectUrl($this->getCancelUrl());
  }
}