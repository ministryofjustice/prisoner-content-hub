<?php

namespace Drupal\restui\Controller;

use Drupal\Core\Entity\EntityStorageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Drupal\rest\Plugin\Type\ResourcePluginManager;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Routing\RouteBuilderInterface;
use Drupal\Core\Url;

/**
 * Controller routines for REST resources.
 */
class RestUIController implements ContainerInjectionInterface {

  /**
   * Resource plugin manager.
   *
   * @var \Drupal\rest\Plugin\Type\ResourcePluginManager
   */
  protected $resourcePluginManager;

  /**
   * The URL generator to use.
   *
   * @var \Symfony\Component\Routing\Generator\UrlGeneratorInterface
   */
  protected $urlGenerator;

  /**
   * The route builder used to rebuild all routes.
   *
   * @var \Drupal\Core\Routing\RouteBuilderInterface
   */
  protected $routeBuilder;

  /**
   * Configuration entity to store enabled REST resources.
   *
   * @var \Drupal\rest\RestResourceConfigInterface
   */
  protected $resourceConfigStorage;

  /**
   * Injects RestUIManager Service.
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('plugin.manager.rest'),
      $container->get('url_generator'),
      $container->get('router.builder'),
      $container->get('entity_type.manager')->getStorage('rest_resource_config')
    );
  }

  /**
   * Constructs a RestUIController object.
   *
   * @param \Drupal\rest\Plugin\Type\ResourcePluginManager $resourcePluginManager
   *   The REST resource plugin manager.
   * @param \Symfony\Component\Routing\Generator\UrlGeneratorInterface $url_generator
   *   The URL generator.
   * @param \Drupal\Core\Routing\RouteBuilderInterface $routeBuilder
   *   The router builder.
   * @param \Drupal\Core\Entity\EntityStorageInterface
   *   The REST resource config storage.
   */
  public function __construct(ResourcePluginManager $resourcePluginManager, UrlGeneratorInterface $url_generator, RouteBuilderInterface $routeBuilder, EntityStorageInterface $resource_config_storage) {
    $this->resourcePluginManager = $resourcePluginManager;
    $this->urlGenerator = $url_generator;
    $this->routeBuilder= $routeBuilder;
    $this->resourceConfigStorage = $resource_config_storage;
  }

