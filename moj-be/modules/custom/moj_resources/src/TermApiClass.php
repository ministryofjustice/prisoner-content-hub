<?php

namespace Drupal\moj_resources;

use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\Core\Entity\Query\QueryFactory;
use Symfony\Component\Serializer\Serializer;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * PromotedContentApiClass
 */

class TermApiClass
{
    /**
     * Term
     *
     * @var array
     */
    protected $term;
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
    public function TermApiEndpoint($lang, $term_id)
    {
        $this->lang = $lang;
        return $this->term_storage->load($term_id);
        // $this->term = $this->term_storage->load($term_id);
        // return array_map('self::translateNode', $this->term);
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
}
