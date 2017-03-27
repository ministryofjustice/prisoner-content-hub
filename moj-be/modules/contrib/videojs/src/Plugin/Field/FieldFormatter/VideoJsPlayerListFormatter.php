<?php

/**
 * @file
 * Contains \Drupal\videojs\Plugin\Field\FieldFormatter\VideoJsPlayerListFormatter.
 */

namespace Drupal\videojs\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Link;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Cache\Cache;
use Drupal\videojs\Plugin\Field\FieldFormatter\VideoJsPlayerFormatter;

/**
 * Plugin implementation of the 'videojs_player_list' formatter.
 *
 * @FieldFormatter(
 *   id = "videojs_player_list",
 *   label = @Translation("Video.js Player"),
 *   field_types = {
 *     "file",
 *     "video"
 *   }
 * )
 */

class VideoJsPlayerListFormatter extends VideoJsPlayerFormatter implements ContainerFactoryPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = array();
    $files = $this->getEntitiesToView($items, $langcode);

    // Early opt-out if the field is empty.
    if (empty($files)) {
      return $elements;
    }

    // Collect cache tags to be added for each item in the field.
    $video_items = array();
    foreach ($files as $delta => $file) {
      $video_uri = $file->getFileUri();
      $video_items[] = Url::fromUri(file_create_url($video_uri));
    }
    $elements[] = array(
      '#theme' => 'videojs',
      '#items' => $video_items,
      '#player_attributes' => $this->getSettings(),
      '#attached' => array(
        'library' => array('videojs/videojs'),
      ),
    );
    return $elements;
  }
  
  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    $entity_form_display = entity_get_form_display($field_definition->getTargetEntityTypeId(), $field_definition->getTargetBundle(), 'default');
    $widget = $entity_form_display->getRenderer($field_definition->getName());
    $widget_id = $widget->getBaseId();
    if($field_definition->isList()){
      return TRUE;
    }
    return FALSE;
  }
}