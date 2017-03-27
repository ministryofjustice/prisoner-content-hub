<?php

/**
 * Implements hook_drush_command().
 */
function moj_drush_command() {
  $items = array();

  $items['moj-create-content'] = array(
    'description' => 'Creates placeholder content for testing environments.',
    'aliases' => array('mcc'),
  );

  return $items;
}

/**
 * Callback for the moj-create-content command.
 */
function drush_moj_create_content() {
  moj_create_placeholder_content();
}
