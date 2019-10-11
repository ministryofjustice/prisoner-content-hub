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
use Drupal\moj_resources\NewFeaturedContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @SWG\Get(
 *     path="/v2/api/content/featured/",
 *     tags={"Content"},
 *     @SWG\Parameter(
 *          name="_format",
 *          in="query",
 *          required=true,
 *          type="string",
 *          description="Response format, should be 'json'",
 *      ),
 *      @SWG\Parameter(
 *          name="_prison",
 *          in="query",
 *          required=false,
 *          type="integer",
 *          description="ID of category to return, the default is to being back all categories.",
 *      ),
 *      @SWG\Parameter(
 *          name="_lang",
 *          in="query",
 *          required=false,
 *          type="string",
 *          description="The language tag to translate results, if there is no translation available then the site default is returned, the default is 'en' (English). Options are 'en' (English) or 'cy' (Welsh).",
 *      ),
 *
 *     @SWG\Response(response="200", description="Hub featured content resource")
 * )
 */

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "new_featured_content_resource",
 *   label = @Translation("Featured Content resource (v2)"),
 *   uri_paths = {
 *     "canonical" = "/v2/api/content/featured"
 *   }
 * )
 */

class NewFeaturedContentResource extends ResourceBase
{
    protected $featuredContentApiController;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $paramater_prison;

    Protected $paramater_language_tag;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        NewFeaturedContentApiClass $FeaturedContentApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {
        $this->featuredContentApiClass = $FeaturedContentApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;
        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_prison = self::setPrison();
        $this->paramater_language_tag = self::setLanguage();
        self::checkLanguageParameterIsValid();
        self::checkPrisonIsNumeric();
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
            $container->get('moj_resources.new_featured_content_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }

    public function get()
    {
        $featuredContent = $this->featuredContentApiClass->FeaturedContentApiEndpoint(
            $this->paramater_language_tag,
            $this->paramater_category,
            $this->paramater_prison
        );
        if (!empty($featuredContent)) {
            $response = new ResourceResponse($featuredContent);
            $response->addCacheableDependency($featuredContent);
            return $response;
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }

    protected function checkLanguageParameterIsValid()
    {
        foreach($this->availableLangs as $lang)
        {
            if ($lang->getid() === $this->paramater_language_tag) {
                return true;
            }
        }
        throw new NotFoundHttpException(
            t('The language tag invalid or translation for this tag is not available'),
            null,
            404
        );
    }

    protected function checkPrisonIsNumeric()
    {
        if (is_numeric($this->paramater_prison)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The prison parameter must be a numeric'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }

    protected function setPrison()
    {
        return is_null($this->currentRequest->get('_prison')) ? 0 : intval($this->currentRequest->get('_prison'));
    }
}


