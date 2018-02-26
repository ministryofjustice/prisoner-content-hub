<?php

namespace Drupal\health_check\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\PageCache\ResponsePolicy\KillSwitch;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Controller for route that simply returns current time without page cache.
 */
class HealthController extends ControllerBase {

  /**
   * The page cache kill switch.
   *
   * @var \Drupal\Core\PageCache\ResponsePolicy\KillSwitch
   */
  protected $killSwitch;

  /**
   * Constructs a new HealthController object.
   *
   * @param \Drupal\Core\PageCache\ResponsePolicy\KillSwitch $kill_switch
   *   The page cache kill switch.
   */
  public function __construct(KillSwitch $kill_switch) {
    $this->killSwitch = $kill_switch;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('page_cache_kill_switch')
    );
  }

  /**
   * Health check
   *
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function content() {
    // Disable page cache
    $this->killSwitch->trigger();

    // Use plain response with timestamp
    $response = new Response();
    $response->setContent(time());

    return $response;
  }
}
