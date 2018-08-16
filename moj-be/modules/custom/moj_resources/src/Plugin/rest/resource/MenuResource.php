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
 * Provides a Menu Resource
 *
 * @RestResource(
 *   id = "menu_resource",
 *   label = @Translation("Menu resource"),
 *   uri_paths = {
 *     "canonical" = "/api/menu/{parent}/{lang}"
 *   }
 * )
 */

class MenuResource extends ResourceBase 
{
    protected $menuApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $currentPageIdParameter;

    protected $languageParameter;


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
        $this->currentPageIdParameter = $this->currentRequest->get('parent');
        $this->languageParameter = $this->currentRequest->get('lang');
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
        self::checklanguageParameterIsValid();
        self::checkCurrentPageIdParameterIsNumeric();
        $menu = $this->menuApiClass->MenuApiEndpoint($lang, $parent);
        if (!empty($menu)) {
            return new ResourceResponse($menu);
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }

    protected function checklanguageParameterIsValid() 
    {
        foreach($this->availableLangs as $lang)
        {
            if ($lang->getid() === $this->languageParameter) {
                return true;
            } 
        }
        throw new NotFoundHttpException(
            t('The language tag invalid or translation for this tag is not avilable'),
            null,
            404
        );
    }

    protected function checkCurrentPageIdParameterIsNumeric()
    {
        if (is_numeric($this->currentPageIdParameter)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The parent ID must be a numeric'),
            null,
            404
        );
    }
}