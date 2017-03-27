<?php
/**
 * @file
 * Contains ${NAMESPACE}\DrupalBrowserDownloadDestination
 */

namespace BackupMigrate\Drupal\Destination;

use \BackupMigrate\Core\Destination\BrowserDownloadDestination;
use BackupMigrate\Core\File\BackupFileReadableInterface;

/**
 * Class DrupalBrowserDownloadDestination
 * @package BackupMigrate\Drupal\Destination
 */
class DrupalBrowserDownloadDestination extends BrowserDownloadDestination {

  /**
   * {@inheritdoc}
   */
  function saveFile(BackupFileReadableInterface $file) {
    // @TODO: Replace the header/print calls with a Symfony response (if that allows streaming).
    // Need to find some way to return new BinaryFileResponse($uri, 200, $headers); all the way
    // out to the output of the caller.
    // Probably need to provide the response as a service in the environment.
    parent::saveFile($file);

    // @TODO: Get rid of this ugliness:
    exit();
  }
}