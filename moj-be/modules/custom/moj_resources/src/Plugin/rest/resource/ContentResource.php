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
 * @SWG\Swagger(
 *     schemes={"https"},
 *     host="https://drupal.digital-hub-stage.hmpps.dsd.io",
 *     basePath="/v1",
 *     @SWG\Info(
 *         version="1.0.0",
 *         title="HMPPS Digital Hub API",
 *         description="This is the HMPPS Digital Hub API.",
 *         termsOfService="http://swagger.io/terms/",
 *         @SWG\Contact(
 *             email="thehub@digital.justice.gov.uk"
 *         ),
 *         @SWG\License(
 *             name="Apache 2.0",
 *             url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *         )
 *     ),
 *     @SWG\ExternalDocumentation(
 *         description="Find out more about Swagger",
 *         url="http://swagger.io"
 *     )
 * )
 */

/**
 * @SWG\Get(
 *     path="/v1/api/content/{nid}",
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
        return is_null($this->currentRequest->get('lang')) ? 'en' : $this->currentRequest->get('lang');
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


