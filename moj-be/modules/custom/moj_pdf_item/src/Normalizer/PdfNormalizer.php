<?php

/**
 * @file
 * Contains \Drupal\moj_pdf_item\Normalizer\PdfNormalizer.
 */

namespace Drupal\moj_pdf_item\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;

/**
 * Normalizer for the Video container entity type.
 */
class PdfNormalizer extends NormalizerBase
{

    protected $supportedInterfaceOrClass = Node;

    /**
     * Normalizes an object into a set of arrays/scalars.
     *
     * @param \Drupal\moj_pdf_item $entity
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
        $ResultsLinksService = \Drupal::service('service_search.results_links_service'); // TODO: Inject dependency or rethink how this is done

        return [
            "title" => $entity->getTitle(),
            "nid" => $entity->nid->value,
            "description" => $entity->description->value,
            "pdf_url" => $ResultsLinksService->generatelinks($entity),
            "thumbnail" => !empty($entity->field_moj_thumbnail_image->entity) ? file_create_url($entity->field_moj_thumbnail_image->entity->getFileUri()) : "",
            "additional_description" => $entity->field_moj_pdf_additional_desc->value
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
