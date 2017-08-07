<?php
/**
 * @file
 * Contains \Drupal\moj_search\Normalizer\PdfNormalizer.
 */

namespace Drupal\moj_search\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;


/**
 * Normalizer for the Video container entity type.
 */
class ResultsNormalizer extends NormalizerBase
{
    protected $supportedInterfaceOrClass = Node;

    /**
     * Normalizes an object into a set of arrays/scalars.
     *
     * @param \Drupal\moj_search $entity
     *   Object to normalize.
     * @param string $format
     *   Format the normalization result will be encoded as.
     * @param array $context
     *   Context options for the normalizer.
     *
     * @return array
     *   The normalized data.
     */

    public function normalize($entity, $format = null, array $context = [])
    {
        $ResultsLinksService = \Drupal::service('service_search.results_links_service'); // TODO: Inject dependency or rethink how this is done

        return [
          'title' => $entity->getTitle(),
          'link' => $ResultsLinksService->generatelinks($entity)
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
