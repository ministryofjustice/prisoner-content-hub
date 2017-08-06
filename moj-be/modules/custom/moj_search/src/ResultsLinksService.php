<?php

namespace Drupal\moj_search;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityManagerInterface;

class ResultsLinksService extends ControllerBase
{
    protected $node_storage;

    protected $entityManager;

    /**
     * ResultsLinksService constructor.
     *
     * @param \Drupal\Core\Entity\EntityManagerInterface $entityManager
     */

    public function __construct()
    {
        $this->entityManager = $ResultsLinksService = \Drupal::service('entity.manager'); // TODO: Inject dependency
        $this->node_storage = $this->entityManager->getStorage('node');
    }

    public function generatelinks(string $type, int $nid)
    {
        switch ($type) {
            case 'moj_video_item':
                return '/video/'.$nid;
                break;
            case 'moj_radio_item':
                return '/radio/'.$nid;
                break;
            case 'moj_pdf_item':
                return $this->generatepdflink($nid);
                break;
        }
    }

    private function generatepdflink(int $nid)
    {
        $node = $this->node_storage->load($nid);
        $mineType = $node->get('field_moj_pdf')->entity->getMimeType();
        $filePath = file_create_url($node->get('field_moj_pdf')->entity->getFileUri());
        return $this->checkFileIsPdfOrEpub($mineType, $filePath);
    }

    private function checkFileIsPdfOrEpub($mineType, $filePath)
    {
        if ($mineType == 'application/pdf') {
            return $filePath;
        }
        if ($mineType == "application/epub+zip") {
            return '/epub?pdf='.$filePath;
        }
        return $filePath;
    }
}