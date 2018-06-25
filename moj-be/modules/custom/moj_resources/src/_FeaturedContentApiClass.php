<?php

namespace Drupal\moj_resources;

use Drupal\moj_resources\FeaturedContentApiClass;

class _FeaturedContentApiClass extends FeaturedContentApiClass
{
    public function _getFeaturedContentNodeIds()
    {
        return $this->getFeaturedContentNodeIds();
    }

    public function getNids()
    {
        return $this->nids;
    }

    public function getNodes()
    {
        return $this->nodes;
    }
}