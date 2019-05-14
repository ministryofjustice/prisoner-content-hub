<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * ContentApiClass
 */

class ContentApiClass
{
  /**
   * Node IDs
   *
   * @var array
   */
  protected $nid = array();

  /**
   * Nodes
   *
   * @var array
   */
  protected $node = array();
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
  public function ContentApiEndpoint($lang, $nid)
  {
    $this->lang = $lang;
    $node = $this->loadNodesDetails($nid);

    if (is_null($node)) {
      return array();
    }

    $translatedNodes = $this->translateNode($node);

    return $this->decorateContent($translatedNodes);
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
   * Load full node details
   *
   * @param array $nids
   * @return array
   */
  private function loadNodesDetails($nid)
  {
    return $this->node_storage->load($nid);
  }

  /**
   *
   */
  private function decorateContent($node)
  {
    $content_type = $node->type->target_id;
    $defaults = $this->createItemResponse($node);

    switch ($content_type) {
      case 'moj_radio_item':
        return array_merge($defaults, $this->createAudioItemResponse($node));
      case 'moj_video_item':
        return array_merge($defaults, $this->createVideoItemResponse($node));
      case 'moj_pdf_item':
        return array_merge($defaults, $this->createPDFItemResponse($node));
      case 'page':
        return array_merge($defaults, $this->createPageItemResponse($node));
      case 'landing_page':
        return array_merge($defaults, $this->createLandingPageItemResponse($node));

      default:
        return $defaults;
    }
  }

  private function createItemResponse($node)
  {
    $result = [];
    $result["content_type"] =  $node->type->target_id;
    $result["title"] =  $node->title->value;
    $result["id"] =  $node->nid->value;
    $result["image"] =  $node->field_moj_thumbnail_image[0];
    $result["description"] =  $node->field_moj_description[0];
    $result["categories"] =  $node->field_moj_top_level_categories;
    $result["secondary_tags"] =  $node->field_moj_tags;
    $result["prisons"] =  $node->field_moj_prisons;

    return  $result;
  }

  private function createAudioItemResponse($node)
  {
    $result = [];

    $result['media'] = $node->field_moj_audio[0];
    $result["episode_id"] = $this->createEpisodeId($node);
    $result["series_id"] = $node->field_moj_series[0]->target_id;
    $result["season"] = $node->field_moj_season->value;
    $result["episode"] = $node->field_moj_episode->value;
    $result["duration"] = $node->field_moj_duration->value;

    return $result;
  }

  private function createVideoItemResponse($node)
  {
    $result = [];

    $result['media'] = $node->field_moj_video[0];
    $result["episode_id"] = $this->createEpisodeId($node);
    $result["series_id"] = $node->field_moj_series[0]->target_id;
    $result["season"] = $node->field_moj_season->value;
    $result["episode"] = $node->field_moj_episode->value;
    $result["duration"] = $node->field_moj_duration->value;

    return $result;
  }

  private function createPageItemResponse($node)
  {
    $result = [];
    $result['stand_first'] = $node->field_moj_stand_first->value;
    return $result;
  }


  private function createPDFItemResponse($node)
  {
    $result = [];
    $result['media'] = $node->field_moj_pdf[0];

    return $result;
  }

  private function createEpisodeId($node)
  {
    return ($node->field_moj_season->value * 1000) + ($node->field_moj_episode->value);
  }

  private function createLandingPageItemResponse($node)
  {
    $result = [];
    $result['featured_content_id'] =  $node->field_moj_landing_feature_contet[0]->target_id;
    $result['category_id'] =  $node->field_moj_landing_page_term[0]->target_id;
    return  $result;
  }
}
