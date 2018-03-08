<?php

namespace BackupMigrate\Drupal\EntityPlugins\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines an source plugin annotation object.
 *
 * Plugin Namespace: Plugin\BackupMigrateDestinationPlugin.
 *
 * @Annotation
 */
class BackupMigrateDestinationPlugin extends Plugin {

  /**
   * The source plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable name of the source plugin.
   *
   * @ingroup plugin_translatable
   *
   * @var \Drupal\Core\Annotation\Translation
   */
  public $title;

  /**
   * The description of the source plugin.
   *
   * @ingroup plugin_translatable
   *
   * @var \Drupal\Core\Annotation\Translation
   */
  public $description;

  /**
   * The class of the Backup and Migrate source object.
   *
   * @var string
   */
  public $wrapped_class;

  /**
   * Whether new items of this type can be created.
   *
   * @var bool
   */
  public $locked;

}
