<?php

namespace Drupal\flood_unblock;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Flood\FloodInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

class FloodUnblockManager {

  use StringTranslationTrait;

  /**
   * The Database Connection
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * @var \Drupal\Core\Flood\FloodInterface
   */
  protected $flood;

  /**
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $config;

  /**
   * FloodUnblockAdminForm constructor.
   *
   * @param \Drupal\Core\Database\Connection $database
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   */
  public function __construct(Connection $database, FloodInterface $flood, ConfigFactoryInterface $configFactory, EntityTypeManagerInterface $entityTypeManager) {
    $this->database = $database;
    $this->flood = $flood;
    $this->entityTypeManager = $entityTypeManager;
    $this->config = $configFactory->get('user.flood');
  }

  /**
   * Generate rows from the entries in the flood table.
   *
   * @return array
   *   Ip blocked entries in the flood table.
   */
  public function get_blocked_ip_entries() {
    $entries = [];

    if (db_table_exists('flood')) {
      $query = $this->database->select('flood', 'f');
      $query->addField('f', 'identifier');
      $query->addField('f', 'identifier', 'ip');
      $query->addExpression('count(*)', 'count');
      $query->condition('f.event', '%failed_login_ip', 'LIKE');
      $query->groupBy('identifier');
      $results = $query->execute();

      foreach ($results as $result) {
        if (function_exists('smart_ip_get_location')) {
          $location = smart_ip_get_location($result->ip);
          $location_string = sprintf(" (%s %s %s)", $location['city'], $location['region'], $location['country_code']);
        }
        else {
          $location_string = '';
        }

        $blocked = !$this->flood->isAllowed('user.failed_login_ip', $this->config->get('ip_limit'), $this->config->get('ip_window'), $result->ip);

        $entries[$result->identifier] = [
          'type' => 'ip',
          'ip' => $result->ip,
          'count' => $result->count,
          'location' => $location_string,
          'blocked' => $blocked,
        ];
      }
    }

    return $entries;
  }

  /**
   * Generate rows from the entries in the flood table.
   *
   * @return array
   *   User blocked entries in the flood table.
   */
  public function get_blocked_user_entries() {
    $entries = [];

    if (db_table_exists('flood')) {
      $query = $this->database->select('flood', 'f');
      $query->addField('f', 'identifier');
      $query->addExpression('count(*)', 'count');
      $query->condition('f.event', '%failed_login_user', 'LIKE');
      $query->groupBy('identifier');
      $results = $query->execute();

      foreach ($results as $result) {
        $parts = explode('-', $result->identifier);
        $result->uid = $parts[0];
        $result->ip = $parts[1];
        if (function_exists('smart_ip_get_location')) {
          $location = smart_ip_get_location($result->ip);
          $location_string = sprintf(" (%s %s %s)", $location['city'], $location['region'], $location['country_code']);
        }
        else {
          $location_string = '';
        }

        $blocked = !$this->flood->isAllowed('user.failed_login_user', $this->config->get('user_limit'), $this->config->get('user_window'), $result->identifier);

        /** @var \Drupal\user\Entity\User $user */
        $user = $this->entityTypeManager->getStorage('user')
          ->load($result->uid);

        if (isset($user)) {
          $user_link = $user->toLink($user->getUsername());
        } else {
          $user_link = $this->t('Deleted user: @user', ['@user' => $result->uid]);
        }

        $entries[$result->identifier] = [
          'type' => 'user',
          'uid' => $result->uid,
          'ip' => $result->ip,
          'username' => $user_link,
          'count' => $result->count,
          'location' => $location_string,
          'blocked' => $blocked,
        ];
      }
    }

    return $entries;
  }

  /**
   * The function that clear the flood.
   */
  public function flood_unblock_clear_event($type, $identifier) {
    $txn = $this->database->startTransaction('flood_unblock_clear');
    try {
      $query = $this->database->delete('flood')
        ->condition('event', '%' . $type, 'LIKE');
      if (isset($identifier)) {
        $query->condition('identifier', $identifier);
      }
      $success = $query->execute();
      if ($success) {
        drupal_set_message($this->t('Flood entries cleared.'), 'status', FALSE);
      }
    } catch (\Exception $e) {
      // Something went wrong somewhere, so roll back now.
      $txn->rollback();
      // Log the exception to watchdog.
      watchdog_exception('type', $e);
      drupal_set_message($this->t('Error: @error', ['@error' => (string) $e]), 'error');
    }
  }
}
