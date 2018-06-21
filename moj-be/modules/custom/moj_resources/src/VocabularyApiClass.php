<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\Core\Entity\Query\QueryFactory;
use Symfony\Component\Serializer\Serializer;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * FeaturedContentApiClass
 */

class VocabularyApiClass
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
     * @var Drupal\Core\Entity\EntityTypeManager
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
     * The custom serializer for terms.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $termSerializer;

    /**
     * Class Constructor 
     *
     * @param EntityTypeManager $entityTypeManager
     * @param QueryFactory $entityQuery
     */
    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        QueryFactory $entityQuery,
        Serializer $termSerializer
    ) {
        $this->term_storage = $entityTypeManager->getStorage('taxonomy_term');
        $this->entity_query = $entityQuery;
        $this->termSerializer = $termSerializer;
    }
    /**
     * API resource function
     *
     * @param [string] $lang
     * @param [string] $category
     * @return array
     */
    public function VocabularyApiEndpoint($lang, $category)
    {
        $this->lang = $lang;
        $this->tids = self::getVocabularyTids($category); 
        $this->nodes = $this->term_storage->loadMultiple($this->tids);
        $translatedNodes = array_map('self::translateNode', $this->nodes);
        return self::serialize($translatedNodes);
    }
    /**
     * TranslateNode function
     *
     * @param NodeInterface $term
     * 
     * @return $term
     */
    protected function translateNode($term) 
    {
        return $term->hasTranslation($this->lang) ? $term->getTranslation($this->lang) : $term;
    }
    /**
     * Get tids
     *
     * @return $tids
     */
    protected function getVocabularyTids($category) 
    {
        return $this->entity_query->get('taxonomy_term')
            ->condition('vid', $category)
            ->execute();
    }
    /**
     * Sanitise terms
     *
     * @param [array] $item
     * @return array
     */
    protected function serialize($items) 
    {
        return $this->termSerializer->serialize($items, 'json', ['plugin_id' => 'entity']);
    }
}
