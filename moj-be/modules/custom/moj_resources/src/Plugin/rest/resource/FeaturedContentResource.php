<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\FeaturedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Language\LanguageManager;
use Symfony\Component\HttpFoundation\Request;
use Drupal\moj_resources\FeaturedContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @SWG\Get(
 *     path="/v1/api/content/featured",
 *     @SWG\Response(response="200", description="Hub featured content resource")
 * )
 */

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "featured_content_resource",
 *   label = @Translation("Featured Content resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/content/featured"
 *   }
 * )
 */

class FeaturedContentResource extends ResourceBase
{
    protected $featuredContentApiController;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $paramater_category;

    Protected $paramater_language_tag;

    Protected $paramater_number_results;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        FeaturedContentApiClass $FeaturedContentApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {        
        $this->featuredContentApiClass = $FeaturedContentApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;
        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_category = self::setCategory();
        $this->paramater_number_results = self::setNumberOfResults();
        $this->paramater_language_tag = self::setLanguage();
        self::checklanguageParameterIsValid();
        self::checkNumberOfResultsIsNumeric();
        self::checkCatgeoryIsNumeric();
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
            $container->get('moj_resources.featured_content_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        $featuredContent = $this->featuredContentApiClass->FeaturedContentApiEndpoint(
            $this->paramater_language_tag, 
            $this->paramater_category, 
            $this->paramater_number_results
        );
        if (!empty($featuredContent)) {
            return new ResourceResponse($featuredContent);
        }
        throw new NotFoundHttpException(t('No featured content found'));
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

    protected function checkCatgeoryIsNumeric()
    {
        if (is_numeric($this->paramater_category)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The category parameter must be a numeric'),
            null,
            404
        );
    }

    protected function checkNumberOfResultsIsNumeric()
    {
        if (is_numeric($this->paramater_number_results)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The number of results parameter must be a numeric'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('lang')) ? 'en' : $this->currentRequest->get('lang');
    }


    protected function setNumberOfResults()
    {
        return is_null($this->currentRequest->get('number')) ? 1 : $this->currentRequest->get('number');
    }

    protected function setCategory()
    {
        return is_null($this->currentRequest->get('category')) ? 0 : $this->currentRequest->get('category');
    }
}   


