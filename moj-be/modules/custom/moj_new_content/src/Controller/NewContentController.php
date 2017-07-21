<?php

namespace Drupal\moj_new_content\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller routines for page example routes.
 */
class NewContentController extends ControllerBase
{
    /**
     * Set vars.
     */

    protected $pageData = array();
    protected $todaysDate = array();

    /**
     * NewContentController constructor.
     */

    function __construct()
    {
        $this->todaysDate = array(
            'start' => strtotime(date('Y-m-d 00:00:00')),
            'end' => strtotime(date('Y-m-d 23:59:59')),
        );
        $this->pageData = array(
            'todaysdate' => date('jS F Y'),
            'books' => false,
            'videos' => false,
            'audio' => false
        );
        self::init();
    }

    /**
     * init()
     *
     */

    public function init()
    {
        $pdfData = self::buildRenderArray('moj_pdf_item', 'moj_pdf_item.serializer.default');
        if (self::cheackIfEmpty(json_decode($pdfData, true))) {
            $this->pageData['books'] = json_decode($pdfData);
        }
        $videoData = self::buildRenderArray('moj_video_item', 'moj_video_item.serializer.default');
        if (self::cheackIfEmpty(json_decode($videoData, true))) {
            $this->pageData['videos'] = self::groupVideos(json_decode($videoData, true));
        }
        $audioData = self::buildRenderArray('moj_radio_item', 'moj_radio_item.serializer.default');
        if (self::cheackIfEmpty(json_decode($audioData, true))) {
            $this->pageData['audio'] = json_decode($audioData);
        }
    }

    /**
     * testNewContent()
     *
     * @return JsonResponse
     */

    public function testNewContent()
    {
        if (
            $this->pageData['books'] === false &&
            $this->pageData['videos'] === false &&
            $this->pageData['audio'] === false
            )
        {
            return new JsonResponse(false);
        } else {
            return new JsonResponse(true);
        }
    }

    /**
     * landingPage()
     *
     * @return JsonResponse
     */

    public function landingPage()
    {
        return new JsonResponse($this->pageData);
    }

    /**
     * buildRenderArray()
     *
     * @return json
     */

    public function buildRenderArray(string $type, string $serialiseData)
    {
        $nids = self::getNewNodeIds($type);
        $nodes = self::loadNodes($nids);
        return self::serialiseData($nodes, $serialiseData);
    }

    /**
     * getNewNodeIds()
     *
     * @param string $type
     *
     * @return array|int
     */

    public function getNewNodeIds(string $type)
    {
        $query = \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('changed', $this->todaysDate['start'], '>')
            ->condition('changed', $this->todaysDate['end'], '<');
        switch ($type) {
            case 'moj_video_item':
                $query->condition('type', 'moj_video_item', '=')
                    ->sort('field_moj_categories', 'DESC');
                break;
            case 'moj_pdf_item':
                $query->condition('type', 'moj_pdf_item', '=');
                break;
            case 'moj_radio_item':
                $query->condition('type', 'moj_radio_item', '=');
                break;
        }
        $query->sort('changed', 'DESC');
        return $query->execute();
    }

    /**
     * loadNodes()
     *
     * @param $nids
     *
     * @return array
     */

    protected static function loadNodes(array $nids)
    {
        $node_storage = \Drupal::entityTypeManager()->getStorage('node');    // TODO: Inject dependency
        $items = array_filter(
            $node_storage->loadMultiple($nids), function ($item) {
            return $item->access();
        }
        );
        return $items;
    }

    /**
     * serialisePdfData()
     *
     * @param $nodes
     *
     * @return json
     */

    protected static function serialiseData(array $nodes, string $id)
    {
        $serializer = \Drupal::service($id); // TODO: Inject dependency
        return $serializer->serialize(array_values($nodes), 'json', ['plugin_id' => 'entity']);
    }

    /**
     * cheackIfEmpty()
     *
     * @param array $data
     * @return bool
     */

    protected static function cheackIfEmpty(array $data)
    {
        if (empty($data)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * groupVideos()
     *
     * @param array $data
     *
     * @return array
     */

    protected static function groupVideos(array $data)
    {
        $result = array();
        foreach ($data as $item) {
            $channel_name = $item['channel_name'];
            if (isset($result[$channel_name])) {
                $result[$channel_name][] = $item;
            } else {
                $result[$channel_name] = array($item);
            }
        }
        return $result;
    }


}