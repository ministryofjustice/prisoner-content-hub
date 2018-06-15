<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
/**
 * FeaturedContentApiClass
 */

class FeaturedContentApiClass
{
    /**
     * Holds a list of  variable
     *
     * @var array
     */
    protected $nids = array();
    
    /**
     * Undocumented variable
     *
     * @var array
     */
    protected $nodes = array();
    /**
     * Undocumented variable
     *
     * @var [type]
     */
    protected $lang;
    /**
     * Undocumented variable
     *
     * @var [type]
     */
    protected $node_storage;
    /**
     * Entitity Query
     *
     * @var Drupal\Core\Entity\Query\QueryFactory
     * 
     * Instance of querfactory 
     */
    protected $entity_query;
    /**
     * Undocumented function
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
        $this->nids = self::getFeaturedContentNodeIds();
        print_r($this->nids);
        $this->nodes = self::loadNodesDetails($this->nids);
    }
    /**
     * Undocumented function
     *
     * @param [type] $lang
     * @return array
     */
    public function FeaturedContentApiEndpoint($lang)
    {   
        $this->lang = $lang;
        $translatedNodes = array_map('self::translateNode', $this->nodes);
        return array_map('self::serialize', $translatedNodes);
    }
    /**
     * TranslateNode function
     *
     * @param NodeInterface $node
     * A loaded node
     * 
     * @return $node
     */
    protected function translateNode(NodeInterface $node) 
    {
        return $node->hasTranslation($this->lang) ? $node->getTranslation($this->lang) : $node;
    }
    /**
     * Undocumented function
     *
     * @return void
     */
    protected function getFeaturedContentNodeIds() 
    {
        return $this->entity_query->get('node')
            ->condition('status', 1)
            ->condition('promote', 1)
            ->sort('created', 'DESC')
            ->range(0, 1)
            ->execute();
    }
    /**
     * Undocumented function
     *
     * @param array $nids
     * @return void
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
     * Undocumented function
     *
     * @param [type] $item
     * @return void
     */
    protected function serialize($item) 
    {
        $serializer = \Drupal::service($item->getType().'.serializer.default'); // TODO: Inject dependency
        return $serializer->serialize($item, 'json', ['plugin_id' => 'entity']);
    }

    public function test()
    {
        return true;
    }
}
