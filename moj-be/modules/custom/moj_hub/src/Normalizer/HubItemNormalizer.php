<?php

/**
 * @file
 * Contains \Drupal\moj_hub\Normalizer\HubItemNormalizer.
 */

namespace Drupal\moj_hub\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;

/**
 * Normalizer for the Video container entity type.
 */
class HubItemNormalizer extends NormalizerBase {
	protected $supportedInterfaceOrClass = Node;

	/**
	 * Normalizes an object into a set of arrays/scalars.
	 *
	 * @param \Drupal\node\NodeInterface $entity
	 *   Object to normalize.
	 * @param string $format
	 *   Format the normalization result will be encoded as.
	 * @param array $context
	 *   Context options for the normalizer.
	 *
	 * @return array
	 *   The normalized data.
	 */
	public function normalize($entity, $format = NULL, array $context = array()) {
		$thumbnail_image = '';
		if (!empty($entity->field_moj_hub_thumbnail->entity)) {
			$thumbnail_image = file_create_url($entity->field_moj_hub_thumbnail->entity->getFileUri());
		}

		$parent = $entity->get('field_moj_hub_parent')->getValue();

		return [
			"nid" => $entity->nid->value,
			"title" => $entity->getTitle(),
			"thumbnail" => $thumbnail_image,
			"url" => $entity->field_moj_hub_link->value,
			"parent" => $parent ? $parent : NULL,
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function supportsNormalization($data, $format = null) {
		return $data instanceof Node;
	}

}
