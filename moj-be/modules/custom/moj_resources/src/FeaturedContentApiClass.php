<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * PromotedContentApiClass
 */

class FeaturedContentApiClass
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

  private $berwyn_prison_id = 792;
  private $wayland_prison_id = 793;

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
  public function FeaturedContentApiEndpoint($lang, $category, $number, $prison)
  {
    // $this->lang = $lang;
    return self::getFeaturedContentNodeIds($category, $number, $prison);
    // $this->nodes = self::loadNodesDetails($this->nids);
    // $this->nodes = self::filterPrison($this->nodes, $prison);
    // usort($this->nodes, 'self::sortByWeightDescending');
    // return array_map('self::translateNode', $this->nodes);
    // return array_map('self::serialize', $translatedNodes);
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
  protected function getFeaturedContentNodeIds($category, $number, $prison = 0)
  {
    $series = $this->promotedSeries($category, $prison);
    $nodes = $this->promotedNodes($category, $number, $prison);
    $results = array_merge($series, $nodes);

    //sort them out
    usort($results, function ($a, $b) {
      return $b->changed->value - $a->changed->value;
    });

    $decoratedResults = $this->decoratePromotedContent($results);

    return array_slice($decoratedResults, 0, $number);
  }



  private function decoratePromotedContent($data)
  {
    return array_map(function ($item) {
      $result = [];
      $result['id'] = $item->nid->value ? $item->nid->value : $item->tid->value;
      $result['title'] = $item->title->value ? $item->title->value : $item->name->value;
      $result['type'] = $item->vid->target_id ? $item->vid->target_id : $item->type->target_id;
      $result['summary'] = $item->field_content_summary ? $item->field_content_summary->value : $item->field_moj_description->summary;
      $result['featured_image'] = $item->field_featured_image ? $item->field_featured_image : $item->field_moj_thumbnail_image;
      $result['duration'] = $item->field_moj_duration->value;
      if ($result['type'] == 'landing_page') {
        $result['featured_image'] = $item->field_image;
      }

      return $result;
    }, $data);
  }

  private function extractSeriesIdsFrom($nodes)
  {
    $seriesIds = [];
    foreach ($nodes as $key => $n) {
      $seriesIds[] = $n->field_moj_series->target_id;
    }

    return $seriesIds;
  }


  private function promotedSeries($category, $prison)
  {
    $nids = $this->allNodes($category, $prison);
    $nodes = $this->loadNodesDetails($nids);
    $series = $this->extractSeriesIdsFrom($nodes);

    return $this->promotedTerms(array_unique($series), $prison);
  }


  private function promotedNodes($category, $number, $prison)
  {
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('promote', 1)
      ->accessCheck(false);

    if ($prison == $this->berwyn_prison_id) {
      $berwyn = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $this->wayland_prison_id, '!=')
        ->notExists('field_moj_prisons');
      $results->condition($berwyn);
    }

    if ($prison == $this->wayland_prison_id) {
      $wayland = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $this->berwyn_prison_id, '!=')
        ->notExists('field_moj_prisons');
      $results->condition($wayland);
    }
    if ($category !== 0) {
      $results->condition('field_moj_top_level_categories', $category);
    };

    $results->range(0, $number);
    $nodes = $results->execute();

    return $this->loadNodesDetails($nodes);
  }

  private function allNodes($category, $prison)
  {
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->accessCheck(false);

    if ($prison == $this->berwyn_prison_id) {
      $berwyn = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $this->wayland_prison_id, '!=')
        ->notExists('field_moj_prisons');
      $results->condition($berwyn);
    }

    if ($prison == $this->wayland_prison_id) {
      $wayland = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $this->berwyn_prison_id, '!=')
        ->notExists('field_moj_prisons');
      $results->condition($wayland);
    }
    if ($category !== 0) {
      $results->condition('field_moj_top_level_categories', $category);
    };

    return $results->execute();
  }

  private function promotedTerms($termIds, $prison)
  {
    $terms = $this->term_storage->loadMultiple($termIds);
    $promotedTerms = array_filter($terms, function ($item) use ($prison) {
      if ($item->field_promoted_feature->value == true && $prison == $item->field_promoted_to_prison->target_id) {
        return true;
      } elseif ($item->field_promoted_feature->value == true && !$item->field_promoted_to_prison->target_id) {
        return true;
      } else {
        return false;
      }
    });

    usort($promotedTerms, function ($a, $b) {
      return $b->changed->value - $a->changed->value;
    });

    return $promotedTerms;
  }


  /**
     * Load full node details
     *
     * @param array $nids
     * @return array
     */
  protected function loadNodesDetails(array $nids)
  {
    return array_filter(
      $this->node_storage->loadMultiple($nids),
      function ($item) {
        return $item->access();
      }
    );
  }

  protected function filterPrison(array $nodes, $prisonId)
  {
    return array_filter(
      $nodes,
      function ($item) {
        if ($item->field_moj_prisons[0]->target_id === $prisonId) {
          return $item;
        }
      }
    );
  }
  /**
     * sortByWeight
     *
     */
  protected function sortByWeightDescending($a, $b)
  {
    return (int)$a->field_moj_weight->value > (int)$b->field_moj_weight->value;
  }
  /**
     * Sanitise node
     *
     * @param [type] $item
     * @return void
     */
  protected function serialize($item)
  {
    $serializer = \Drupal::service($item->getType() . '.serializer.default'); // TODO: Inject dependency
    return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
  }
}
