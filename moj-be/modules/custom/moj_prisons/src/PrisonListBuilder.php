<?php

namespace Drupal\moj_prisons;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Prison entities.
 *
 * @ingroup moj_prisons
 */
class PrisonListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Prison ID');
    $header['code'] = $this->t('Code');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\moj_prisons\Entity\Prison */
    $row['id'] = $entity->id();
    $row['code'] = $entity->getCode();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.prison.edit_form', array(
          'prison' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
