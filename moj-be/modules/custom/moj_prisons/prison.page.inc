<?php

/**
 * @file
 * Contains prison.page.inc.
 *
 * Page callback for Prison entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Prison templates.
 *
 * Default template: prison.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_prison(array &$variables) {
  // Fetch Prison Entity Object.
  $prison = $variables['elements']['#prison'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
