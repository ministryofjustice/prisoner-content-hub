<?php

namespace Drupal\restui\Form;

use Drupal\Core\Authentication\AuthenticationCollectorInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleHandler;
use Drupal\rest\RestResourceConfigInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\rest\Plugin\Type\ResourcePluginManager;
use Drupal\Core\Routing\RouteBuilderInterface;

/**
 * Provides a REST resource configuration form.
 */
class RestUIForm extends ConfigFormBase {

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandler
   */
  protected $moduleHandler;

  /**
   * The authentication collector.
   *
   * @var \Drupal\Core\Authentication\AuthenticationCollectorInterface
   */
  protected $authenticationCollector;

  /**
   * The available serialization formats.
   *
   * @var array
   */
  protected $formats;

  /**
   * The REST plugin manager.
   *
   * @var \Drupal\rest\Plugin\Type\ResourcePluginManager
   */
  protected $resourcePluginManager;

  /**
   * The route builder used to rebuild all routes.
   *
   * @var \Drupal\Core\Routing\RouteBuilderInterface
   */
  protected $routeBuilder;

  /**
   * The REST resource config storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $resourceConfigStorage;

  /**
   * Constructs a \Drupal\user\RestForm object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Core\Extension\ModuleHandler $module_handler
   *   The module handler.
   * @param \Drupal\Core\Authentication\AuthenticationCollectorInterface $authentication_collector
   *   The authentication collector.
   * @param array $formats
   *   The available serialization formats.
   * @param \Drupal\rest\Plugin\Type\ResourcePluginManager $resourcePluginManager
   *   The REST plugin manager.
   * @param \Drupal\Core\Routing\RouteBuilderInterface $routeBuilder
   *   The route builder.
   * @param \Drupal\Core\Entity\EntityStorageInterface
   *   The REST resource config storage.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleHandler $module_handler, AuthenticationCollectorInterface $authentication_collector, array $formats, ResourcePluginManager $resourcePluginManager, RouteBuilderInterface $routeBuilder, EntityStorageInterface $resource_config_storage) {
    parent::__construct($config_factory);
    $this->moduleHandler = $module_handler;
    $this->authenticationCollector = $authentication_collector;
    $this->formats = $formats;
    $this->resourcePluginManager = $resourcePluginManager;
    $this->routeBuilder= $routeBuilder;
    $this->resourceConfigStorage = $resource_config_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_handler'),
      $container->get('authentication_collector'),
      $container->getParameter('serializer.formats'),
      $container->get('plugin.manager.rest'),
      $container->get('router.builder'),
      $container->get('entity_type.manager')->getStorage('rest_resource_config')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormID() {
    return 'restui';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'rest.settings',
    ];
  }

  /**
   * {@inheritdoc}
   *
   * @var array $form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state.
   * @var string $resource_id
   *   A string that identifies the REST resource.
   *
   * @return array
   *   The form structure.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
   *   When no plugin found.
   */
  public function buildForm(array $form, FormStateInterface $form_state, $resource_id = NULL) {
    $plugin = $this->resourcePluginManager->createInstance($resource_id);
    if (empty($plugin)) {
      throw new NotFoundHttpException();
    }

    $id = str_replace(':', '.', $resource_id);

    $config = $this->config("rest.resource.{$id}")->get('configuration') ?: [];
    $methods = $plugin->availableMethods();
    $pluginDefinition = $plugin->getPluginDefinition();
    $form['#title'] = $this->t('Settings for resource %label', ['%label' => $pluginDefinition['label']]);
    $form['#tree'] = TRUE;
    $form['resource_id'] = array('#type' => 'value', '#value' => $resource_id);
    $form['methods'] = array('#type' => 'container');

    $authentication_providers = array_keys($this->authenticationCollector->getSortedProviders());
    $authentication_providers = array_combine($authentication_providers, $authentication_providers);
    $format_options = array_combine($this->formats, $this->formats);
    foreach ($methods as $method) {
      $group = array();
      $group[$method] = array(
        '#title' => $method,
        '#type' => 'checkbox',
        '#default_value' => isset($config[$method]),
      );
      $group['settings'] = array(
        '#type' => 'container',
        '#attributes' => array('style' => 'padding-left:20px'),
      );

      // Available request formats.
      $enabled_formats = array();
      if (isset($config[$method]['supported_formats'])) {
        $enabled_formats = $config[$method]['supported_formats'];
      }
      $group['settings']['formats'] = array(
        '#type' => 'checkboxes',
        '#title' => $this->t('Accepted request formats'),
        '#options' => $format_options,
        '#default_value' => $enabled_formats,
      );

      // Authentication providers.
      $enabled_auth = array();
      if (isset($config[$method]['supported_auth'])) {
        $enabled_auth = $config[$method]['supported_auth'];
      }
      $group['settings']['auth'] = array(
        '#title' => $this->t('Authentication providers'),
        '#type' => 'checkboxes',
        '#options' => $authentication_providers,
        '#default_value' => $enabled_auth,
      );
      $form['methods'][$method] = $group;
    }
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   *
   * @see \Drupal\rest\Routing\ResourceRoutes::alterRoutes()
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // At least one method must be checked.
    $method_checked = FALSE;
    foreach ($form_state->getValue('methods') as $method => $values) {
      if ($values[$method]) {
        $method_checked = TRUE;
        // At least one format and authentication provider must be selected.
        $formats = array_filter($values['settings']['formats']);
        if (empty($formats)) {
          $form_state->setErrorByName('methods][' . $method . '][settings][formats', $this->t('At least one format must be selected for method @method.', array('@method' => $method)));
        }
        $auth = array_filter($values['settings']['auth']);
        if (empty($auth)) {
          $form_state->setErrorByName('methods][' . $method . '][settings][auth' , $this->t('At least one authentication provider must be selected for method @method.', array('@method' => $method)));
        }
      }
    }
    if (!$method_checked) {
      $form_state->setErrorByName('methods', $this->t('At least one HTTP method must be selected'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $methods = $form_state->getValue('methods');
    $resource_id = $id = str_replace(':', '.', $form_state->getValue('resource_id'));
    $config = $this->resourceConfigStorage->load($resource_id);

    if (!$config) {
      $config = $this->resourceConfigStorage->create([
        'id' => $resource_id,
        'granularity' => RestResourceConfigInterface::METHOD_GRANULARITY,
        'configuration' => []
      ]);
    }

    $configuration = $config->get('configuration') ?: [];

    foreach ($methods as $method => $settings) {
      if ($settings[$method]) {
        $configuration[$method] = [
          'supported_formats' => array_keys(array_filter($settings['settings']['formats'])),
          'supported_auth' => array_keys(array_filter($settings['settings']['auth'])),
        ];
      }
      else {
        unset($configuration[$method]);
      }
    }
    $config->set('configuration', $configuration);
    $config->save();

    // Rebuild routing cache.
    $this->routeBuilder->rebuild();
    drupal_set_message($this->t('The resource has been updated.'));
    // Redirect back to the listing.
    $form_state->setRedirect('restui.list');
  }

}
