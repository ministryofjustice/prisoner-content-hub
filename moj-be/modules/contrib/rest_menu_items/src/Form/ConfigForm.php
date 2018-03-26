<?php

namespace Drupal\rest_menu_items\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class ConfigForm.
 */
class ConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'rest_menu_items.config',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('rest_menu_items.config');
    $form['output_values'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('What values do you need in the output?'),
      '#options' => [
        'key' => $this->t('Key'),
        'title' => $this->t('Ttitle'),
        'description' => $this->t('Description'),
        'uri' => $this->t('Uri'),
        'alias' => $this->t('Alias'),
        'external' => $this->t('External'),
        'absolute' => $this->t('Absolute'),
        'relative' => $this->t('Relative'),
        'existing' => $this->t('Existing'),
        'weight' => $this->t('Weight'),
        'expanded' => $this->t('Expanded'),
        'enabled' => $this->t('Enabled'),
        'uuid' => $this->t('Uuid'),
        'options' => $this->t('Options'),
      ],
      '#default_value' => $config->get('output_values'),
    ];
    return parent::buildForm($form, $form_state);
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
    parent::submitForm($form, $form_state);

    $this->config('rest_menu_items.config')
      ->set('output_values', $form_state->getValue('output_values'))
      ->save();
  }

}
