<?php

namespace BackupMigrate\Drupal\Source;

use BackupMigrate\Core\Config\Config;
use BackupMigrate\Core\Source\MySQLiSource;
use BackupMigrate\Core\File\BackupFileReadableInterface;

/**
 * Class DrupalMySQLiSource.
 *
 * @package BackupMigrate\Drupal\Source
 */
class DrupalMySQLiSource extends MySQLiSource {

  public function importFromFile(BackupFileReadableInterface $file) {
    $num = 0;

    if ($conn = $this->_getConnection()) {
      // Open (or rewind) the file.
      $file->openForRead();

      // Read one line at a time and run the query.
      while ($line = $this->_readSQLCommand($file)) {
        //        if (_backup_migrate_check_timeout()) {
        //          return FALSE;
        //        }
        if ($line) {
          // Execute the sql query from the file.
          $stmt = $conn->prepare($line);
          if(!$stmt) return false;
          $stmt->execute();
          $num++;
        }
      }
      // Close the file, we're done reading it.
      $file->close();
    }
    return $num;
  }

}
