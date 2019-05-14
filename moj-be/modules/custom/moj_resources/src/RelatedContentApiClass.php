<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * RelatedContentApiClass
 */

class RelatedContentApiClass
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
    $this->entity_query = $entityQuery;
  }
  /**
   * API resource function
   *
   * @param [string] $lang
   * @return array
   */
  public function RelatedContentApiEndpoint($lang, $category, $number, $offset, $prison, $sort_order = 'ASC')
  {
    $this->lang = $lang;
    $nids = $this->getRelatedContentNodeIds($category, $number, $offset, $prison, $sort_order);
    $nodes = $this->loadNodesDetails($nids);
    $content = array_map([$this, 'translateNode'], $nodes);

    return array_map([$this, 'decorateContent'], array_values($content));
  }
  /**
   * TranslateNode function
   *
   * @param NodeInterface $node
   *
   * @return $node
   */
  private function translateNode(NodeInterface $node)
  {
    return $node->hasTranslation($this->lang) ? $node->getTranslation($this->lang) : $node;
  }
  /**
   * Get nids
   *
   * @return void
   */
  private function getRelatedContentNodeIds($category, $number, $offset, $prison, $sort_order = 'ASC')
  {
    $berwyn_prison_id = 792;
    $wayland_prison_id = 793;

    $bundle = array('page', 'moj_pdf_item', 'moj_radio_item', 'moj_video_item',);
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('type', $bundle, 'IN')
      ->accessCheck(false);

    if ($category !== 0) {
      $group = $results
        ->orConditionGroup()
        ->condition('field_moj_top_level_categories', $category)
        ->condition('field_moj_tags', $category)
        ->condition('field_moj_secondary_tags', $category);

      $results->condition($group);
    }

    if ($prison == $berwyn_prison_id) {
      $berwyn = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $prison, '=')
        ->notExists('field_moj_prisons');
      $results->condition($berwyn);
    }

    if ($prison == $wayland_prison_id) {
      $wayland = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $prison, '=')
        ->notExists('field_moj_prisons');
      $results->condition($wayland);
    }

    $relatedContent = $results
      ->sort('nid', $sort_order)
      ->range($offset, $number)
      ->execute();

    return $relatedContent;
  }

  /**
   * decorateContent
   *
   * @param Node $node
   * @return array
   */
  private function decorateContent($node)
  {
    $result = [];
    $result['id'] = $node->nid->value;
    $result['title'] = $node->title->value;
    $result['content_type'] = $node->type->target_id;
    $result['summary'] = $node->field_moj_description->summary;
    $result['image'] = $node->field_moj_thumbnail_image[0] ? $node->field_moj_thumbnail_image[0] : $node->field_image[0];
    $result['duration'] = $node->field_moj_duration->value;

    return $result;
  }

  /**
   * Load full node details
   *
   * @param array $nids
   * @return array
   */
  private function loadNodesDetails(array $nids)
  {
    return array_filter(
      $this->node_storage->loadMultiple($nids),
      function ($item) {
        return $item->access();
      }
    );
  }
}
