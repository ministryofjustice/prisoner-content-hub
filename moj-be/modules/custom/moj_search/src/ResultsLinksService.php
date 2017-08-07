<?php

namespace Drupal\moj_search;

use Drupal\Core\Controller\ControllerBase;
class ResultsLinksService extends ControllerBase
{

    protected $node_storage;

    protected $entityManager;

    protected $entity;

    /**
     * ResultsLinksService constructor.
     *
     * @param \Drupal\Core\Entity\EntityManagerInterface $entityManager
     */

    public function __construct()
    {
        $this->entityManager = $ResultsLinksService = \Drupal::service(
          'entity.manager'
        ); // TODO: Inject dependency
        $this->node_storage = $this->entityManager->getStorage('node');
    }

    /**
     * @param string $type
     * @param int $nid
     *
     * @return string
     */

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

    /**
     * @param int $nid
     *
     * @return string
     */

    private function generatepdflink(int $nid)
    {
        $node = $this->node_storage->load($nid);
        $this->entity = [
          'mineType' => $node->get('field_moj_pdf')->entity->getMimeType(),
          'filePath' => file_create_url(
            $node->get('field_moj_pdf')->entity->getFileUri()
          ),
        ];
        return $this->checkFileIsPdfOrEpub();
    }

    private function checkFileIsPdfOrEpub()
    {
        return $this->entity['mineType'] == 'application/epub+zip' ? '/epub?pdf='.$this->entity['filePath'] : $this->entity['filePath'];
    }
}