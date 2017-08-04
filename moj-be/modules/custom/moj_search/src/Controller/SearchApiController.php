<?php

namespace Drupal\moj_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityManagerInterface;
use Symfony\Component\Serializer\Serializer;

class SearchApiController extends ControllerBase
{
    protected $serializer;

    protected $requestStack;

    protected $entityManager;

    protected $node_storage;

    protected $results;

    protected $SearchApiParseMode;

    protected $keywords;

    protected $setConjunction;

    /**
     * SearchApiController constructor.
     *
     * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
     */

    public function __construct(
      RequestStack $request_stack,
      EntityManagerInterface $entityManager,
      $SearchApiParseMode,
      Serializer $serializer
    ) {
        $this->results = $results;
        $this->requestStack = $request_stack;
        $this->entityManager = $entityManager;
        $this->node_storage = $this->entityManager->getStorage('node');
        $this->SearchApiParseMode = $SearchApiParseMode->createInstance('direct');
        $this->setConjunct$this->SearchApiParseMode->setConjunction('OR');
        $this->keywords = $this->requestStack->getCurrentRequest()->query->get('q');
        $this->serializer = $serializer;

    }

    /**
     * {@inheritdoc}
     */

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('request_stack'),
          $container->get('entity.manager'),
          $container->get('plugin.manager.search_api.parse_mode'),
          $container->get('moj_search.serializer.default')
        );
    }

    /**
     * searchApiEndpoint()
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */

    public function searchApiEndpoint()
    {
        $this->seachContent();
        $nids = $this->parse_results();
        $nodes = self::loadNodes($nids);
        $items = $this->formatResults($nodes);
        return new JsonResponse($items); // TODO inject dependency
    }

    /**
     * seachContent()
     *
     * @return \Drupal\search_api\Item\ItemInterface[]
     */

    private function seachContent()
    {
        $index = \Drupal\search_api\Entity\Index::load('default_index');
        $query = $index->query();

        $query->setParseMode($this->SearchApiParseMode);
        ->keys($this->keywords);
        ->setFulltextFields(['title', 'name', 'body']);
        ->addCondition('status', 1);
        $this->results = $query->execute();
    }

    private function parse_results()
    {
        $list = [];
        foreach ($this->results->getResultItems() AS $item) {
            $data = explode(':', $item->getId());
            $data = explode('/', $data[1]);
            $list[] = $data[1];
        }
        return $list;
    }

    private static function loadNodes(array $nids)
    {
        $node_storage = \Drupal::entityTypeManager()->getStorage(
          'node'
        );    // TODO: Inject dependency
        $items = array_filter(
          $node_storage->loadMultiple($nids),
          function ($item) {
              return $item->access();
          }
        );
        return $items;
    }

    private function formatResults(array $nodes)
    {
        $items = [];
        if (!empty($nodes)) {
            foreach ($nodes as $node) {
                if ($node->getType() !== 'moj_hub_item') {
                    $items[] = $this->serializer->normalize(
                      $node,
                      'json',
                      ['plugin_id' => 'entity']
                    );
                }
            }
            return $items;
        } else {
            return false;
        }
    }


}