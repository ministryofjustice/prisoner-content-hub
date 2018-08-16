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
        $this->nid = $nid;
        $this->node = $this->loadNodesDetails($this->nid);
        return $this->translateNode($this->node);
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
     * Load full node details
     *
     * @param array $nids
     * @return array 
     */
    protected function loadNodesDetails($nid)
    {
        return $this->node_storage->load($nid);
    }

}
