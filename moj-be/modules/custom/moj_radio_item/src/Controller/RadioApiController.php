<?php

namespace Drupal\moj_radio_item\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\image\Entity\ImageStyle;

class RadioApiController extends ControllerBase implements ContainerInjectionInterface {

    /**
     * The entity storage for taxonomy terms.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $termStorage;

    /**
     * The custom serializer for radio nodes.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $serializer;

    /**
     * The custom serializer for radio nodes.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $termSerializer;

    /**
     * Constructs a ViewAjaxController object.
     * @param \Symfony\Component\Serializer\Serializer $serializer
     *   The custom serializer for radio nodes.
     */
    public function __construct(EntityStorageInterface $storage, Serializer $serializer, Serializer $termSerializer) {
        $this->termStorage = $storage;
        $this->serializer = $serializer;
        $this->termSerializer = $termSerializer;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container) {
        return new static(
                $container->get('entity.manager')->getStorage('taxonomy_term'), $container->get('moj_radio_item.serializer.default'), $container->get('moj_radio_item.term.serializer.default')
        );
    }

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
        $lang = RadioApiController::getCurrentLanguage();
        $langcode = $lang->getId();

        if ($node->hasTranslation($langcode)) {
            return $node->getTranslation($langcode);
        } else {
            return $node;
        }
    }

    /**
     * {@inheritdoc}
     */
    protected static function translateTerm($term) {
        $lang = RadioApiController::getCurrentLanguage();
        $langcode = $lang->getId();

        if ($term->hasTranslation($langcode)) {
            return $term->getTranslation($langcode);
        } else {
            return $term;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function landingPage() {
        $terms = $this->termStorage->loadTree('moj_radio_categories', 0, 1, TRUE);

        foreach ($terms as &$term) {
            $term = RadioApiController::translateTerm($term);

            $nids = \Drupal::entityQuery('node')
                    ->condition('status', 1)
                    ->condition('type', 'moj_radio_item', '=')
                    ->condition('field_moj_categories', $term->tid->value, '=')
                    ->sort('created', 'DESC')
                    ->range(0, 1)
                    ->execute();

            $term->first_episode = array_shift($nids);
        }

        $terms = array_filter($terms, function ($term) {
            return !empty($term->first_episode);
        });

        $data = $this->termSerializer->serialize($terms, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

    /**
     * {@inheritdoc}
     */
    public function show($nid) {
        $radioShow['episode'] = Node::load($nid);

        if ($radioShow['episode'] == NULL || $radioShow['episode']->status->value == 0) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no radio show with this ID.'
                    ], 404);
        }

        if (!$radioShow['episode']->access('view')) {
            return new JsonResponse([
                'error' => true,
                'message' => 'You do not have permission to access this radio show.'
                    ], 403);
        }

        $terms = $this->termStorage->loadTree('moj_radio_categories', 0, 1, TRUE);

        foreach ($terms as $term) {
            if ($term->tid->value == $radioShow['episode']->field_moj_categories->target_id) {

                //Translate the term				
                $term = RadioApiController::translateTerm($term);

                $radioShow['parent'] = array(
                    "channel_name" => $term->getName(),
                    "channel_description" => $term->getDescription(),
                    "channel_banner" => !empty($term->field_radio_category_banner->entity) ? ImageStyle::load('moj_radio_category_banner')->buildUrl($term->field_radio_category_banner->entity->getFileUri()) : ""
                );
            }
        }

        $data = $this->serializer->serialize($radioShow, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

    /**
     * {@inheritdoc}
     */
    public function channelRadioShows($nid) {
        $radioShow = Node::load($nid);

        if ($radioShow == NULL) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no radio show with this ID.'
                    ], 404);
        }

        $terms = $this->termStorage->loadTree('moj_radio_categories');

        foreach ($terms as $term) {
            if ($term->tid == $radioShow->field_moj_categories->target_id) {
                $term_name = $term->name;
            }
        }

        $radio_ids = \Drupal::entityQuery('node')
                ->condition('field_moj_categories.entity.name', $term_name)
                ->sort('created', 'DESC')
                ->execute();

        $radioShows = Node::loadMultiple($radio_ids);

        $radioShows = array_map(function ($v) {
            return RadioApiController::translateNode($v);
        }, $radioShows);

        $data = $this->serializer->serialize(array_values($radioShows), 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

}
