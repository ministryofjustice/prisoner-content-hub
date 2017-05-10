<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Config\DrupalConfigHelper
 */


namespace BackupMigrate\Drupal\Config;

use BackupMigrate\Core\Config\ConfigInterface;
use BackupMigrate\Core\Main\BackupMigrateInterface;
use BackupMigrate\Core\Plugin\PluginManagerInterface;
use Drupal\backup_migrate\Entity\SettingsProfile;
use Drupal\Core\Form\FormStateInterface;


/**
 * Class DrupalConfigHelper
 * @package BackupMigrate\Drupal\Config
 */
class DrupalConfigHelper {
  /**
   * Build the configuration form for all plugins in a manager.
   *
   * @param \BackupMigrate\Core\Plugin\PluginManagerInterface $plugins
   *  The PluginManager containing all of the plugins to be configured.
   * @param string $operation
   *  'backup', 'restore', or 'initialize' depending on the operation being configured for.
   * @param array $parents
   *  The form parents array.
   * @return array
   */
  static public function buildAllPluginsForm(PluginManagerInterface $plugins, $operation, $parents = []) {
    $form = [];
    foreach ($plugins->getAll() as $plugin_key => $plugin) {
      $schema = $plugin->configSchema(['operation' => $operation]);
      $config = $plugin->config();

      DrupalConfigHelper::addFieldsFromSchema($form, $schema, $config, array_merge($parents, [$plugin_key]));
    }
    return $form;

  }

  /**
   * Build the configuration form for a single plugin, source or destination.
   *
   * @param \BackupMigrate\Core\Config\ConfigurableInterface $plugin
   *  The plugin, source or destination to build the form for.
   * @param string $operation
   *  'backup', 'restore', or 'initialize' depending on the operation being configured for.
   * @param array $parents
   * @return array
   */
  static public function buildPluginForm($plugin, $operation, $parents = ['config']) {
    $schema = $plugin->configSchema(['operation' => $operation]);
    $config = $plugin->config();

    return DrupalConfigHelper::buildFormFromSchema($schema, $config, $parents);
  }


  /**
   * @param array $schema
   *  A configuration schema from one or more Backup and Migrate plugins.
   * @param \BackupMigrate\Core\Config\ConfigInterface $config
   *  The configuration object containing the default values.
   * @param array $parents
   *  The form parents array.
   * @return array
   *  A drupal forms api array.
   */
  static public function buildFormFromSchema($schema, ConfigInterface $config, $parents = [], $form = []) {
    $form = [];
    DrupalConfigHelper::addFieldsFromSchema($form, $schema, $config, $parents);
    return $form;
  }

