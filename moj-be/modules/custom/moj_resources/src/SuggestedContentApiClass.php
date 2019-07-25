<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * SuggestedContentApiClass
 */

class SuggestedContentApiClass
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
  public function SuggestedContentApiEndpoint($lang, $nid, $number, $prison)
  {
    $this->lang = $lang;
    $nodes = $this->getSuggestions($nid, $number, $prison);
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
   * Get the relevant matching items
   *
   * @param int $nod
   * @param int $number
   * @param string $prison
   *
   * @return array
   */
  private function getSuggestions($nid, $number, $prison)
  {
    $node = $this->node_storage->load($nid);
    $detailed_results = $this->combineSecondaryTagItems($node->field_moj_secondary_tags, $number, $prison);

    if (count($detailed_results) < $number) {
      $combined_primary_tag_items = $this->combinePrimaryTagItems($node->field_moj_categories, $number, $prison);
      $detailed_results = array_merge($combined_primary_tag_items, $detailed_results);
    }

    return array_slice($detailed_results, 0, $number);
  }

  /**
   * Get matching primary items and combine them into an array
   *
   * @param array $primary_tags
   * @param int $number
   *
   * @return array
   */
  private function combinePrimaryTagItems($primary_tags, $number, $prison)
  {
    $detailed_results = [];
    $number_primary_tags = count($primary_tags);

    for ($i = 0; $i < $number_primary_tags; $i++) {
      $primary_tag_data = $this->getTagItemsFor($primary_tags[$i]->target_id, $number, $prison);
      $detailed_results = array_merge($primary_tag_data, $detailed_results);

      if (count($detailed_results) >= $number) break;
    }

    return $detailed_results;
  }

  /**
   * Get matching secondary items and combine them into an array
   *
   * @param array $primary_tags
   * @param int $number
   *
   * @return array
   */
  private function combineSecondaryTagItems($secondary_tags, $number, $prison)
  {
    $detailed_results = [];
    $number_secondary_tags = count($secondary_tags);

    for ($i = 0; $i < $number_secondary_tags; $i++) {
      $secondary_tag_data = $this->getTagItemsFor($secondary_tags[$i]->target_id, $number, $prison, false);
      $detailed_results = array_merge($secondary_tag_data, $detailed_results);

      if (count($detailed_results) >= $number) break;
    }

    return $detailed_results;
  }

  /**
   * Get matching primary or secondary items for a given id
   *
   * @param int $id
   * @param int $number
   * @param string $prison
   * @param boolean $primary
   *
   * @return array
   */
  private function getTagItemsFor($id, $number, $prison, $primary = true)
  {
    $berwyn_prison_id = 792;
    $wayland_prison_id = 793;

    $bundle = array('page', 'moj_pdf_item', 'moj_radio_item', 'moj_video_item',);
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('type', $bundle, 'IN')
      ->accessCheck(false);

    if ($id !== 0) {
      if ($primary) {
        $results->condition('field_moj_top_level_categories', $id);
      } else {
        $group = $results
          ->orConditionGroup()
          ->condition('field_moj_tags', $id)
          ->condition('field_moj_secondary_tags', $id);

        $results->condition($group);
      }
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

    $content_ids = $results->range(0, $number)->execute();

    $result = $this->loadNodesDetails($content_ids);

    return $result;
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
