<?php
use BackupMigrate\Core\Plugin\FileProcessorTrait;
use BackupMigrate\Core\Plugin\PluginBase;
use BackupMigrate\Core\Service\ArchiverInterface;
use BackupMigrate\Core\Source\FileDirectorySource;
use BackupMigrate\Core\Source\SourceInterface;
use BackupMigrate\Core\Translation\TranslatableTrait;

/**
 * @file
 * Contains ${NAMESPACE}\DrupalSiteArchiveSource
 */

namespace BackupMigrate\Drupal\Source;


use BackupMigrate\Core\Config\ConfigInterface;
use BackupMigrate\Core\File\BackupFileReadableInterface;
use BackupMigrate\Core\Source\FileDirectorySource;
use BackupMigrate\Core\Source\SourceInterface;

/**
 * Class DrupalSiteArchiveSource
 * @package BackupMigrate\Drupal\Source
 */
class DrupalSiteArchiveSource extends FileDirectorySource
{

  /**
   * @var SourceInterface
   */
  protected $db_source;

  /**
   * @param ConfigInterface|array $init
   * @param \BackupMigrate\Core\Source\SourceInterface $db
   * @param \BackupMigrate\Core\Source\SourceInterface $code
   */
  public function __construct($init = array(), SourceInterface $db) {
    parent::__construct($init);

    $this->db_source = $db;
  }

  /**
   * Get a list if files to be backed up from the given directory. Do not
   * include files that match the 'exclude_filepaths' setting.
   *
   * @param string $dir The name of the directory to list.
   * @return array
   * @throws \BackupMigrate\Core\Exception\BackupMigrateException
   * @throws \BackupMigrate\Core\Exception\IgnorableException
   * @internal param $directory
   */
  protected function getFilesToBackup($dir) {
    $files = array();

    // Add the database dump.
    // @TODO: realpath contains the wrong filename and the PEAR archiver cannot rename files
    $db = $this->getDbSource()->exportToFile();
    $files['database.sql'] = $db->realpath();

    // Add the manifest file.
    $manifest = $this->getManifestFile();
    $files['MANIFEST.ini'] = $manifest->realpath();

    // Get all the files in the site.
    foreach (parent::getFilesToBackup($dir) as $new => $real) {
      // Prepend 'docroot' onto the local path.
      $files['docroot/' . $new] = $real;
    }

    return $files;
  }

  /**
   * Import to this source from the given backup file. This is the main restore
   * function for this source.
   *
   * @param BackupFileReadableInterface $file
   *    The file to read the backup from. It will not be opened for reading
   * @return bool|void
   */
  public function importFromFile(BackupFileReadableInterface $file) {
    // TODO: Implement importFromFile() method.
  }

  /**
   * Get a file which contains the file
   * @return \BackupMigrate\Core\File\BackupFileWritableInterface
   */
  protected function getManifestFile() {
    $out = $this->getTempFileManager()->create('ini');

    $info = [
      'Global' => [
        'datestamp' => time(),
        "formatversion" => "2011-07-02",
        "generator" => "Backup and Migrate (http://drupal.org/project/backup_migrate)",
        "generatorversion" => BACKP_MIGRATE_MODULE_VERSION,
      ],
      'Site 0' => [
        'version' => \Drupal::VERSION,
        'name' => "Example.com",
        'docroot' =>"docroot",
        'sitedir' =>"docroot/sites/default",
        'database-file-default' => "database.sql",
        'database-file-driver' => "mysql",
        'files-private' => "docroot/sites/default/private",
        'files-public' => "docroot/sites/default/files"
      ]
    ];

    $out->writeAll($this->arrayToINI($info));
    return $out;
  }


  /**
   * Translate a 2d array to an INI string which can be written to a file.
   *
   * @param array $info
   *    The array to convert. Must be an array of sections each of which is an array of field/value pairs.
   * @return string
   *    The data in INI format.
   */
  private function arrayToINI($info) {
    $content = "";
    foreach ($info as $section => $data) {
      $content .= '['. $section .']' . "\n";
      foreach ($data as $key => $val) {
        $content .= $key . " = \"". $val ."\"\n";
      }
      $content .= "\n";
    }
    return $content;

  }

  /**
   * @return SourceInterface
   */
  public function getDbSource() {
    return $this->db_source;
  }
}