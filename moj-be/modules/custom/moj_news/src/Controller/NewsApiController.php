<?php

namespace Drupal\moj_news\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Language\LanguageInterface;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class NewsApiController extends ControllerBase {

    public function landingPage()
    {
        $nids = \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('type', 'moj_news_item', '=')
            ->sort('sticky', 'DESC')
            ->sort('created', 'DESC')
            ->execute();

        $news_items = Node::loadMultiple($nids);

        $news = [];
        foreach ($nids as $nid) {
            array_push($news, $news_items[$nid]);
        }

        $serializer = \Drupal::service('moj_news.serializer.default');
        $data = $serializer->serialize($news, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }
}
