<?php

namespace BackupMigrate\Drupal\Destination;

use BackupMigrate\Core\Destination\ReadableDestinationInterface;
use BackupMigrate\Core\File\BackupFileInterface;
use BackupMigrate\Core\File\ReadableStreamBackupFile;
use BackupMigrate\Core\Plugin\PluginBase;

/**
 * Class BrowserUploadDestination.
 *
 * @package BackupMigrate\Core\Destination
 */
class DrupalBrowserUploadDestination extends PluginBase implements ReadableDestinationInterface {

  /**
   * {@inheritdoc}
   */
  public function getFile($id) {
    $file_upload = \Drupal::request()->files->get("files", NULL, TRUE)[$id];
    // Make sure there's an upload to process.
    if (!empty($file_upload)) {
      $out = new ReadableStreamBackupFile($file_upload->getRealPath());
      $out->setFullName($file_upload->getClientOriginalName());
      return $out;
    }
  }

  /**
   * Load the metadata for the given file however it may be stored.
   *
   * @param \BackupMigrate\Core\File\BackupFileInterface $file
   *
   * @return \BackupMigrate\Core\File\BackupFileInterface
   */
  public function loadFileMetadata(BackupFileInterface $file) {
    return $file;
  }

  /**
   * Load the file with the given ID from the destination.
   *
   * @param \BackupMigrate\Core\File\BackupFileInterface $file
   *
   * @return \BackupMigrate\Core\File\BackupFileReadableInterface The file if it exists or NULL if it doesn't
   */
  public function loadFileForReading(BackupFileInterface $file) {
    return $file;
  }


  /**
   * Does the file with the given id (filename) exist in this destination.
   *
   * @param string $id The id (usually the filename) of the file.
   *
   * @return bool True if the file exists, false if it does not.
   */
  public function fileExists($id) {
    return (boolean) \Drupal::request()->files->has("files[$id]");
  }

}
