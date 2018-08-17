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
        $this->nids = self::getPromotedContentNodeIds();
        $this->nodes = self::loadNodesDetails($this->nids);
    }
    /**
     * API resource function
     *
     * @param [string] $lang
     * @return array
     */
    public function PromotedContentApiEndpoint($lang)
    {   
        $this->lang = $lang;
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
    protected function getPromotedContentNodeIds()
    {
        return $this->entity_query->get('node')
            ->condition('status', 1)
            ->condition('promote', 1)
            ->sort('created', 'DESC')
            ->range(0, 1)
            ->accessCheck(false)
            ->execute();
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
