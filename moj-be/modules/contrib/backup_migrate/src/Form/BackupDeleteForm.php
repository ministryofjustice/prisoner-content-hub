<?php
/**
 * @file
 * Contains Drupal\backup_migrate\Form\BackupDeleteForm
 */


namespace Drupal\backup_migrate\Form;


use Drupal\backup_migrate\Entity\Destination;
use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;

class BackupDeleteForm extends ConfirmFormBase {

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
    return $this->t('Are you sure you want to delete this backup?');
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->t('This will permanently remove %backup_id from %destination_name.',
      [
        '%backup_id' => $this->backup_id,
        '%destination_name' => $this->destination->label()
      ]
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Delete');
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
    return 'backup_migrate_backup_delete_confirm';
  }


  public function buildForm(array $form, FormStateInterface $form_state, $backup_migrate_destination = NULL, $backup_id = NULL) {
    $this->destination = $backup_migrate_destination;
    $this->backup_id = $backup_id;

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
    $destination = $this->destination->getObject();
    $destination->deleteFile($this->backup_id);
    $form_state->setRedirectUrl($this->getCancelUrl());
  }
}