<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\PromotedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Language\LanguageManager;
use Symfony\Component\HttpFoundation\Request;
use Drupal\moj_resources\PromotedContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @SWG\Get(
 *     path="/v1/api/content/promoted",
 *     @SWG\Response(response="200", description="Hub promoted content resource")
 * )
 */

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "promoted_content_resource",
 *   label = @Translation("Promoted content resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/content/promoted"
 *   }
 * )
 */

class PromotedContentResource extends ResourceBase
{
    protected $promotedContentApiController;

    protected $promotedContentApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    Protected $paramater_language_tag;


    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      PromotedContentApiClass $promotedContentApiClass,
      Request $currentRequest,
      LanguageManager $languageManager
    ) {        
        $this->promotedContentApiClass = $promotedContentApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;
        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_language_tag = self::setLanguage();
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
            $container->get('moj_resources.promoted_content_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        $lang = $this->currentRequest->get('lang');
        $promoted = $this->promotedContentApiClass->PromotedContentApiEndpoint($lang);
        if (!empty($promoted)) {
            return new ResourceResponse($promoted);
        }
        throw new NotFoundHttpException(t('No promoted content found'));
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

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('lang')) ? 'en' : $this->currentRequest->get('lang');
    }
}