  /**
   * Add the schema fields to the given form array.
   *
   * @param array $schema
   *  A configuration schema from one or more Backup and Migrate plugins.
   * @param \BackupMigrate\Core\Config\ConfigInterface $config
   *  The configuration object containing the default values.
   * @param array $parents
   *  The form parents array.
   */
  static public function addFieldsFromSchema(&$form, $schema, ConfigInterface $config, $parents = []) {
    // Add the specified groups.
    if (isset($schema['groups'])) {
      foreach ($schema['groups'] as $group_key => $item) {
        // If the group is just called 'default' then use the key from the plugin as the group key.
        // @TODO: make this less ugly.
        if ($group_key == 'default' && $parents) {
          $group_key = end($parents);
        }
        if (!isset($form[$group_key])) {
          $form[$group_key] = [
            '#type' => 'fieldset',
            '#title' => $item['title'],
            '#tree' => FALSE,
          ];
        }
      }
    }

    // Add each of the fields.
    if (isset($schema['groups'])) {
      foreach ($schema['fields'] as $field_key => $item) {
        $form_item = [];
        $value = $config->get($field_key);

        switch ($item['type']) {
          case 'text':
            $form_item['#type'] = 'textfield';
            if (!empty($item['multiple'])) {
              $form_item['#type'] = 'textarea';
              if (!isset($form_item['#description'])) {
                $form_item['#description'] = '';
              }
              $form_item['#description'] .= ' ' . t('Add one item per line.');
              $form_item['#element_validate'] = ['BackupMigrate\Drupal\Config\DrupalConfigHelper::validateMultiText'];
              $value = implode("\n", $value);
            }
            if (!empty($item['multiline'])) {
              $form_item['#type'] = 'textarea';
            }
            break;
          case 'password':
            $form_item['#type'] = 'password';
            $form_item['#value_callback'] = 'BackupMigrate\Drupal\Config\DrupalConfigHelper::valueCallbackSecret';
            break;
          case 'number':
            $form_item['#type'] = 'textfield';
            $form_item['#size'] = 5;
            if (!empty($item['max'])) {
              $form_item['#size'] = strlen((string) $item['max']) + 3;
            }
            break;
          case 'boolean':
            $form_item['#type'] = 'checkbox';
            break;
          case 'enum':
            $form_item['#type'] = 'select';
            $form_item['#multiple'] = !empty($item['multiple']);
            if (empty($item['#required']) && empty($item['multiple'])) {
              $item['options'] = ['' => '--' . t('None') . '--'] + $item['options'];
            }
            $form_item['#options'] = $item['options'];
            break;
        }

        // If there is a form item add it to the form.
        if ($form_item) {
          // Add the common form elements.
          $form_item['#title'] = $item['title'];
          $form_item['#parents'] = array_merge($parents, [$field_key]);
          $form_item['#required'] = !empty($item['required']);
          $form_item['#default_value'] = $value;

          if (!empty($item['description'])) {
            $form_item['#description'] = $item['description'];
          }

          // Add the field to it's group or directly to the top level of the form.
          if (!empty($item['group'])) {
            $group_key = $item['group'];
            if ($group_key == 'default' && $parents) {
              $group_key = end($parents);
            }
            $form[$group_key][$field_key] = $form_item;
          }
          else {
            $form[$field_key] = $form_item;
          }
        }
      }
    }
  }

  /**
   * Break a multi-line text value into an array.
   *
   * @param $element
   * @param $form_state
   */
  public static function validateMultiText(&$element, FormStateInterface &$form_state) {
    $form_state->setValueForElement($element, array_map('trim', explode("\n", $element['#value'])));
  }

  /**
   * A value mapping callback that replaces missing secrets because the Form API
   * does not preserve the default values of password inputs.
   *
   * @param $element
   * @param $input
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   */
  public static function valueCallbackSecret(&$element, $input, FormStateInterface $form_state) {
    if (empty($input)) {
      return $element['#default_value'];
    }
    return $input;
  }

  /**
   * Get a pulldown for the given list of plugins
   *
   * @param \BackupMigrate\Core\Config\ConfigurableInterface[]|\BackupMigrate\Core\Plugin\PluginManagerInterface $plugins
   * @param $title
   * @return array
   */
  public static function getPluginSelector(PluginManagerInterface $plugins, $title) {
    $options = [];
    foreach ($plugins->getAll() as $key => $plugin) {
      $options[$key] = $plugin->confGet('name', $key);
    }
    return [
      '#type' => 'select',
      '#title' => $title,
      '#options' => $options,
    ];
  }

  /**
   * Get a select form item for the given list of sources
   *
   * @param \BackupMigrate\Core\Main\BackupMigrateInterface $bam
   * @param $title
   * @return array
   */
  public static function getSourceSelector(BackupMigrateInterface $bam, $title) {
    return DrupalConfigHelper::getPluginSelector($bam->sources(), $title);
  }

  /**
   * Get a select form item for the given list of sources
   *
   * @param \BackupMigrate\Core\Main\BackupMigrateInterface $bam
   * @param $title
   * @return array
   */
  public static function getDestinationSelector(BackupMigrateInterface $bam, $title) {
    return DrupalConfigHelper::getPluginSelector($bam->destinations(), $title);
  }


  /**
   * GEt a pulldown for the list of all settings profiles.
   *
   * @param $title
   * @return array
   */
  public static function getSettingsProfileSelector($title) {
    $options = [];
    foreach (SettingsProfile::loadMultiple() as $key => $profile) {
      $options[$key] = $profile->get('label');
    }
    if ($options) {
      return [
        '#type' => 'select',
        '#title' => $title,
        '#options' => $options,
      ];
    }
  }
}
