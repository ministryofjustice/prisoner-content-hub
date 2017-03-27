<?php

namespace Drupal\moj_hub\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;

class HubApiController extends ControllerBase {

    /**
     * Gets the language of the current request.
     * @return
     *   The language of the current request.
     */
    protected static function getCurrentLanguage() {
        return \Drupal::languageManager()->getCurrentLanguage(LanguageInterface::TYPE_CONTENT);
    }

    /**
     * Translates the given node into the current language of the request.
     * @param \Drupal\node\NodeInterface $node
     *   The node to translate.
     *
     * @return
     *   The node translated into the language of the current request.
     */
    protected static function translateNode(NodeInterface $node) {
        $lang = self::getCurrentLanguage();
        $langcode = $lang->getId();

        if ($node->hasTranslation($langcode)) {
            return $node->getTranslation($langcode);
        } else {
            return $node;
        }
    }

    protected static function makeJsonError($code, $message) {
        return new JsonResponse([
            'error' => true,
            'message' => $message,
                ], $code);
    }

    protected static function getChildNodeIds(NodeInterface $parent = NULL) {
        $query = \Drupal::entityQuery('node')
                ->condition('status', 1)
                ->condition('type', 'moj_hub_item', '=')
                ->sort('field_moj_weight')
                ->sort('nid');

        if (!$parent) {
            $query = $query->notExists('field_moj_hub_parent');
        } else {
            $query = $query->condition('field_moj_hub_parent', $parent->id(), '=');
        }

        return $query->execute();
    }

    protected static function getPageData(NodeInterface $parent = NULL) {
        $page_data = [
            'id' => NULL,
            'title' => 'Digital Hub',
            'icon' => NULL
        ];

        if ($parent) {
            $page_data['parent'] = ['id' => NULL, 'title' => 'Digital Hub'];
            $page_data['title'] = $parent->getTitle();
            $page_data['id'] = $parent->id();
            if (!empty($parent->field_moj_hub_thumbnail->entity)) {
                $page_data['icon'] = file_create_url($parent->field_moj_hub_thumbnail->entity->getFileUri());
            }
            if (!empty($parent->field_moj_hub_parent->entity)) {
                $page_data['parent'] = [
                    'id' => $parent->field_moj_hub_parent->entity->id(),
                    'title' => self::translateNode($parent->field_moj_hub_parent->entity)->getTitle()
                ];
            }
        }

        return $page_data;
    }

    public function getHubLinks(NodeInterface $parent = NULL) {
        if ($parent && $parent->getType() !== 'moj_hub_item') {
            return self::makeJsonError(404, 'Not found');
        }

        $nids = self::getChildNodeIds($parent);

        $node_storage = \Drupal::entityManager()->getStorage('node');    // TODO: Inject dependency
        $serializer = \Drupal::service('moj_hub_item.serializer.default'); // TODO: Inject dependency

        $hub_items = array_filter(
                $node_storage->loadMultiple($nids), function($item) {
            return $item->access();
        }
        );

        $hub_items = array_map(function ($i) {
            return self::translateNode($i);
        }, $hub_items);

        $data = $serializer->serialize(array_values($hub_items), 'json', ['plugin_id' => 'entity']);

        $page_data = self::getPageData($parent);
        $page_data['links'] = json_decode($data);

        return new JsonResponse($page_data);
    }

}
