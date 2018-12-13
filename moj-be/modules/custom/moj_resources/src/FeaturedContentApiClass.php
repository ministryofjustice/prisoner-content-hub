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
    public function FeaturedContentApiEndpoint($lang, $category, $number, $prison)
    {
        $this->lang = $lang;
        $this->nids = self::getFeaturedContentNodeIds($category, $number, $prison);
        $this->nodes = self::loadNodesDetails($this->nids);
        // $this->nodes = self::filterPrison($this->nodes, $prison);
        usort($this->nodes, 'self::sortByWeightDescending');
        return array_map('self::translateNode', $this->nodes);
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
        $results = $this->entity_query->get('node')
            ->condition('status', 1)
            ->condition('promote', 1)
            ->accessCheck(false);
        
        # Berwyn 792
        if ($prison == 792) 
        {
            $berwyn = $results
                ->orConditionGroup()
                ->condition('field_moj_prisons', $prison, '<>')
                ->notExists('field_moj_prisons');
            $results->condition($berwyn);
        }
        # Wayland 793
        if ($prison == 793) 
        {
            $wayland = $results
                ->orConditionGroup()
                ->condition('field_moj_prisons', $prison, '<>')
                ->notExists('field_moj_prisons');
            $results->condition($wayland);
        }   
        if ($category !== 0) {
            $results->condition('field_moj_top_level_categories', $category);
        };    
        $results->range(0, $number);
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

    protected function filterPrison(array $nodes, $prisonId)
    {
        return array_filter(
            $nodes, function ($item)
            {
                if($item->field_moj_prisons[0]->target_id === $prisonId)
                {
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
        $serializer = \Drupal::service($item->getType().'.serializer.default'); // TODO: Inject dependency
        return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
    }
}