  /**
   * Returns an administrative overview of all REST resources.
   *
   * @return string
   *   A HTML-formatted string with the administrative page content.
   */
  public function listResources() {
    // Get the list of enabled and disabled resources.
    $config = $this->resourceConfigStorage->loadMultiple();

    // Strip out the nested method configuration, we are only interested in the
    // plugin IDs of the resources.
    $enabled_resources = array_combine(array_keys($config), array_keys($config));
    $available_resources = array('enabled' => array(), 'disabled' => array());
    $resources = $this->resourcePluginManager->getDefinitions();
    foreach ($resources as $id => $resource) {
      $status = in_array($this->getResourceKey($id), $enabled_resources) ? 'enabled' : 'disabled';
      $available_resources[$status][$id] = $resource;
    }

    // Sort the list of resources by label.
    $sort_resources = function($resource_a, $resource_b) {
      return strcmp($resource_a['label'], $resource_b['label']);
    };
    if (!empty($available_resources['enabled'])) {
      uasort($available_resources['enabled'], $sort_resources);
    }
    if (!empty($available_resources['disabled'])) {
      uasort($available_resources['disabled'], $sort_resources);
    }

    // Heading.
    $list['resources_title'] = array(
      '#markup' => '<h2>' . t('REST resources') . '</h2>',
    );
    $list['resources_help'] = array(
      '#markup' => '<p>' . t('Here you can enable and disable available resources. Once a resource ' .
                             'has been enabled, you can restrict its formats and authentication by ' .
                             'clicking on its "Edit" link.') . '</p>',
    );
    $list['enabled']['heading']['#markup'] = '<h2>' . t('Enabled') . '</h2>';
    $list['disabled']['heading']['#markup'] = '<h2>' . t('Disabled') . '</h2>';

    // List of resources.
    foreach (array('enabled', 'disabled') as $status) {
      $list[$status]['#type'] = 'container';
      $list[$status]['#attributes'] = array('class' => array('rest-ui-list-section', $status));
      $list[$status]['table'] = array(
        '#theme' => 'table',
        '#header' => array(
          'resource_name' => array(
            'data' => t('Resource name'),
            'class' => array('rest-ui-name'),
          ),
          'path' => array(
            'data' => t('Path'),
            'class' => array('views-ui-path'),
          ),
          'description' => array(
            'data' => t('Description'),
            'class' => array('rest-ui-description'),
          ),
          'operations' => array(
            'data' => t('Operations'),
            'class' => array('rest-ui-operations'),
          ),
        ),
        '#rows' => array(),
      );
      foreach ($available_resources[$status] as $id => $resource) {
        $uri_paths = '<code>' . $resource['uri_paths']['canonical'] . '</code>';

        $list[$status]['table']['#rows'][$id] = array(
          'data' => array(
            'name' => $resource['label'],
            'path' =>  array('data' => array(
              '#type' => 'inline_template',
              '#template' => $uri_paths,
            )),
            'description' => array(),
            'operations' => array(),
          )
        );

        if ($status == 'disabled') {
          $list[$status]['table']['#rows'][$id]['data']['operations']['data'] = array(
            '#type' => 'operations',
            '#links' => array(
              'enable' => array(
                'title' => t('Enable'),
                'url' => Url::fromRoute('restui.edit', array('resource_id' => $id)),
              ),
            ),
          );
        }
        else {
          $list[$status]['table']['#rows'][$id]['data']['operations']['data'] = array(
            '#type' => 'operations',
            '#links' => array(
              'edit' => array(
                'title' => t('Edit'),
                'url' => Url::fromRoute('restui.edit', array('resource_id' => $id)),

              ),
              'disable' => array(
                'title' => t('Disable'),
                'url' => Url::fromRoute('restui.disable', array('resource_id' => $id)),
              ),
              'permissions' => array(
                'title' => t('Permissions'),
                'url' => Url::fromRoute('user.admin_permissions', array(), array('fragment' => 'module-rest')),
              )
            ),
          );

          $list[$status]['table']['#rows'][$id]['data']['description']['data'] = array(
            '#theme' => 'restui_resource_info',
            '#resource' => $config[$this->getResourceKey($id)]->get('configuration'),
          );
        }
      }
    }

    $list['enabled']['table']['#empty'] = t('There are no enabled resources.');
    $list['disabled']['table']['#empty'] = t('There are no disabled resources.');
    $list['#title'] = t('REST resources');
    return $list;
  }

  /**
   * Disables a resource.
   *
   * @param string $resource_id
   *   The identifier or the REST resource.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse|\Symfony\Component\HttpFoundation\RedirectResponse
   *   Redirects back to the listing page.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
   *   Access is denied, if the token is invalid or missing.
   */
  public function disable($resource_id) {
    $resources = $this->resourceConfigStorage->loadMultiple();

    if ($resources[$this->getResourceKey($resource_id)]) {
      $resources[$this->getResourceKey($resource_id)]->delete();
      // Rebuild routing cache.
      $this->routeBuilder->rebuild();
      drupal_set_message(t('The resource was disabled successfully.'));
    }

    // Redirect back to the page.
    return new RedirectResponse($this->urlGenerator->generate('restui.list', array(), TRUE));
  }

  /**
   * The key used in the form.
   *
   * @param string $resource_id
   *   The resource ID.
   *
   * @return string
   *   The resource key in the form.
   */
  protected function getResourceKey($resource_id) {
    return str_replace(':', '.', $resource_id);
  }

}
