<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

require_once('Utils.php');

/**
 * NewFeaturedContentApiClass
 */

class NewFeaturedContentApiClass
{
  /**
   * Node IDs
   *
   * @var array
   */
  protected $nids = array();
  /**
   * Nodes
   *
   * @var array
   */
  protected $nodes = array();
  /**
   * Language Tag
   *
   * @var string
   */
  protected $lang;
  /**
   * Node_storage object
   *
   * @var Drupal\Core\Entity\EntityManagerInterface
   */
  protected $node_storage;
  /**
   * Entitity Query object
   *
   * @var Drupal\Core\Entity\Query\QueryFactory
   *
   * Instance of querfactory
   */
  protected $entity_query;

  /**
   * Class Constructor
   *
   * @param EntityTypeManagerInterface $entityTypeManager
   * @param QueryFactory $entityQuery
   */
  public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    QueryFactory $entityQuery
  ) {
    $this->node_storage = $entityTypeManager->getStorage('node');
    $this->term_storage = $entityTypeManager->getStorage('taxonomy_term');
    $this->entity_query = $entityQuery;
  }
  /**
   * API resource function
   *
   * @param [string] $lang
   * @return array
   */
  public function FeaturedContentApiEndpoint($lang, $category, $prison)
  {
    return $this->getFeaturedContentNodeIds($category, $prison);
  }
  /**
   * TranslateNode function
   *
   * @param NodeInterface $node
   *
   * @return $node
   */
  protected function translateNode(NodeInterface $node)
  {
    return $node->hasTranslation($this->lang) ? $node->getTranslation($this->lang) : $node;
  }
  /**
   * Get nids
   *
   * @return void
   */
  private function getFeaturedContentNodeIds($category, $number, $prison = 0)
  {
    $results = $this->featuredNodes($category, $number, $prison);

    return array_slice($results, 0, $number);
  }

  private function decorateContent($node)
  {
    $result = [];
    $result['id'] = $node->nid->value;
    $result['title'] = $node->title->value;
    $result['content_type'] = $node->type->target_id;
    $result['large_tiles'] = $this->getItems($node->field_moj_featured_tile_large);
    $result['small_tiles'] = $this->getItems($node->field_moj_featured_tile_small);

    return $result;
  }

  private function getItems($nodes) {
    $nids = [];
    $number_nodes = count($nodes);

    for ($i = 0; $i < $number_nodes; $i++) {
      array_push($nids, $nodes[$i]->target_id);
    }
    $results = $this->loadNodesDetails($nids);
    return array_values(array_map(array($this, 'decorateItem'), $results));
  }

  private function decorateItem($node)
  {
    $result = [];
    $result['id'] = $node->nid->value;
    $result['title'] = $node->title->value;
    $result['content_type'] = $node->type->target_id;
    $result['summary'] = $node->field_moj_description->summary;
    $result['image'] = $node->field_moj_thumbnail_image ? $node->field_moj_thumbnail_image[0] : $node->field_image[0];
    $result['series'] = $node->field_moj_series;

    return $result;
  }

  private function featuredNodes($category, $prison)
  {
    $results = $this->entity_query->get('node')
      ->condition('type', 'featured_articles')
      ->condition('status', 1)
      ->accessCheck(false);

    $results = getPrisonResults($prison, $results);

    $nodes = $results->execute();

    $content = $this->loadNodesDetails($nodes);

    return array_map(array($this, 'decorateContent'), $content);
  }

  /**
   * Load full node details
   *
   * @param array $nids
   * @return array
   */
  protected function loadNodesDetails(array $nids)
  {
    return $this->node_storage->loadMultiple($nids);
  }

  /**
   * Sanitise node
   *
   * @param [type] $item
   * @return void
   */
  protected function serialize($item)
  {
    $serializer = \Drupal::service($item->getType() . '.serializer.default');
    return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
  }
}
