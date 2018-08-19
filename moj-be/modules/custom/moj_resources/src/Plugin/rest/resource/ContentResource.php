<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\ContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Language\LanguageManager;
use Drupal\moj_resources\ContentApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

 /**
 * @SWG\Get(
 *     path="/api/content/{nid}",
 *     tags={"Content"},
 *     @SWG\Parameter(
 *          name="{nid}",
 *          in="path",
 *          required=true,
 *          type="integer",
 *          description="ID of content to be returned",
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
 *      
 *     @SWG\Response(response="200", description="Hub content resource")
 * )
 */

/**
 * Provides a Content Resource
 *
 * @RestResource(
 *   id = "content_resource",
 *   label = @Translation("Content resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/content/{nid}"
 *   }
 * )
 */

class ContentResource extends ResourceBase
{
    protected $contentApiController;

    protected $contentApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $nid;

    Protected $lang;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        ContentApiClass $contentApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {        
        $this->contentApiClass = $contentApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;
        $this->availableLangs = $this->languageManager->getLanguages();
        $this->nid = $this->currentRequest->get('nid');
        $this->lang =self::setLanguage();
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
            $container->get('moj_resources.content_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        self::checkContentIdParameterIsNumeric();
        $content = $this->contentApiClass->ContentApiEndpoint($lang, $this->nid);
        if (!empty($content)) {
            return new ResourceResponse($content);
        }
        throw new NotFoundHttpException(t('No content found'));
    }

    protected function checklanguageParameterIsValid() 
    {
        foreach($this->availableLangs as $lang)
        {
            if ($lang->getid() === $this->lang) {
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
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }

    protected function checkContentIdParameterIsNumeric()
    {
        if (is_numeric($this->nid)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The content ID must be a numeric'),
            null,
            404
        );
    }
}


