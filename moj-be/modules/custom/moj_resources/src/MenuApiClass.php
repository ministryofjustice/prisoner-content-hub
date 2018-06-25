<?php

namespace Drupal\moj_resources;

use Drupal\Core\Menu\MenuLinkTree;
use Drupal\Core\Menu\MenuLinkManager;

/**
 * MenuApiClass
 */

class MenuApiClass
{   
    /**
     * Language tag
     *
     * @var string
     */
    protected $lang;

    /**
     * Currenrt Entity ID
     *
     * @var int
     */
    protected $current; 

    /**
     * Menu Link Tree Class
     * 
     * @var Drupal\Core\Menu\MenuLinkTree
     */
    protected $menuLinkTree;

    /**
     * Menu Link Manager
     *
     * @var Drupal\Core\Entity\EntityTypeManager
     */
    protected $menuLinkManager;

    /**
     * Menu Tree
     *
     * @var \Drupal\Core\Menu\MenuTreeParameters
     */
    protected $tree;

    /**
     * An array with menu information in
     *
     * @var array
     */
    protected $menu = array();

    /**
     * Current link object
     *
     * @var \Drupal\Core\Menu\MenuLinkInterface
     */
    protected $currentLink;

    /**
     * Menu name
     *
     * @var string
     */
    protected $menuName = 'main';
    
    /**
     * Paramaters
     *
     * @var \Drupal\Core\Menu\MenuTreeParameters
     */
    protected $parameters;
    
    /**
     * Constructor function
     *
     * @param MenuLinkTree $MenuLinkTree
     * @param MenuLinkManager $MenuLinkManager
     */
    public function __construct(
        MenuLinkTree $MenuLinkTree,
        MenuLinkManager $MenuLinkManager
    ) {
        $this->menuLinkTree = $MenuLinkTree;
        $this->menuLinkManager = $MenuLinkManager;
    }

    /**
     * Menu end point function
     *
     * @param string $lang
     * @param int $current
     * @return void
     */
    public function MenuApiEndpoint($lang, $current)
    {
        $this->lang = $lang;
        $this->current = $current;
        $this->currentLink = self::loadCurrentLink();
        $this->tree = self::LoadMenuTree($this->menuName);
        $menu = $this->menuLinkTree->build($this->tree);
        return self::createMenuArray($menu);
    }

    /**
     * Load current link object function
     *
     * @return  \Drupal\Core\Menu\MenuLinkInterface
     */
    protected function loadCurrentLink()
    {
        return $this->menuLinkManager->loadLinksByRoute('entity.node.canonical', array('node' => $this->current), $this->menuName);
    } 

    /**
     * Set paramaters function
     *
     * @return void
     */
    protected function setParameters()
    {
        $this->parameters = new \Drupal\Core\Menu\MenuTreeParameters();
        if(!empty($this->currentLink))
        {
            $root_menu_item = reset($this->currentLink);
            $this->parameters->setMaxDepth(1);
            $this->parameters->setRoot($root_menu_item->getPluginId());
            $this->parameters->excludeRoot();
        }
    }

    /**
     * Load meun tree function
     *
     * @param string $menu
     * @return \Drupal\Core\Menu\MenuLinkTreeElement
     */
    protected function LoadMenuTree($menu)
    {
        self::setParameters();
        return $this->menuLinkTree->load($menu, $this->parameters);
    }

    /**
     * Create menu array function
     *
     * @param \Drupal\Core\Menu\MenuLinkTreeElement $tree
     * @return array
     */
    protected function createMenuArray($tree)
    {
        foreach($tree['#items'] as $item)
        {   
            $this->menu[] = array(
                'title' => $item['title'],
                'link' => $item['url']->getInternalPath(),
                'id' => self::getId($item['url']->getInternalPath()),
            );  
        }
        return $this->menu;
    }

    /**
     * Get enitiy id function
     *
     * @param [type] $string
     * @return int
     */
    protected function getId($string)
    {
        return ltrim($string, 'node/');
    }
}
