<?php

namespace Drupal\Tests\migrate_source_csv\Unit\Plugin\migrate\source;

use Drupal\source_plugin_yield_test\Plugin\migrate\source\YieldRows;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\Tests\migrate_source_csv\Unit\CSVUnitBase;

/**
 * @coversDefaultClass \Drupal\migrate_source_csv\Plugin\migrate\source\CSV
 *
 * @group migrate_source_csv
 */
class CSVSourceYieldTest extends CSVUnitBase {

  /**
   * The plugin id.
   *
   * @var string
   */
  protected $pluginId;

  /**
   * The plugin definition.
   *
   * @var array
   */
  protected $pluginDefinition;

  /**
   * The migration plugin.
   *
   * @var \Drupal\migrate\Plugin\MigrationInterface
   */
  protected $migration;

  /**
   * {@inheritdoc}
   */
  public static $modules = [
    'migrate',
    'migrate_source_csv',
    'source_plugin_yield_test',
  ];

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    $this->pluginId = 'test csv migration';
    $this->pluginDefinition = [];
    $migration = $this->prophesize(MigrationInterface::class);
    $migration->getIdMap()
      ->willReturn(NULL);

    $this->migration = $migration->reveal();
  }

  /**
   * Test fields method with a source plugin using yield.
   *
   * @throws \Drupal\migrate\MigrateException
   */
  public function testFields() {
    $configuration = [
      'path' => $this->happyPath,
      'keys' => ['id'],
      'header_row_count' => 1,
    ];

    $plugin = new YieldRows($configuration, $this->pluginId, $this->pluginDefinition, $this->migration);

    $expected_fields = [
      'id' => 'id',
      'first_name' => 'first_name',
      'last_name' => 'last_name',
      'email' => 'email',
      'country' => 'country',
      'ip_address' => 'ip_address',
    ];

    $fields = $plugin->fields();
    $this->assertArrayEquals($expected_fields, $fields);
  }

}
