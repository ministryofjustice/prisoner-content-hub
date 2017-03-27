<?php

namespace Drupal\moj_prisons\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Prison entities.
 *
 * @ingroup moj_prisons
 */
interface PrisonInterface extends ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  /**
   * Gets the Prison name.
   *
   * @return string
   *   Name of the Prison.
   */
  public function getName();

  /**
   * Sets the Prison name.
   *
   * @param string $name
   *   The Prison name.
   *
   * @return \Drupal\moj_prisons\Entity\PrisonInterface
   *   The called Prison entity.
   */
  public function setName($name);

  /**
   * Gets the Prison creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Prison.
   */
  public function getCreatedTime();

  /**
   * Sets the Prison creation timestamp.
   *
   * @param int $timestamp
   *   The Prison creation timestamp.
   *
   * @return \Drupal\moj_prisons\Entity\PrisonInterface
   *   The called Prison entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Prison published status indicator.
   *
   * Unpublished Prison are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Prison is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Prison.
   *
   * @param bool $published
   *   TRUE to set this Prison to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\moj_prisons\Entity\PrisonInterface
   *   The called Prison entity.
   */
  public function setPublished($published);

}
