<?php

namespace Drupal\moj_prisons\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Prison entities.
 */
class PrisonViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['prison']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Prison'),
      'help' => $this->t('The Prison ID.'),
    );

    return $data;
  }

}
