<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * PromotedContentApiClass
 */

class PromotedContentApiClass
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
     * Instance of queryFactory
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
  public function PromotedContentApiEndpoint($lang, $prison)
  {
    return self::getPromotedContentNodeIds($prison);
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
  protected function getPromotedContentNodeIds($prison)
  {
    $series = $this->promotedSeries($prison);
    $tags = $this->promotedTags($prison);
    $nodes = $this->loadNodesDetails($this->promotedNodes($prison));

    $results = array_merge($series, $tags, $nodes);

    usort($results, function ($a, $b) {
      return $b->changed->value - $a->changed->value;
    });

    $decoratedResults = $this->decoratePromotedContent($results);

    return sizeof($decoratedResults) > 0 ? $decoratedResults[0] : array();
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

  private function promotedNodes($prison)
  {
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->condition('sticky', 1)
      ->sort('changed', 'DESC');

    if ($prison == $this->berwyn_prison_id) {
      $berwyn = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $prison, '=')
        ->notExists('field_moj_prisons');

      $results->condition($berwyn);
    }

    if ($prison == $this->wayland_prison_id) {
      $wayland = $results
        ->orConditionGroup()
        ->condition('field_moj_prisons', $prison, '=')
        ->notExists('field_moj_prisons');

      $results->condition($wayland);
    }

    $results
      ->range(0, 1)
      ->accessCheck(false);

    return $results->execute();
  }

  private function promotedSeries($prison)
  {
    $series = $this->term_storage->loadTree('series');

    return $this->promotedTerms($series, $prison);
  }

  private function promotedTags($prison)
  {
    $tags = $this->term_storage->loadTree('tags');

    return $this->promotedTerms($tags, $prison);
  }

  private function promotedTerms($data, $prison)
  {
    $termIds = [];

    foreach ($data as $id => $item) {
      $termIds[] = $item->tid;
    }

    $terms = $this->term_storage->loadMultiple($termIds);

    $promotedTerms = array_filter($terms, function ($item) use ($prison) {
      if ($item->field_moj_promoted->value == true && $prison == $item->field_promoted_to_prison->target_id) {
        return true;
      } elseif ($item->field_moj_promoted->value == true && !$item->field_promoted_to_prison->target_id) {
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
