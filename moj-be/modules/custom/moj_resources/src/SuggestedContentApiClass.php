<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

require_once('Utils.php');

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
   * @param int $nid
   * @param int $number
   * @param string $prison
   *
   * @return array
   */
  private function getSuggestions($nid, $number, $prison)
  {
    $node = $this->node_storage->load($nid);
    $secondary_tag_ids = $this->getTagIds($node->field_moj_secondary_tags);
    $matching_ids = array_unique($this->getSecondaryTagItemsFor($secondary_tag_ids, $number, $prison));

    if (count($matching_ids) < $number) {
      $matching_any_secondary_tags_ids = $this->getTagItemsFor($secondary_tag_ids, $number, $prison, false);
      $matching_ids = array_unique(array_merge($matching_ids, $matching_any_secondary_tags_ids));
    }

    if (count($matching_ids) < $number) {
      $primary_tag_ids = $this->getTagIds($node->field_moj_top_level_categories);
      $matching_any_primary_tags_ids = $this->getTagItemsFor($primary_tag_ids, $number, $prison);
      $matching_ids = array_unique(array_merge($matching_ids, $matching_any_primary_tags_ids));
    }

    $current_id_index = array_search($nid, $matching_ids);

    if ($current_id_index !== FALSE) {
      unset($matching_ids[$current_id_index]);
    }

    return $this->loadNodesDetails(array_slice($matching_ids, 0, $number));
  }

  /**
   * Get tags ids out of nodes
   *
   * @param array[nodes] $tags
   *
   * @return array
   */
  private function getTagIds($tags) {
    $tag_ids = [];
    $number_tags = count($tags);

    for ($i = 0; $i < $number_tags; $i++) {
      array_push($tag_ids, $tags[$i]->target_id);
    }

    return $tag_ids;
  }

  /**
   * Get matching primary or secondary items for a given id, excluding the passed in ids
   *
   * @param int $id
   * @param int $number
   * @param string $prison
   * @param boolean $primary
   *
   * @return array
   */
  private function getTagItemsFor($ids, $number, $prison, $primary = true)
  {
    $results = $this->getInitialQuery($prison);

    if ($id !== 0) {
      if ($primary) {
        $results->condition('field_moj_top_level_categories', $ids, 'IN');
      } else {
        $group = $results
          ->orConditionGroup()
          ->condition('field_moj_secondary_tags', $ids, 'IN')
          ->condition('field_moj_tags', $ids, 'IN');

        $results->condition($group);
      }
    }

    $results->sort('nid', 'DESC');
    return $results->range(0, $number)->execute();
  }

  /**
   * Get matching primary or secondary items for a given id
   *
   * @param array[int] $ids
   * @param int $number
   * @param string $prison
   *
   * @return array
   */
  private function getSecondaryTagItemsFor($ids, $number, $prison)
  {
    $results = $this->getInitialQuery($prison);

    if (count($ids) > 0) {
      for ($i = 0; $i < count($ids); $i++) {
          $results->condition("field_moj_secondary_tags.$i", $ids[$i]);
      }
    }

    $results->sort('nid', 'DESC');
    return $results->range(0, $number)->execute();
  }

  /**
   * Setup a query
   *
   * @param int $prison_id
   *
   * @return array
   */
  private function getInitialQuery($prison_id = 0)
  {
    $types = array('page', 'moj_pdf_item', 'moj_radio_item', 'moj_video_item',);
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('type', $types, 'IN')
      ->accessCheck(false);

    $results = getPrisonResults($prison_id, $results);

    return $results;
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
