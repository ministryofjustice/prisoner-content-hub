<?php

namespace Drupal\migrate_source_csv\Plugin\migrate\source;

use Drupal\Component\Plugin\ConfigurablePluginInterface;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Utility\NestedArray;
use Drupal\migrate\MigrateException;
use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Plugin\MigrationInterface;

/**
 * Source for CSV.
 *
 * If the CSV file contains non-ASCII characters, make sure it includes a
 * UTF BOM (Byte Order Marker) so they are interpreted correctly.
 *
 * @MigrateSource(
 *   id = "csv"
 * )
 */
class CSV extends SourcePluginBase implements ConfigurablePluginInterface {

  /**
   * List of available source fields.
   *
   * Keys are the field machine names as used in field mappings, values are
   * descriptions.
   *
   * @var array
   */
  protected $fields = [];

  /**
   * List of key fields, as indexes.
   *
   * @var array
   */
  protected $keys = [];

  /**
   * The file class to read the file.
   *
   * @var string
   */
  protected $fileClass = '';

  /**
   * The file object that reads the CSV file.
   *
   * @var \SplFileObject
   */
  protected $file = NULL;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration);
    $this->setConfiguration($configuration);

    // Path is required.
    if (empty($this->getConfiguration()['path'])) {
      throw new MigrateException('You must declare the "path" to the source CSV file in your source settings.');
    }

    // Key field(s) are required.
    if (empty($this->getConfiguration()['keys'])) {
      throw new MigrateException('You must declare "keys" as a unique array of fields in your source settings.');
    }

    $this->fileClass = $this->getConfiguration()['file_class'];
  }

  /**
   * Return a string representing the source file path.
   *
   * @return string
   *   The file path.
   */
  public function __toString() {
    return $this->getConfiguration()['path'];
  }

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {
    if (!file_exists($this->getConfiguration()['path'])) {
      throw new InvalidPluginDefinitionException($this->getPluginId(), sprintf('File path (%s) does not exist.', $this->getConfiguration()['path']));
    }
    // File handler using header-rows-respecting extension of SPLFileObject.
    $this->file = new $this->fileClass($this->getConfiguration()['path']);
    return $this->setupFile();
  }

  /**
   * @return \SplFileObject
   */
  protected function setupFile() {
    // Set basics of CSV behavior based on configuration.
    $delimiter = $this->getConfiguration()['delimiter'];
    $enclosure = $this->getConfiguration()['enclosure'];
    $escape = $this->getConfiguration()['escape'];
    $this->file->setCsvControl($delimiter, $enclosure, $escape);
    $this->file->setFlags($this->getConfiguration()['file_flags']);

    // Figure out what CSV column(s) to use. Use either the header row(s) or
    // explicitly provided column name(s).
    if ($this->getConfiguration()['header_row_count']) {
      $this->file->setHeaderRowCount($this->getConfiguration()['header_row_count']);

      // Find the last header line.
      $this->file->rewind();
      $this->file->seek($this->file->getHeaderRowCount() - 1);

      $row = $this->file->current();
      foreach ($row as $header) {
        $header = trim($header);
        $column_names[] = [$header => $header];
      }
      $this->file->setColumnNames($column_names);
    }
    // An explicit list of column name(s) will override any header row(s).
    if ($this->getConfiguration()['column_names']) {
      $this->file->setColumnNames($this->getConfiguration()['column_names']);
    }

    return $this->file;
  }

  /**
   * {@inheritdoc}
   */
  public function getIDs() {
    $ids = [];
    foreach ($this->getConfiguration()['keys'] as $delta => $value) {
      if (is_array($value)) {
        $ids[$delta] = $value;
      }
      else {
        $ids[$value]['type'] = 'string';
      }
    }
    return $ids;
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    $fields = [];
    if (!$this->file) {
      $this->initializeIterator();
    }
    foreach ($this->file->getColumnNames() as $column) {
      $fields[key($column)] = reset($column);
    }

    // Any caller-specified fields with the same names as extracted fields will
    // override them; any others will be added.
    $fields = $this->getConfiguration()['fields'] + $fields;

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * Gets the file object.
   *
   * @return \SplFileObject
   *   The file object.
   */
  public function getFile() {
    return $this->file;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    // We must preserve integer keys for column_name mapping.
    $this->configuration = NestedArray::mergeDeepArray([$this->defaultConfiguration(), $configuration], TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'fields' => [],
      'keys' => [],
      'column_names' => [],
      'header_row_count' => 0,
      'file_flags' => \SplFileObject::READ_CSV | \SplFileObject::READ_AHEAD | \SplFileObject::DROP_NEW_LINE | \SplFileObject::SKIP_EMPTY,
      'delimiter' => ',',
      'enclosure' => '"',
      'escape' => '\\',
      'path' => '',
      'file_class' => 'Drupal\migrate_source_csv\CSVFileObject',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    return [];
  }
}
