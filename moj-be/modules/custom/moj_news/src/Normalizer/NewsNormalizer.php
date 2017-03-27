<?php

/**
 * @file
 * Contains \Drupal\moj_news_item\Normalizer\NewsNormalizer.
 */

namespace Drupal\moj_news\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;

/**
 * Normalizer for the News container entity type.
 */
class NewsNormalizer extends NormalizerBase
{

    protected $supportedInterfaceOrClass = Node;

    /**
     * Normalizes an object into a set of arrays/scalars.
     *
     * @param \Drupal\moj_news_item $entity
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
        return [
            "title" => $entity->getTitle(),
            "nid" => $entity->nid->value,
            "description" => $entity->body->value,
            "date" => $entity->getCreatedTime(),
            "sticky" => $entity->isSticky()
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
