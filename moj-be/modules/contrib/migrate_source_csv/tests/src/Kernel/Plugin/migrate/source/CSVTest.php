<?php

namespace Drupal\Tests\migrate_source_csv\Unit\Plugin\migrate\source;

use Drupal\node\Entity\Node;
use Drupal\Tests\migrate\Kernel\MigrateTestBase;

/**
 * @coversDefaultClass \Drupal\migrate_source_csv\Plugin\migrate\source\CSV
 *
 * @group migrate_source_csv
 */
class CSVTest extends MigrateTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = [
    'system',
    'field',
    'user',
    'node',
    'file',
    'text',
    'datetime',
    'taxonomy',
    'filter',
    'migrate',
    'migrate_plus',
    'migrate_source_csv',
    'migrate_source_csv_test',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->installEntitySchema('migration');
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');
    $this->installEntitySchema('taxonomy_vocabulary');
    $this->installEntitySchema('taxonomy_term');
    $this->installSchema('node', 'node_access');
    $this->installConfig(['filter']);
    $this->installConfig(['migrate_source_csv_test']);
  }

  /**
   * Tests the construction of CSV.
   *
   * @covers ::__construct
   */
  public function testCreate() {
    /** @var \Drupal\migrate\Plugin\MigratePluginManagerInterface $migrationSourceManager */
    $migrationSourceManager = $this->container->get('plugin.manager.migrate.source');
    $this->assertTrue($migrationSourceManager->hasDefinition('csv'));
  }

  /**
   * Tests execution of a migration sourced from CSV.
   */
  public function testMigrate() {
    $migrationStorage = $this->container->get('entity_type.manager')->getStorage('migration');
    $migration = $migrationStorage->load('migrate_csv');
    /** @var \Drupal\migrate\Plugin\MigrationPluginManagerInterface $migrationManager */
    $migrationManager = $this->container->get('plugin.manager.migration');
    $migration = $migrationManager->createInstance($migration->id());
    $this->executeMigration($migration);
    $node = Node::load(1);
    $this->assertEquals($node->label(), 'Justin Dean');
    $this->assertEquals($node->get('field_first_name')->value, 'Justin');
    $this->assertEquals($node->get('field_last_name')->value, 'Dean');
    $this->assertEquals($node->get('field_email')->value, 'jdean0@example.com');
    $this->assertEquals($node->get('field_country')->entity->label(), 'Indonesia');
    $this->assertEquals($node->get('field_ip_address')->value, '60.242.130.40');
    $this->assertEquals($node->get('field_dob')->value, '1955-01-05');
  }

}
