<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

require_once('Utils.php');

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
    return $this->getFeaturedContentNodeIds($category, $number, $prison);
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
    $series = $this->promotedSeries($category, $prison);
    $nodes = $this->promotedNodes($category, $number, $prison);
    $results = array_merge($series, $nodes);

    //sort them out
    usort($results, function ($a, $b) {
      return $b->changed->value - $a->changed->value;
    });

    return array_slice($results, 0, $number);
  }

  private function decorateContent($node)
  {
    $result = [];
    $result['id'] = $node->nid->value;
    $result['title'] = $node->title->value;
    $result['content_type'] = $node->type->target_id;
    $result['summary'] = $node->field_moj_description->summary;
    $result['image'] = $node->field_moj_thumbnail_image ? $node->field_moj_thumbnail_image[0] : $node->field_image[0];
    $result['duration'] = $node->field_moj_duration->value;

    return $result;
  }

  private function decorateTerm($term)
  {
    $result = [];
    $result['id'] = $term->tid->value;
    $result['title'] = $term->name->value;
    $result['content_type'] = $term->vid->target_id;
    $result['summary'] = $term->field_content_summary->value;
    $result['image'] = $term->field_featured_image[0];
    $result['audio'] = $term->field_featured_audio[0];
    $result['video'] = $term->field_featured_video[0];

    return $result;
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
    $nids = $this->allNodes($category);
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

    $results = getPrisonResults($prison, $results);

    if ($category !== 0) {
      $results->condition('field_moj_top_level_categories', $category);
    };

    $results->range(0, $number);
    $nodes = $results->execute();

    $promotedContent = $this->loadNodesDetails($nodes);

    return array_map(array($this, 'decorateContent'), $promotedContent);
  }

  private function allNodes($category)
  {
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->accessCheck(false);

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

    return array_map(array($this, 'decorateTerm'), $promotedTerms);
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
