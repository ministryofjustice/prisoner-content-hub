<?php

/**
 * @file
 * Contains \Drupal\moj_radio_item\Normalizer\RadioNormalizer.
 */

namespace Drupal\moj_radio_item\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\node\Entity\Node;

/**
 * Normalizer for the Radio container entity type.
 */
class RadioNormalizer extends NormalizerBase
{

	protected $supportedInterfaceOrClass = Node;

	/**
	 * Normalizes an object into a set of arrays/scalars.
	 *
	 * @param \Drupal\moj_radio_item $entity
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

		if (date('Ymd') == date('Ymd', $entity->getCreatedTime()))
		{
			$added_today = true;
		} else
		{
			$added_today = false;
		}

		return [
			"title" => $entity->getTitle(),
			"nid" => $entity->nid->value,
			"description" => $entity->field_moj_description->value,
			"duration" => $entity->field_moj_duration->value,
			"date" => $entity->getCreatedTime(),
			"radio_show_url" => file_create_url($entity->field_moj_audio->entity->getFileUri()),
			"thumbnail" => !empty($entity->field_radio_category_profile->entity) ? file_create_url($entity->field_radio_category_profile->entity->getFileUri()) : "",
			"added_today" => $added_today
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
