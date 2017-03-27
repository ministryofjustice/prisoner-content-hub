<?php

/**
 * @file
 * Contains \Drupal\moj_video_item\Normalizer\VideoNormalizer.
 */

namespace Drupal\moj_video_item\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;
use Drupal\image\Entity\ImageStyle;

/**
 * Normalizer for the Video container entity type.
 */
class VideoNormalizer extends NormalizerBase
{

    protected $supportedInterfaceOrClass = Node;

    /**
     * Normalizes an object into a set of arrays/scalars.
     *
     * @param \Drupal\moj_video_item $entity
     *   Object to normalize.
     * @param string $format
     *   Format the normalization result will be encoded as.
     * @param array $context
     *   Context options for the normalizer.
     *
     * @return array
     *   The normalized data.
     */
    public function normalize($entity, $format = NULL, array $context = array())
    {
        $tags = array();

        foreach ($entity->field_moj_tags as $tag) {
            $tags[] = array(
                "tid" => $tag->target_id,
                "name" => $tag->entity->getName()
            );
        }

        $categories = array();
        if (count($entity->field_moj_categories) > 0) {
          $categories = array(
            "tid" => $entity->field_moj_categories[0]->target_id,
            "name" => $entity->field_moj_categories[0]->entity->getName(),
            "description" => $entity->field_moj_categories[0]->entity->getDescription(),
          );
        }

        return [
            "title" => $entity->getTitle(),
            "nid" => $entity->nid->value,
            "description" => $entity->field_moj_description->value,
            "duration" => $entity->field_moj_duration->value,
            "video_url" => file_create_url($entity->field_moj_video->entity->getFileUri()),			
            "categories" => $categories,
            "tags" => $tags,
            "channel_name" => !empty($entity->field_moj_categories->entity) ? $entity->field_moj_categories->entity->getName() : "",
			"thumbnail" => !empty($entity->field_moj_thumbnail_image->entity) ? ImageStyle::load('moj_landing_page_thumb')->buildUrl($entity->field_moj_thumbnail_image->entity->getFileUri()): "",			
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null)
    {
        return $data instanceof Node;
    }

}
