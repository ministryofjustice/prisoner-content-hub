<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\MenuResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\moj_resources\MenuApiClass;
use Drupal\Core\Language\LanguageManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


  /**
 * @SWG\Get(
 *     path="/api/menu",
 *     tags={"Menu"},
 *     @SWG\Parameter(
 *          name="_parent",
 *          in="path",
 *          required=false,
 *          type="integer",
 *          description="ID parent page, default is '0' the top level menu",
 *      ),
 *     @SWG\Parameter(
 *          name="_format",
 *          in="query",
 *          required=true,
 *          type="string",
 *          description="Response format, should be 'json'",
 *      ),
 *      @SWG\Parameter(
 *          name="_lang",
 *          in="query",
 *          required=false,
 *          type="string",
 *          description="The language tag to translate results, if there is no translation available then the site default is returned, the default is 'en' (English). Options are 'en' (English) or 'cy' (Welsh).",
 *      ),
 *      @SWG\Parameter(
 *          name="_menu",
 *          in="query",
 *          required=false,
 *          type="string",
 *          description="The machine name of the menu to return, the default is the main menu.",
 *      ),
 *      
 *     @SWG\Response(response="200", description="Hub main menu resource")
 * )
 */

/**
 * Provides a Menu Resource
 *
 * @RestResource(
 *   id = "menu_resource",
 *   label = @Translation("Menu resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/menu"
 *   }
 * )
 */

class MenuResource extends ResourceBase 
{
    protected $menuApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $paramater_current_page_id;

    protected $paramater_language_tag;

    protected $paramater_menu;


    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        MenuApiClass $MenuApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {
        $this->menuApiClass = $MenuApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;

        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_language_tag = self::setLanguage();
        $this->paramater_current_page_id = self::setCurrentPageId();
        $this->paramater_menu = self::setMenu();

        self::checklanguageParameterIsValid();
        self::checkCurrentPageIdParamaterIsNumeric();
        
        parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    }
  
    public static function create(
        ContainerInterface $container,
        array $configuration, 
        $plugin_id, 
        $plugin_definition
    ) {
        return new static(
            $configuration,
            $plugin_id,
            $plugin_definition,
            $container->getParameter('serializer.formats'),
            $container->get('logger.factory')->get('rest'),
            $container->get('moj_resources.menu_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        $menu = $this->menuApiClass->MenuApiEndpoint(
            $this->paramater_language_tag, 
            $this->paramater_current_page_id,
            $this->paramater_menu
        );
        if (!empty($menu)) {

            $response = new ResourceResponse($menu);
            $response->addCacheableDependency($menu);
            return $response;
        }
        throw new NotFoundHttpException(t('No menu found'));
    }

    protected function checklanguageParameterIsValid() 
    {
        foreach($this->availableLangs as $lang)
        {
            if ($lang->getid() === $this->paramater_language_tag) {
                return true;
            } 
        }
        throw new NotFoundHttpException(
            t('The language tag invalid or translation for this tag is not avilable'),
            null,
            404
        );
    }

    protected function checkCurrentPageIdParamaterIsNumeric()
    {
        if (is_numeric($this->paramater_current_page_id)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The parent ID must be a numeric'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }

    protected function setCurrentPageId()
    {
        return is_null($this->currentRequest->get('_parent')) ? 0 : $this->currentRequest->get('_parent');
    }

    protected function setMenu()
    {
        return is_null($this->currentRequest->get('_menu')) ? 'main' : $this->currentRequest->get('_menu');
    }
}