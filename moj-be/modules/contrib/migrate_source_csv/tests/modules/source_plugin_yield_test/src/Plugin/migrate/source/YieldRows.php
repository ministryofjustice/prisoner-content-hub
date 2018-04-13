<?php

namespace Drupal\source_plugin_yield_test\Plugin\migrate\source;

use Drupal\migrate_source_csv\Plugin\migrate\source\CSV;

/**
 * Yields each image and sku.
 *
 * @MigrateSource(
 *   id = "yield_rows"
 * )
 */
class YieldRows extends CSV {

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {
    $file = parent::initializeIterator();
    return $this->getYield($file);
  }

  /**
   * Prepare a test row using yield.
   *
   * @param \SplFileObject $file
   *   The source CSV file object.
   *
   * @codingStandardsIgnoreStart
   *
   * @return \Generator
   *   A new row with only the id value.
   *
   * @codingStandardsIgnoreEnd
   */
  public function getYield(\SplFileObject $file) {
    foreach ($file as $row_num => $row) {
      $new_row = [];
      $new_row['id'] = $row['id'];
      yield($new_row);
    }
  }

}
