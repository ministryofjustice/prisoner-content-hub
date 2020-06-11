<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

require_once('Utils.php');

/**
 * CategoryMenuApiClass
 */

class CategoryMenuApiClass
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
  public function CategoryMenuApiEndpoint($lang, $category, $prison)
  {
    $this->lang = $lang;
    return $this->getCategoryMenuNodeIds($category, $prison);
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
  private function getCategoryMenuNodeIds($category, $prison)
  {
    $bundle = array('page', 'moj_pdf_item', 'moj_radio_item', 'moj_video_item', );

    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('type', $bundle, 'IN')
      ->accessCheck(false);

    if ($category !== 0) {
      $group = $results
        ->orConditionGroup()
        ->condition('field_moj_top_level_categories', $category)
        ->condition('field_moj_tags', $category);
      $results->condition($group);
    }

    $results = getPrisonResults($prison, $results);

    $nids = $results->execute();
    $nodes = $this->loadNodesDetails($nids);

    return $this->generateMenuFrom($nodes);
  }

  /**
   * Extract Series And Secondary Tag Ids
   *
   * @param array $nodes
   * @return array
   */

  private function extractSeriesAndSecondaryTagIdsFrom($data)
  {
    return array_map(function ($n) {
      $arr = [];
      $arr['id'] = $n->nid->value;
      $arr['secondary_tag_id'] = $n->field_moj_secondary_tags->target_id;
      $arr['series_id'] = $n->field_moj_series->target_id;
      return $arr;
    }, $data);
  }

  private function filterOutNonSeriesOrSecondaryTags($data)
  {
    return array_filter($data, function ($n) {
      return boolval($n['secondary_tag_id']) || boolval($n['series_id']);
    });
  }

  private function splitSecondaryTagsAndSeries($data)
  {
    return array_reduce($data, function ($acc, $curr) {
      if (boolval($curr['secondary_tag_id'])) {
        $exists = in_array($curr['secondary_tag_id'], $acc['secondary_tag_ids']);
        if (!$exists) {
          $acc['secondary_tag_ids'][] = $curr['secondary_tag_id'];
        }
      }
      if (boolval($curr['series_id'])) {
        $exists = in_array($curr['series_id'], $acc['series_ids']);
        if (!$exists) {
          $acc['series_ids'][] = $curr['series_id'];
        }
      }
      return $acc;
    }, ['secondary_tag_ids' => [], 'series_ids' => []]);
  }

  private function fillSecondaryTagsAndSeries($data)
  {
    $result = array();
    $result['secondary_tag_ids'] = array_map($this->translateNode, $this->loadTermDetails($data['secondary_tag_ids']));
    $result['series_ids'] = array_map($this->translateNode, $this->loadTermDetails($data['series_ids']));

    return $result;
  }

  private function generateMenuFrom($nodes)
  {
    $menu = $this->extractSeriesAndSecondaryTagIdsFrom($nodes);
    $menu = $this->filterOutNonSeriesOrSecondaryTags($menu);
    $menu = $this->splitSecondaryTagsAndSeries($menu);
    $menu = $this->fillSecondaryTagsAndSeries($menu);

    return $menu;
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

  private function loadTermDetails(array $nids)
  {
    return $this->term_storage->loadMultiple($nids);
  }
}
