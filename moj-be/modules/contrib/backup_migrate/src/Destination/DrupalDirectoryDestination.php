<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Destination\DrupalDirectoryDestination
 */


namespace BackupMigrate\Drupal\Destination;


use BackupMigrate\Core\Destination\DirectoryDestination;
use BackupMigrate\Core\Exception\BackupMigrateException;
use BackupMigrate\Core\File\BackupFileReadableInterface;
use Drupal\Core\File\FileSystem;
use Drupal\Core\StreamWrapper\PrivateStream;

/**
 * Class DrupalDirectoryDestination
 * @package BackupMigrate\Drupal\Destination
 */
class DrupalDirectoryDestination extends DirectoryDestination {

  /**
   * Do the actual file save. This function is called to save the data file AND
   * the metadata sidecar file.
   * @param \BackupMigrate\Core\File\BackupFileReadableInterface $file
   * @throws \BackupMigrate\Core\Exception\BackupMigrateException
   */
  function _saveFile(BackupFileReadableInterface $file) {
    // Check if the directory exists.
    $this->checkDirectory();

    // @TODO Decide what the appropriate file_exists strategy should be.
    file_unmanaged_move($file->realpath(), $this->confGet('directory') . $file->getFullName(), FILE_EXISTS_REPLACE);
  }


  /**
   * Check that the directory can be used for backup.
   *
   * @throws \BackupMigrate\Core\Exception\BackupMigrateException
   */
  protected function checkDirectory() {

    // @TODO: Figure out if the file is or might be accessible via the web.
    $dir = $this->confGet('directory');

    $is_private = strpos($dir, 'private://') === 0;

    // Attempt to create/prepare the directory if it is in the private directory
    if ($is_private) {
      if (!PrivateStream::basePath()) {
        throw new BackupMigrateException(
          "The backup file could not be saved to '%dir' because your private files system path has not been set.",
          ['%dir' => $dir]
        );
      }
      if (!file_prepare_directory($dir, FILE_CREATE_DIRECTORY && FILE_MODIFY_PERMISSIONS)) {
        throw new BackupMigrateException(
          "The backup file could not be saved to '%dir' because the directory could not be created or cannot be written to. Please make sure your private files directory is writable by the web server.",
          ['%dir' => $dir]
        );
      }
    }
    // Not a private directory. Make sure it is outside the web root
    else {
      // If the file is local to the server.
      $real = \Drupal::service('file_system')->realpath($dir);

      if ($real) {
        // If the file is within the docroot.
        $in_root = strpos($real, DRUPAL_ROOT) === 0;
        if ($in_root && !$is_private ) {
          throw new BackupMigrateException(
            "The backup file could not be saved to '%dir' because that directory may be publicly accessible via the web. Please save your backups to the private file directory or a directory outside of the web root.",
            ['%dir' => $dir]
          );
        }
      }
    }

    // Do the regular exists/writable checks
    parent::checkDirectory();


    // @TODO: Warn if the realpath cannot be resolved (because we cannot determine if the file is publicly accessible)
  }
}