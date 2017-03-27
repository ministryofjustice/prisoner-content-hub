<?php

namespace Drupal\moj_lang_welsh\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Libraries\Rollbar\Rollbar;

// Need these to create nodes
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;



/**
 * Controller routines for page example routes.
 */
class WelshTranslationsController extends ControllerBase {

  public function devPage()
  {
  //  $this->init();

    // Rollbar::init(array('access_token' => '75594e35daa94aa5b11e665e0a69fa27'));
    // Rollbar::report_message('testing 123', 'info');

    $build = array(
      '#markup' => $this->t('<p>MOJ Welsh Language Translations</p>')
    );
    return $build;
  }

  public function init()
  {
    if($this->getSettings()->get('deployed'))
    {
      $this->getSettings()->set('deployed', FALSE)->save();
      $data = $this->loadJson($this->getPath() . '/translations/cy.json');
      $nids = $this->collateNids($data);
      $nodes = $this->loadNodes($nids);
      $this->addTranslations($nodes, $data);
      drupal_set_message(t('Welsh translations complete'), 'status', TRUE);
    } else {
      drupal_set_message(t('The welsh translations have already been deployed.'), 'status', TRUE);
    }
  }

  private function getSettings()
  {
    $settings = \Drupal::service('config.factory')->getEditable('moj_lang_welsh.settings');
    return $settings;
  }

  private function getPath()
  {
    $path = drupal_get_path('module', 'moj_lang_welsh');
    return $path;
  }

  public function loadJson($path)
  {
    $file = file_get_contents($path);
    return json_decode($file, true);
  }

  public function collateNids($data = array())
  {
    $nids = array();
    if(is_array($data))
    {
      foreach ($data as $item) {
        $nids[] = $item['id'];
      }
      return $nids;
    } else {
      \Drupal::logger('moj_lang_welsh')->error('collateNids must be passed an array');
      return FALSE;
    }
  }

  public function loadNodes($nids)
  {
    if(is_array($nids))
    {
      $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple($nids);
      return $nodes;
    } else {
      \Drupal::logger('moj_lang_welsh')->error('loadNodes must be passed an array');
      return FALSE;
    }
  }

  public function addTranslations($nodes, $translations)
  {
    if(is_array($nodes))
    {
      foreach($nodes as $node)
      {
        $translation = $translations[$node->id()];
        $file = $this->addFile('/assets/' . $translation['img'], 'public://' . $translation['img']);
        $node_cy = $node->addTranslation('cy');
        $node_cy->title = $translation['title'];
        $node_cy->set("field_moj_hub_link", $translation['link']);
        $node_cy->save();
        $node_cy->field_moj_hub_thumbnail = array(
          'target_id' => $file->id(),
          'alt' => $translation['title'],
          'title' => $translation['title'],
        );
        $node_cy->save();
      }
    } else {
      \Drupal::logger('moj_lang_welsh')->error('addTranslations must be passed an array');
      return FALSE;
    }
  }

  public function addFile($path, $public)
  {
   $host = \Drupal::request()->getHost();
   $filePath = drupal_get_path('module', 'moj_lang_welsh') . $path;
   $file_content = file_get_contents($filePath);
   $file = file_save_data($file_content, $public, FILE_EXISTS_REPLACE);
   return $file;
  }
}
