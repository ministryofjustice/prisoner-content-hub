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
    public function PromotedContentApiEndpoint($lang, $prison)
    {
        $nids = self::getPromotedContentNodeIds($prison);
        $this->lang = $lang;
        $this->nodes = self::loadNodesDetails($nids);
        return array_map('self::translateNode', $this->nodes);
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
        $berwyn_prison_id = 792;
        $wayland_prison_id = 793;

        $results = $this->entity_query->get('node')
            ->condition('status', 1)
            ->condition('sticky', 1)
            ->sort('changed', 'DESC');

        if ($prison == $berwyn_prison_id)
        {
          $berwyn = $results
              ->orConditionGroup()
              ->condition('field_moj_prisons', $prison, '=')
              ->notExists('field_moj_prisons');

          $results->condition($berwyn);
        }

        if ($prison == $wayland_prison_id)
        {
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
    /**
     * Load full node details
     *
     * @param array $nids
     * @return array
     */
    protected function loadNodesDetails(array $nids)
    {
        return array_filter(
            $this->node_storage->loadMultiple($nids), function ($item)
            {
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
        $serializer = \Drupal::service($item->getType().'.serializer.default'); // TODO: Inject dependency
        return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
    }
}
