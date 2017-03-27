<?php

namespace Drupal\moj_hub_help\Controller;

use Drupal\Core\Controller\ControllerBase;

// Need these to create nodes
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;

/**
 * Controller routines for page example routes.
 */
class MojHubHelpController extends ControllerBase {

  public function init()
  {
    $settings = \Drupal::service('config.factory')->getEditable('moj_hub_help.settings');

    if($settings->get('deployed'))
    {
      $settings->set('deployed', FALSE)->save();
      $hubHelpNid = $this->createHelpHubItem();
      $pdfNid = $this->createPdf();
      $this->createPdfHubItem($pdfNid, $hubHelpNid);
      drupal_set_message(t('Deployed content'), 'status', TRUE);
    }
  }

  public function createHelpHubItem()
  {
   $file = $this->addFile('/assets/app_help.png', 'public://app_help.png');

   $node = Node::create([
     'type'   => 'moj_hub_item',
     'title'  => 'Help',
     'field_moj_weight' => 60,
     'field_moj_hub_thumbnail' => [
       'target_id' => $file->id(),
       'alt' => 'Hub Help',
       'title' => 'Hub Help'
     ],
   ]);
    $node->save();
    $node->set("field_moj_hub_link", '/hub/' . $node->id());
    $node->save();
    drupal_set_message(t('Added Hub item: Hub Help'), 'status', TRUE);
    return $node->id();
  }

  public function createPdf()
  {
   $file = $this->addFile('/assets/wayland_prisoner_booklet_v0.6.pdf', 'public://wayland_prisoner_booklet_v0_6.pdf');
   $node = Node::create([
     'type'   => 'moj_pdf_item',
     'title'  => 'Digital Prison Help Pdf',
     'field_moj_pdf' => [
       'target_id' => $file->id(),
       'alt' => 'Wayland Prisoner Booklet v0.6',
       'title' => 'Wayland Prisoner Booklet v0.6'
     ],
   ]);
   $node->save();
   drupal_set_message(t('Added Pdf item: Wayland Prisoner Booklet'), 'status', TRUE);
   return $this->returnFileUrl($file->getFilename());
  }

  public function createPdfHubItem($pdfPath, $hubHelpNid)
  {
   $file = $this->addFile('/assets/wayland_prisoner_booklet_icon.jpg', 'public://wayland_prisoner_booklet_icon.jpg');
   $node = Node::create([
     'type'   => 'moj_hub_item',
     'title'  => 'Digital Prison Help',
     'field_moj_hub_link' => $pdfPath,
     'field_moj_hub_parent' => $hubHelpNid,
     'field_moj_hub_thumbnail' => [
       'target_id' => $file->id(),
       'alt' => 'Wayland Prisoner Booklet Hub Item',
       'title' => 'Wayland Prisoner Booklet Hub Item'
     ],
   ]);
    drupal_set_message(t('Added Hub item: Wayland Prisoner Booklet Hub'), 'status', TRUE);
    $node->save();
  }

  public function addFile($path, $public)
  {
   $host = \Drupal::request()->getHost();
   $filePath = drupal_get_path('module', 'moj_hub_help') . $path;
   $file_content = file_get_contents($filePath);
   $file = file_save_data($file_content, $public, FILE_EXISTS_REPLACE);
   return $file;
  }

  public function returnFileUrl($filename)
  {
    $file_path = '/sites/default/files/' . $filename;
    return $file_path;
  }
}
