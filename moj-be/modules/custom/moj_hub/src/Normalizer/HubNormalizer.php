<?php

/**
 * @file
 * Contains \Drupal\moj_hub\Normalizer\HubNormalizer.
 */

namespace Drupal\moj_hub\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\taxonomy\Entity\Term;

/**
 * Normalizer for the Video container entity type.
 */
class HubNormalizer extends NormalizerBase
{

	protected $supportedInterfaceOrClass = Term;

	/**
	 * Normalizes an object into a set of arrays/scalars.
	 *
	 * @param \Drupal\moj_hub $entity
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
		//Get parent item
		$name = "";
		if ($entity->parents[0] != 0)
		{

			$term = \Drupal::entityManager()->getStorage('taxonomy_term')->load($entity->parents[0]);
			$name = $term->label();
		}

		return [
			"tid" => $entity->tid->value,
			"name" => $entity->getName(),
			"thumbnail" => !empty($entity->field_moj_hub_thumbnail->entity) ? file_create_url($entity->field_moj_hub_thumbnail->entity->getFileUri()) : "",
			"url" => $entity->field_moj_hub_url->value,
			"folder" => boolval($entity->field_moj_hub_folder->value)
,			"parent" => $name
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function supportsNormalization($data, $format = null)
	{
		return $data instanceof Term;
	}

}
