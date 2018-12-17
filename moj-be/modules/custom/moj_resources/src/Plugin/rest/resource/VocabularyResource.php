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
use Drupal\moj_resources\VocabularyApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

 /**
 * @SWG\Get(
 *     path="/api/vocabulary/{category}",
 *     tags={"Category"},
 *     @SWG\Parameter(
 *          name="_format",
 *          in="query",
 *          required=true,
 *          type="string",
 *          description="Response format, should be 'json'",
 *      ),
 *      @SWG\Parameter(
 *          name="{category}",
 *          in="query",
 *          required=true,
 *          type="integer",
 *          description="ID of category to return",
 *      ),
 *      @SWG\Parameter(
 *          name="_lang",
 *          in="query",
 *          required=false,
 *          type="string",
 *          description="The language tag to translate results, if there is no translation available then the site default is returned, the default is 'en' (English). Options are 'en' (English) or 'cy' (Welsh).",
 *      ),
 *      
 *     @SWG\Response(response="200", description="Hub vocabulary resource")
 * )
 */

/**
 * Provides a Vocabulary Resource
 *
 * @RestResource(
 *   id = "vocabulary_resource",
 *   label = @Translation("Vocabulary resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/vocabulary/{category}"
 *   }
 * )
 */

class VocabularyResource extends ResourceBase 
{
    protected $vocabularyApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $paramater_category;

    Protected $paramater_language_tag;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        VocabularyApiClass $VocabularyApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {        
        $this->vocabularyApiClass = $VocabularyApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;

        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_language_tag = self::setLanguage();
        $this->paramater_category = $this->currentRequest->get('category');
        
        self::checklanguageParameterIsValid();
        

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
            $container->get('moj_resources.vocabulary_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        self::checkCatgeoryIsString();
        $content = $this->vocabularyApiClass->VocabularyApiEndpoint($this->paramater_language_tag, $this->paramater_category);
        if (!empty($content)) {
            $response = new ResourceResponse($content);
            $response->addCacheableDependency($content);
            return $response;
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

    protected function checkCatgeoryIsString()
    {
        if (is_string($this->paramater_category)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The category parameter must the machine name of the drupal catgeory'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }
}


