<?php

namespace Drupal\rest_menu_items\Plugin\rest\resource;

use Drupal\Core\Cache\CacheableResponseInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Menu\MenuLinkInterface;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Psr\Log\LoggerInterface;

/**
 * Provides a resource to get bundles by entity.
 *
 * @RestResource(
 *   id = "rest_menu_item",
 *   label = @Translation("Menu items per menu"),
 *   uri_paths = {
 *     "canonical" = "/api/menu_items/{menu_name}"
 *   }
 * )
 */
class RestMenuItemsResource extends ResourceBase {

  /**
   * A instance of the alias manager.
   *
   * @var \Drupal\Core\Path\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * A instance of the config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * A list of menu items.
   *
   * @var array
   */
  protected $menuItems = [];

  /**
   * The maximum depth we want to return the tree.
   *
   * @var int
   */
  protected $maxDepth = 0;

  /**
   * The minimum depth we want to return the tree from.
   *
   * @var int
   */
  protected $minDepth = 1;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    AliasManagerInterface $alias_manager,
    ConfigFactoryInterface $config_factory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->aliasManager = $alias_manager;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('path.alias_manager'),
      $container->get('config.factory')
    );
  }

  /**
   * Responds to GET requests.
   *
   * Returns a list of menu items for specified menu name.
   *
   * @param string|null $menu_name
   *   The menu name.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing a list of bundle names.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function get($menu_name = NULL) {
    if ($menu_name) {
      // Setup variables.
      $this->setup();

      // Create the parameters.
      $parameters = new MenuTreeParameters();
      $parameters->onlyEnabledLinks();

      if (!empty($this->maxDepth)) {
        $parameters->setMaxDepth($this->maxDepth);
      }

      if (!empty($this->minDepth)) {
        $parameters->setMinDepth($this->minDepth);
      }

      // Load the tree based on this set of parameters.
      $menu_tree = \Drupal::menuTree();
      $tree = $menu_tree->load($menu_name, $parameters);

      // Return if the menu does not exist or has no entries.
      if (empty($tree)) {
        return new ResourceResponse($tree);
      }

      // Transform the tree using the manipulators you want.
      $manipulators = [
        // Only show links that are accessible for the current user.
        ['callable' => 'menu.default_tree_manipulators:checkAccess'],
        // Use the default sorting of menu links.
        ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
      ];
      $tree = $menu_tree->transform($tree, $manipulators);

      // Finally, build a renderable array from the transformed tree.
      $menu = $menu_tree->build($tree);

      // Return if the menu has no entries.
      if (empty($menu['#items'])) {
        return new ResourceResponse([]);
      }

      $this->getMenuItems($menu['#items'], $this->menuItems);

      // Return response.
      $response = new ResourceResponse(array_values($this->menuItems));

      // Configure caching for minDepth and maxDepth parameters.
      if ($response instanceof CacheableResponseInterface) {
        $response->addCacheableDependency(new RestMenuItemsCacheableDependency($menu_name, $this->minDepth, $this->maxDepth));
      }

      // Return the JSON response.
      return $response;
    }
    throw new HttpException(t("Menu name was not provided"));
  }

  /**
   * Generate the menu tree we can use in JSON.
   *
   * @param array $tree
   *   The menu tree.
   * @param array $items
   *   The already created items.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  protected function getMenuItems(array $tree, array &$items = []) {
    $config = $this->configFactory->get('rest_menu_items.config');
    $outputValues = $config->get('output_values');

    // Loop through the menu items.
    foreach ($tree as $item_value) {
      /* @var $org_link \Drupal\Core\Menu\MenuLinkInterface */
      $org_link = $item_value['original_link'];

      /* @var $url \Drupal\Core\Url */
      $url = $item_value['url'];

      $newValue = [];
      foreach ($outputValues as $valueKey) {
        if (!empty($valueKey)) {
          $this->getElementValue($newValue, $valueKey, $org_link, $url);
        }
      }

      if (!empty($item_value['below'])) {
        $newValue['below'] = [];
        $this->getMenuItems($item_value['below'], $newValue['below']);
      }

      $items[] = $newValue;
    }
  }

  /**
   * This function is used to generate some variables we need to use.
   *
   * These variables are available in the url.
   */
  private function setup() {
    // Get the current request.
    $request = \Drupal::request();

    // Get and set the max depth if available.
    $max = $request->get('max_depth');
    if (!empty($max)) {
      $this->maxDepth = $max;
    }

    // Get and set the min depth if available.
    $min = $request->get('min_depth');
    if (!empty($min)) {
      $this->minDepth = $min;
    }
  }

  /**
   * Generate the menu element value.
   *
   * @param array $returnArray
   *   The return array we want to add this item to.
   * @param string $key
   *   The key to use in the output.
   * @param \Drupal\Core\Menu\MenuLinkDefault $link
   *   The link from the menu.
   * @param \Drupal\Core\Url $url
   *   The URL object of the menu item.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  private function getElementValue(array &$returnArray, $key, MenuLinkInterface $link, Url $url) {
    $external = $url->isExternal();
    $routed = $url->isRouted();
    $existing = TRUE;
    $value = NULL;

    if ($external || !$routed) {
      $uri = $url->getUri();
    }
    else {
      try {
        $uri = $url->getInternalPath();
      }
      catch (\UnexpectedValueException $e) {
        $uri = $relative = Url::fromUri($url->getUri())->toString();
        $existing = FALSE;
      }
    }

    switch ($key) {
      case 'key':
        $value = $link->getDerivativeId();
        if (empty($value)) {
          $value = $link->getBaseId();
        }
        break;

      case 'title':
        $value = $link->getTitle();
        break;

      case 'description':
        $value = $link->getDescription();
        break;

      case 'uri':
        $value = $uri;
        break;

      case 'alias':
        if ($routed) {
          $value = ltrim($this->aliasManager->getAliasByPath("/$uri"), '/');
        }
        break;

      case 'external':
        $value = $external;
        break;

      case 'absolute':
        if ($external) {
          $value = $uri;
        }
        elseif (!$routed) {
          $url->setAbsolute();
          $value = $url
            ->toString(TRUE)
            ->getGeneratedUrl();
        }
        else {
          $value = Url::fromUri('internal:/' . $uri, ['absolute' => TRUE])
            ->toString(TRUE)
            ->getGeneratedUrl();
        }
        break;

      case 'relative':
        if (!$external) {
          $value = Url::fromUri('internal:/' . $uri, ['absolute' => FALSE])
            ->toString(TRUE)
            ->getGeneratedUrl();
        }

        if (!$routed) {
          $url->setAbsolute(FALSE);
          $value = $url
            ->toString(TRUE)
            ->getGeneratedUrl();
        }

        if (!$existing) {
          $value = Url::fromUri($url->getUri())->toString();
        }
        break;

      case 'existing':
        $value = $existing;
        break;

      case 'weight':
        $value = $link->getWeight();
        break;

      case 'expanded':
        $value = $link->isExpanded();
        break;

      case 'enabled':
        $value = $link->isEnabled();
        break;

      case 'uuid':
        if (!$external && $routed) {
          $params = Url::fromUri('internal:/' . $uri)->getRouteParameters();
          $entity_type = key($params);
          if (!empty($entity_type)) {
            $entity = \Drupal::entityTypeManager()
              ->getStorage($entity_type)
              ->load($params[$entity_type]);
            $value = $entity->uuid();
          }
        }
        break;

      case 'options':
        $value = $link->getOptions();
        break;
    }

    $returnArray[$key] = $value;
  }

}
