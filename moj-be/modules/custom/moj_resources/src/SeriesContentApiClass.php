<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * PromotedContentApiClass
 */

class SeriesContentApiClass
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
    $this->entity_query = $entityQuery;
  }
  /**
   * API resource function
   *
   * @param [string] $lang
   * @return array
   */
  public function SeriesContentApiEndpoint($lang, $series_id, $number, $offset, $prison, $sort_order)
  {
    $this->lang = $lang;
    $this->nids = $this->getSeriesContentNodeIds($series_id, $number, $offset, $prison);
    $this->nodes = $this->loadNodesDetails($this->nids);

    $series = $this->decorateSeries($this->nodes);
    $series = $this->sortSeries($series, $sort_order);

    return $series;
  }
  /**
   * API resource function
   *
   * @param [string] $lang
   * @return array
   */
  public function SeriesNextEpisodeApiEndpoint($lang, $series_id, $number, $episode_id, $prison, $sort_order)
  {
    $this->lang = $lang;
    $this->nids = $this->getSeriesContentNodeIds($series_id, null, null, $prison);
    $this->nodes = $this->loadNodesDetails($this->nids);
    $series = $this->decorateSeries($this->nodes);
    $series = $this->sortSeries($series, $sort_order);
    $series = $this->getNextEpisodes($episode_id, $series, $number);

    return $series;
  }
  /**
   * decorateSeries
   *
   */
  private function decorateSeries($node)
  {
    $results = array_reduce($node, function ($acc, $curr) {
      $episode_id = ($curr->field_moj_season->value * 1000) + ($curr->field_moj_episode->value);
      $result = [];
      $result["episode_id"] = $episode_id;
      $result["content_type"] = $curr->type->target_id;
      $result["title"] = $curr->title->value;
      $result["id"] = $curr->nid->value;
      $result["image"] = $curr->field_moj_thumbnail_image[0];
      $result["season"] = $curr->field_moj_season->value;
      $result["episode"] = $curr->field_moj_episode->value;
      $result["duration"] = $curr->field_moj_duration->value;
      $result["description"] = $curr->field_moj_description[0];
      $result["categories"] = $curr->field_moj_top_level_categories;
      $result["secondary_tags"] = $curr->field_moj_tags;
      $result["prisons"] = $curr->field_moj_prisons;

      if ($result["content_type"] === 'moj_radio_item') {
        $result["media"] = $curr->field_moj_audio[0];
      } else {
        $result["media"] = $curr->field_moj_video[0];
      }

      $acc[] = $result;

      return $acc;
    }, []);

    return $results;
  }
  /**
   * sortSeries
   *
   */
  private function sortSeries(&$series, $sort_order)
  {
    usort($series, function ($a, $b) use ($sort_order) {
      if ($a['episode_id'] == $b['episode_id']) {
        return 0;
      }

      if ($sort_order == 'ASC') {
        return ($a['episode_id'] < $b['episode_id']) ? -1 : 1;
      }

      return ($b['episode_id'] > $a['episode_id']) ? 1 : -1;
    });

    return $series;
  }
  /**
   * getNextEpisodes
   *
   */
  private function getNextEpisodes($episode_id, $series, $number)
  {
    function indexOf($comp, $array)
    {
      foreach ($array as $key => $value) {
        if ($comp($value)) {
          return $key;
        }
      }
    }

    $episode_index = indexOf(function ($value) use ($episode_id) {
      return $value['episode_id'] == $episode_id;
    }, $series);

    if (is_null($episode_index)) {
      return array();
    }

    $episode_offset = $episode_index + 1;

    $episodes = array_slice($series, $episode_offset, $number);

    return $episodes;
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
  private function getSeriesContentNodeIds($series_id, $number, $offset, $prison)
  {
    $results = $this->entity_query->get('node')
      ->condition('status', 1)
      ->accessCheck(false);

    if ($series_id !== 0) {
      $results->condition('field_moj_series', $series_id);
    }

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

    if ($number) {
      $results->range($offset, $number);
    }

    return $results
      ->execute();
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
  /**
   * Sanitise node
   *
   * @param [type] $item
   * @return void
   */
  private function serialize($item)
  {
    $serializer = \Drupal::service($item->getType() . '.serializer.default'); // TODO: Inject dependency
    return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
  }
}
