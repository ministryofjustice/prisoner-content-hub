<?php

/**
 * @file
 * Contains \Drupal\moj_radio_item\Normalizer\RadioNormalizer.
 */

namespace Drupal\moj_radio_item\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\taxonomy\Entity\Term;
use Drupal\image\Entity\ImageStyle;

/**
 * Normalizer for the Radio container entity type.
 */
class RadioTermNormalizer extends NormalizerBase
{

	protected $supportedInterfaceOrClass = Term;

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
		return [
		"title" => $entity->getName(),
		"tid" => $entity->tid->value,
		"episode_nid" => $entity->first_episode,
		"description" => $entity->description->value,
		"thumbnail" => !empty($entity->field_radio_category_profile->entity) ? ImageStyle::load('moj_landing_page_thumb')->buildUrl($entity->field_radio_category_profile->entity->getFileUri()): "",
		"channel_banner" => !empty($entity->field_radio_category_banner->entity) ? ImageStyle::load('moj_radio_category_banner')->buildUrl($entity->field_radio_category_banner->entity->getFileUri()): "",
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
