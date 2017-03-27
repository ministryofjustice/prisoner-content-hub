<?php
/**
 * @file
 */

namespace Drupal\backup_migrate\Controller;


use BackupMigrate\Core\Destination\DestinationInterface;
use BackupMigrate\Core\Destination\ListableDestinationInterface;
use BackupMigrate\Drupal\Destination\DrupalBrowserDownloadDestination;
use Drupal\backup_migrate\Entity\Destination;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;

/**
 * Class BackupController
 * @package Drupal\backup_migrate\Controller
 */
class BackupController extends ControllerBase {

  /**
   * @var DestinationInterface
   */
  var $destination;


  public function listAll() {
    $bam = backup_migrate_get_service_object();

    $out = [];
    foreach ($bam->destinations()->getAllByOp('listFiles') as $id => $destination) {
      $out[$id] = [
        'title' => ['#markup' => '<h2>Backups in ' . $destination->confGet('name') . '</h2>'],
        'list' => $this::listDestinationBackups($destination, $id),
      ];
    }
    return $out;
  }


  /**
   * Get the title for the listing page of a destination entity.
   *
   * @param \Drupal\backup_migrate\Entity\Destination $backup_migrate_destination
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup
   */
  public function listDestinationEntityBackupsTitle(Destination $backup_migrate_destination) {
    return $this->t('Backups in @destination_name', ['@destination_name' => $backup_migrate_destination->label()]);
  }

  /**
   * List the backups in the given destination.
   *
   * @param \Drupal\backup_migrate\Entity\Destination $backup_migrate_destination
   * @return mixed
   */
  public function listDestinationEntityBackups(Destination $backup_migrate_destination) {
    $destination = $backup_migrate_destination->getObject();
    return $this->listDestinationBackups($destination, $backup_migrate_destination->id());
  }

  /**
   * List the backups in the given destination.
   *
   * @param \BackupMigrate\Core\Destination\ListableDestinationInterface $destination
   * @return mixed
   */
  public function listDestinationBackups(ListableDestinationInterface $destination, $backup_migrate_destination_id) {
    $backups = $destination->listFiles();

    $rows = [];
    $header = array(
      array(
        'data' => $this->t('Name'),
        'class' => array(RESPONSIVE_PRIORITY_MEDIUM)),
      array(
        'data' => $this->t('Date'),
        'class' => array(RESPONSIVE_PRIORITY_MEDIUM)),
      array(
        'data' => $this->t('Size'),
        'class' => array(RESPONSIVE_PRIORITY_MEDIUM)),
      array(
        'data' => $this->t('Operations'),
        'class' => array(RESPONSIVE_PRIORITY_LOW)),
    );

    foreach ($backups as $backup_id => $backup) {
      $rows[] = [
        'data' => [
          // Cells.
          $backup->getFullName(),
          \Drupal::service('date.formatter')->format($backup->getMeta('datestamp')),
          format_size($backup->getMeta('filesize')),
          [
            'data' => [
              '#type' => 'operations',
              '#links' => [
                'restore' => [
                  'title' => $this->t('Restore'),
                  'url' => Url::fromRoute(
                    'entity.backup_migrate_destination.backup_restore',
                    [
                      'backup_migrate_destination' => $backup_migrate_destination_id,
                      'backup_id' => $backup_id
                    ]
                  )
                ],
                'download' => [
                  'title' => $this->t('Download'),
                  'url' => Url::fromRoute(
                    'entity.backup_migrate_destination.backup_download',
                    [
                      'backup_migrate_destination' => $backup_migrate_destination_id,
                      'backup_id' => $backup_id
                    ]
                  )
                ],
                'delete' => [
                  'title' => $this->t('Delete'),
                  'url' => Url::fromRoute(
                    'entity.backup_migrate_destination.backup_delete',
                    [
                      'backup_migrate_destination' => $backup_migrate_destination_id,
                      'backup_id' => $backup_id
                    ]
                  )
                ],
              ]
            ]
          ],
        ],
      ];
    }

    $build['backups_table'] = array(
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('There are no backups in this destination.'),
    );

    return $build;
  }

  /**
   * Download a backup via the browser.
   *
   * @param \Drupal\backup_migrate\Entity\Destination $backup_migrate_destination
   * @param $backup_id
   */
  public function download(Destination $backup_migrate_destination, $backup_id) {
    $destination = $backup_migrate_destination->getObject();
    $file = $destination->getFile($backup_id);
    $file = $destination->loadFileForReading($file);

    $browser = new DrupalBrowserDownloadDestination();
    $browser->saveFile($file);
  }


}

