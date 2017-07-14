<?php

namespace Drupal\moj_new_content\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller routines for page example routes.
 */
class NewContentController extends ControllerBase
{

    protected $page_data = array();

    /**
     * getNewVideoNodeIds()
     *
     * @param NodeInterface|null $parent
     * @return array|int
     */

    protected static function getNewVideoNodeIds(NodeInterface $parent = null)
    {
        $query = \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('type', 'moj_hub_item', '=')
            ->sort('field_moj_weight')
            ->sort('nid');
        return $query->execute();
    }

    /**
     * getNewHubNodeIds()
     *
     * @param NodeInterface|null $parent
     * @return array|int
     */

    protected static function getNewPdfNodeIds(NodeInterface $parent = null)
    {
        $query = \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('type', 'moj_pdf_item', '=')
            ->sort('created' , 'DESC')
            ->range(0, 5);
        return $query->execute();
    }

    /**
     * serialiseHubData();
     *
     * @param $nodes
     * @return json
     */

    protected static function serialisePdfData($nodes)
    {
        $serializer = \Drupal::service('moj_pdf_item.serializer.default'); // TODO: Inject dependency
        return  $serializer->serialize(array_values($nodes), 'json', ['plugin_id' => 'entity']);
    }

    protected static function stripPdfNodes($nodes)
    {
        print_r($nodes);
    }

    /**
     * landingPage()
     *
     * @return JsonResponse
     */

    public function landingPage()
    {
        $nids = self::getNewPdfNodeIds();
        $nodes = self::loadNodes($nids);
        // $nodes = self::stripPdfNodes($nodes);
        $data = self::serialisePdfData($nodes);

//        $hub_items = array_map(function ($i) {
//            return self::translateNode($i);
//        }, $hub_items);


        $this->page_data['links'] = json_decode($data);
        return new JsonResponse($this->page_data);
    }

    protected static function loadNodes($nids)
    {
        $node_storage = \Drupal::entityTypeManager()->getStorage('node');    // TODO: Inject dependency
        $items = array_filter(
            $node_storage->loadMultiple($nids), function ($item) {
                return $item->access();
            }
        );
        return $items;
    }
}