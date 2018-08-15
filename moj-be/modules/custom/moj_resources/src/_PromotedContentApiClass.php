<?php

namespace Drupal\moj_resources;

use Drupal\moj_resources\PromotedContentApiClass;

class _PromotedContentApiClass extends PromotedContentApiClass
{
    public function _getFeaturedContentNodeIds()
    {
        return $this->getPromotedContentNodeIds();
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
