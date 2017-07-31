<?php

namespace Drupal\moj_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SearchApiController extends ControllerBase
{
    private $requestStack;

    /**
     * SearchApiController constructor.
     *
     * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
     */

    public function __construct(RequestStack $request_stack)
    {
        $this->requestStack = $request_stack;
    }

    /**
     * {@inheritdoc}
     */

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('request_stack')
        );
    }

    /**
     * searchApiEndpoint()
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */

    public function searchApiEndpoint()
    {
        $results = $this->seachContent();
        return new JsonResponse($results); // TODO inject dependency
    }

    /**
     * seachContent()
     *
     * @return \Drupal\search_api\Item\ItemInterface[]
     */

    public function seachContent()
    {
        $keywords = $this->requestStack->getCurrentRequest()->query->get('q');
        $index = \Drupal\search_api\Entity\Index::load('default_index');
        $query = $index->query();
        $parse_mode = \Drupal::service('plugin.manager.search_api.parse_mode')
          ->createInstance('direct');
        $parse_mode->setConjunction('OR');
        $query->setParseMode($parse_mode);
        $query->keys($keywords);
        $query->setFulltextFields(['title', 'name', 'body']);
        $query->addCondition('status', 1);
        $query->addTag('custom_search');
        $results = $query->execute();
        return $results->getResultItems();
    }
}