<?php

namespace Drupal\Tests\backup_migrate\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests backup migrate quick backup functionality.
 *
 * @group backup_migrate
 */
class BackupMigrateQuickBackupTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['backup_migrate'];

  /**
   * {@inheritdoc}
   */
  protected $strictConfigSchema = FALSE;

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    // Ensure backup_migrate folder exists.
    $path = 'private://backup_migrate/';
    file_prepare_directory($path, FILE_CREATE_DIRECTORY);
  }

  /**
   * Tests quick backup.
   */
  public function testQuickBackup() {
    $this->drupalLogin($this->drupalCreateUser([
      'perform backup',
      'access backup files',
      'administer backup and migrate',
    ]));
    $this->drupalGet('admin/config/development/backup_migrate');
    $this->assertSession()->statusCodeEquals(200);

    // Submit the quick backup form.
    $data = [
      'source_id' => 'default_db',
      'destination_id' => 'private_files',
    ];
    $this->submitForm($data, t('Backup now'));

    // Get backups page.
    $this->drupalGet('admin/config/development/backup_migrate/backups');
    $this->assertSession()->statusCodeEquals(200);

    // Searching for the existing backups.
    $page = $this->getSession()->getPage();
    $table = $page->find('css', 'table');
    $row = $table->find('css', sprintf('tbody tr:contains("%s")', '.mysql.gz'));
    $this->assertNotNull($row);
  }

}
