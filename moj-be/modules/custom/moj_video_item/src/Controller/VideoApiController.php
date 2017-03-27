<?php

namespace Drupal\moj_video_item\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Serializer;
use Drupal\image\Entity\ImageStyle;

class VideoApiController extends ControllerBase implements ContainerInjectionInterface {

    /**
     * The entity storage for taxonomy terms.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $termStorage;

    /**
     * The custom serializer for video nodes.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $serializer;

    /**
     * Constructs a ViewAjaxController object.
     *
     * @param \Drupal\Core\Entity\EntityStorageInterface $storage
     *   The entity storage for taxonomy terms.
     * @param \Symfony\Component\Serializer\Serializer $serializer
     *   The custom serializer for video nodes.
     */
    public function __construct(EntityStorageInterface $storage, Serializer $serializer) {
        $this->serializer = $serializer;
        $this->termStorage = $storage;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container) {
        return new static(
                $container->get('entity.manager')->getStorage('taxonomy_term'), $container->get('moj_video_item.serializer.default')
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
        $lang = VideoApiController::getCurrentLanguage();
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
        $lang = VideoApiController::getCurrentLanguage();
        $langcode = $lang->getId();

        if ($term->hasTranslation($langcode)) {
            return $term->getTranslation($langcode);
        } else {
            return $term;
        }
    }

    public function showVideo($nid) {
        $video = Node::load($nid);

        //Check valid video nid
        //Check video is published
        if ($video == NULL || $video->status->value == 0) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no video with this ID.'
                    ], 404);
        }

        //Load all moj video category terms
        $terms = $this->termStorage->loadTree('moj_video_categories');

        //Find the term that this node belongs to
        foreach ($terms as $term) {
            if ($term->tid == $video->field_moj_categories->target_id) {
                //Find parent of term that this node belongs to
                $term_id = $term->parents;
            }
        }

        //Load the parent that this term belongs to
        $parent = $this->termStorage->load(array_shift($term_id));

        //Add parent term values to array
        $video_data['channel_data'] = array(
            "channel_name" => $parent->label(),
            "channel_landing_page" => $parent->field_landing_page_exists->value,
            "channel_id" => $parent->id()
        );

        //Translate video
        $video = VideoApiController::translateNode($video);

        //Add video entity to array
        $video_data['video_data'] = $video;

        //Add required video entity fields to array and serialize
        $data = $this->serializer->serialize($video_data, 'json', ['plugin_id' => 'entity']);

        //Return serialized data as json object
        return new JsonResponse(json_decode($data));
    }

    public function landingPage() {
        $terms = $this->termStorage->loadTree('moj_video_categories');

        $channels = array();
        foreach ($terms as $term) {
            if ($term->parents[0] == 0) {
                $channels[$term->tid] = [
                    'tid' => $term->tid,
                    'channel' => $term->name,
                    'landing_page' => $this->termStorage->load($term->tid)->get('field_landing_page_exists')->value
                ];
            } else {
                $channels[$term->parents[0]]['programmes'][$term->tid] = [
                    'tid' => $term->tid,
                    'title' => $term->name
                ];
            }
        }

        foreach ($channels as $c => $channel) {
            $channel_id = $channel['tid'];

            $programmes = array();

            foreach ($channel['programmes'] as $p => $programme) {
                $video_ids = \Drupal::entityQuery('node')
                        ->condition('field_moj_categories.entity.name', $programme['title'])
                        ->condition('status', 1)
                        ->sort('created', 'ASC')
                        ->range(0, 1)
                        ->execute();

                $id = array_shift($video_ids);

                if ($id) {
                    $video = Node::load($id);

                    $video = VideoApiController::translateNode($video);

                    $thumbnail = $video->get('field_moj_thumbnail_image')->getValue();

                    $thumbnail_url = NULL;
                    if (count($thumbnail) > 0) {
                        $thumbnail_id = $thumbnail[0]['target_id'];
                        $thumbnail_file = File::load($thumbnail_id);

                        $thumbnail_url = ImageStyle::load('moj_landing_page_thumb')->buildUrl($thumbnail_file->getFileUri());
                    }

                    $programmes[$programme['tid']] = [
                        'tid' => $programme['tid'],
                        'title' => $programme['title'],
                        'episodes' => [
                            'nid' => $video->id(),
                            'title' => $video->label(),
                            'description' => $video->get('field_moj_description')->getValue(),
                            'category' => [
                                'id' => $programme['tid'],
                                'title' => $programme['title']
                            ],
                            'thumbnail' => $thumbnail_url,
                        ]
                    ];
                }
            }
            $channels[$channel_id]['programmes'] = array_values($programmes);


            //If a channel has programmes with no, episodes remove it.
            foreach ($channels as $cid => $channel) {

                if (count($channel['programmes']) == 0) {
                    unset($channels[$cid]);
                }
            }
        }

        return new JsonResponse(array_values($channels));
    }

    public function getRecentVideos() {
        $nids = \Drupal::entityQuery('node')
                ->condition('status', 1)
                ->condition('type', 'moj_video_item', '=')
                ->range(0, 4)
                ->execute();

        $videos = Node::loadMultiple($nids);
        $videos = array_map(function ($v) {
            return VideoApiController::translateNode($v);
        }, $videos);

        $data = $this->serializer->serialize($videos, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

    public function episodesList($nid) {
        $video = Node::load($nid);

        if ($video == NULL) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no video with this ID.'
                    ], 404);
        }

        if (!$video->access('view')) {
            return new JsonResponse([
                'error' => true,
                'message' => 'You do not have permission to view this video.'
                    ], 403);
        }

        $terms = $this->termStorage->loadTree('moj_video_categories');

        foreach ($terms as $term) {
            if ($term->tid == $video->field_moj_categories->target_id) {
                $term_name = $term->name;
            }
        }

        $video_ids = \Drupal::entityQuery('node')
                ->condition('field_moj_categories.entity.name', $term_name)
                ->sort('created', 'ASC')
                ->execute();

        $videos = Node::loadMultiple($video_ids);
        $videos = array_map(function ($v) {
            return VideoApiController::translateNode($v);
        }, $videos);

        $data = $this->serializer->serialize(array_values($videos), 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

    public function channelLandingPage($tid) {
        $terms = $this->termStorage->loadTree('moj_video_categories', 0, NULL, TRUE);

        $channel = array();

        //If invalid term return 404
        if ($this->termStorage->load($tid) == NULL) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no video channel with this ID.'
                    ], 404);
        }

        //If landing page exists is false return 404
        if ($this->termStorage->load($tid)->get('field_landing_page_exists')->value == false) {
            return new JsonResponse([
                'error' => true,
                'message' => 'There is no landing page for this channel.'
                    ], 404);
        }

        foreach ($terms as $term) {

            //If the term is not a parent term return 404
            if ($term->tid == $tid && $term->parents[0] != 0) {
                return new JsonResponse([
                    'error' => true,
                    'message' => 'There is no video channel with this ID.'
                        ], 404);
            }

            if ($term->tid->value == $tid) {

                $term = VideoApiController::translateTerm($term);

                if ($term->field_channel_landing_page_video->entity != null) {
                    $video_url = file_create_url($term->field_channel_landing_page_video->entity->getFileUri());
                } else {
                    $video_url = "";
                }

                if ($term->field_video_channel_thumbnail->entity != null) {
                    $thumbnail_url = ImageStyle::load('moj_landing_page_thumb')->buildUrl($term->field_video_channel_thumbnail->entity->getFileUri());
                } else {
                    $thumbnail_url = "";
                }

                $channel = [
                    "title" => $term->label(),
                    "description" => $term->description->value,
                    "info" => $term->field_info->value,
                    "video_url" => $video_url,
                    "thumbnail_url" => $thumbnail_url,
                    "left_tab_label" => !empty($term->field_moj_left_tab_text->value) ? $term->field_moj_left_tab_text->value : "",
                    "right_tab_label" => !empty($term->field_moj_right_tab_text->value) ? $term->field_moj_right_tab_text->value : "",
                    "programmes" => null
                ];
            }

            //Load the first video in to an array for each of the term's children
            if ($term->parents[0] == $tid) {

                $video_ids = \Drupal::entityQuery('node')
                        ->condition('field_moj_categories.entity.name', $term->name->value)
                        ->condition('status', 1)
                        ->sort('created', 'ASC')
                        ->range(0, 1)
                        ->execute();

                $id = array_shift($video_ids);

                if ($id) {
                    $video = Node::load($id);

                    $video = VideoApiController::translateNode($video);

                    $thumbnail = $video->get('field_moj_thumbnail_image')->getValue();

                    $thumbnail_url = NULL;
                    if (count($thumbnail) > 0) {
                        $thumbnail_id = $thumbnail[0]['target_id'];
                        $thumbnail_file = File::load($thumbnail_id);

                        $thumbnail_url = ImageStyle::load('moj_landing_page_thumb')->buildUrl($thumbnail_file->getFileUri());
                    }

                    $channel[programmes][$term->tid->value] = [
                        'tid' => $term->tid->value,
                        'title' => $term->label(),
                        'episodes' => [
                            'nid' => $video->id(),
                            'title' => $video->label(),
                            'thumbnail' => $thumbnail_url,
                        ]
                    ];
                }
            }
        }

        return new JsonResponse($channel);
    }

}
