<?php
/**
 * @file
 * Contains BackupMigrate\Drupal\Environment\DrupalLogger
 */


namespace BackupMigrate\Drupal\Environment;


use Psr\Log\AbstractLogger;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

/**
 * Class DrupalLogger
 * @package BackupMigrate\Drupal\Environment
 *
 * This logger sends messages to the browser when Backup and Migrate is run in
 * interactive mode.
 */
class DrupalSetMessageLogger extends AbstractLogger {
  /**
   * Logs with an arbitrary level.
   *
   * @param mixed $level
   * @param string $message
   * @param array $context
   *
   * @return null
   */
  public function log($level, $message, array $context = array()) {
    // Translate the PSR logging level to a drupal message type.
    switch ($level) {
      case LogLevel::EMERGENCY:
      case LogLevel::ALERT:
      case LogLevel::CRITICAL:
      case LogLevel::ERROR:
        $type = 'error';
        break;
      case LogLevel::WARNING:
      case LogLevel::NOTICE:
        $type = 'warning';
        break;
      default:
        $type = 'status';
        break;
    }

    // @TODO: Handle translations properly.
    drupal_set_message($message, $type, FALSE);
  }
}