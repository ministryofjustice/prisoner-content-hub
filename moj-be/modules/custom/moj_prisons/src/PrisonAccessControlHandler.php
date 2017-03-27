<?php

namespace Drupal\moj_prisons;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\user\Entity\User;

/**
 * Access controller for the Prison entity.
 *
 * @see \Drupal\moj_prisons\Entity\Prison.
 */
class PrisonAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\moj_prisons\Entity\PrisonInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished prison entities');
        }

        if ($account->hasPermission('administer my prison users')) {
          $related_prison_ids = _moj_prisons_get_user_related_prison_ids($account);

          if (in_array($entity->id(), $related_prison_ids)) {
            return AccessResult::allowed();
          }

          return AccessResult::allowedIfHasPermission($account, 'view published prison entities');
        } else {
          return AccessResult::allowedIfHasPermission($account, 'view published prison entities');
        }

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit prison entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete prison entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add prison entities');
  }

}
