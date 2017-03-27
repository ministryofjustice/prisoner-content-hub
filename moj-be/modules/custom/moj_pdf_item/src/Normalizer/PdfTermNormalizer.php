<?php

/**
 * @file
 * Contains \Drupal\moj_pdf_item\Normalizer\HubNormalizer.
 */

namespace Drupal\moj_pdf_item\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;
use Drupal\taxonomy\Entity\Term;

/**
 * Normalizer for the Video container entity type.
 */
class PdfTermNormalizer extends NormalizerBase
{

	protected $supportedInterfaceOrClass = Term;

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
		return [
			"tid" => $entity->tid->value,
			"name" => $entity->getName(),
			"parent" => $name,
			"cat_description" => $cat_description,
			"additional_description" => $additional_description
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
