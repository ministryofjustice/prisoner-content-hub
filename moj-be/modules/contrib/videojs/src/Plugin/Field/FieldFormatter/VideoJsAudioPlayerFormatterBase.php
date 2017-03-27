<?php

/**
 * @file
 * Contains \Drupal\videojs\Plugin\Field\FieldFormatter\VideJsAudioPlayerFormatterBase.
 */

namespace Drupal\videojs\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\field\FieldConfigInterface;
use Drupal\file\Plugin\Field\FieldFormatter\FileFormatterBase;

/**
 * Base class for video player file formatters.
 */
abstract class VideoJsAudioPlayerFormatterBase extends FileFormatterBase {

  /**
   * {@inheritdoc}
   */
  protected function getEntitiesToView(EntityReferenceFieldItemListInterface $items, $langcode) {
    return parent::getEntitiesToView($items, $langcode);
  }
}
