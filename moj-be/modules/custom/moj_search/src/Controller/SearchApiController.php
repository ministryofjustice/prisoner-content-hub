<?php

namespace Drupal\moj_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityManagerInterface;

class SearchApiController extends ControllerBase
{

    private $requestStack;

    protected $entityManager;

    protected $node_storage;

    /**
     * SearchApiController constructor.
     *
     * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
     */

    public function __construct(RequestStack $request_stack, EntityManagerInterface $entityManager)
    {
        $this->requestStack = $request_stack;
        $this->entityManager = $entityManager;
        $this->node_storage = $this->entityManager->getStorage('node');
    }

    /**
     * {@inheritdoc}
     */

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('request_stack'),
          $container->get('entity.manager')
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
        $nids = $this->parse_results($results);
        $nodes = self::loadNodes($nids);
        $items = $this->formatResults($nodes);

        return new JsonResponse($items); // TODO inject dependency
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
        $results = $query->execute();

        return $results->getResultItems();
    }

    public function parse_results(array $results)
    {
        $list = [];
        foreach ($results AS $item) {
            // The pattern is "entity:[entity_type]:[entity_id]:[language_code]".
            // For example "entity:node/1:en".
            $data = explode(':', $item->getId());
            $data = explode('/', $data[1]);
            $list[] = $data[1];
        }

        return $list;
    }

    protected static function loadNodes(array $nids)
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

    public function formatResults(array $nodes)
    {
        $items = [];
        if(!empty($nodes)) {
            foreach ($nodes as $node) {
                if($node->getType() !== 'moj_hub_item'){
                $items[] = [
                  'title' => $node->getTitle(),
                  'link' => $this->generatelinks($node->getType(), $node->id()),
                ];
                }
            }
            return $items;
        } else {
            return false;
        }
    }

    public function generatelinks(string $type, int $nid)
    {
        switch ($type) {
            case 'moj_video_item':
                return '/video/' . $nid;
                break;
            case 'moj_radio_item':
                return '/radio/' . $nid;
                break;
            case 'moj_pdf_item':
                return $this->getpdflink($nid);
                break;
        }
    }

    public function getpdflink(int $nid)
    {
        $node = $this->node_storage->load($nid);
        $filePath = file_create_url($node->get('field_moj_pdf')->entity->getFileUri());
        return $this->checkFileType($filePath);
    }

    public function checkFileType(string $filePath)
    {
        if(substr($filePath, -4) == '.pdf') {
            return $filePath;
        }

        if(substr($filePath, -5) == '.epub') {
            return '/epub?pdf=' . $filePath;
        }
    }
}