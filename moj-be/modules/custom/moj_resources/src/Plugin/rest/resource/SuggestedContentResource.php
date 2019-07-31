<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\SuggestedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Language\LanguageManager;
use Symfony\Component\HttpFoundation\Request;
use Drupal\moj_resources\SuggestedContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @SWG\Get(
 *     path="/api/content/suggestions",
 *     tags={"Content"},
 *     @SWG\Parameter(
 *          name="_format",
 *          in="query",
 *          required=true,
 *          type="string",
 *          description="Response format, should be 'json'",
 *      ),
 *      @SWG\Parameter(
 *          name="_category",
 *          in="query",
 *          required=false,
 *          type="integer",
 *          description="ID of category to return, the default is to being back all categories.",
 *      ),
 *      @SWG\Parameter(
 *          name="_number",
 *          in="query",
 *          required=false,
 *          type="integer",
 *          description="Number of results to bring back, the default is '4'.",
 *      ),
 *      @SWG\Parameter(
 *          name="_offset",
 *          in="query",
 *          required=false,
 *          type="integer",
 *          description="Number of results to offset by '0'.",
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
 * Provides a Suggested Content Resource
 *
 * @RestResource(
 *   id = "suggested_content_resource",
 *   label = @Translation("Suggested Content resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/content/suggestions"
 *   }
 * )
 */

class SuggestedContentResource extends ResourceBase
{
    protected $suggestedContentApiController;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $parameter_node_id;

    protected $paramater_number;

    protected $paramater_offset;

    Protected $paramater_language_tag;

    Protected $paramater_number_results;

    protected $paramater_prison;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        SuggestedContentApiClass $SuggestedContentApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {
        $this->suggestedContentApiClass = $SuggestedContentApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;
        $this->availableLangs = $this->languageManager->getLanguages();
        $this->parameter_node_id = self::setNodeId();
        $this->paramater_language_tag = self::setLanguage();
        $this->paramater_number = self::setNumberOfResults();
        $this->paramater_prison = self::setPrison();
        self::checklanguageParameterIsValid();
        self::checkCategoryIsNumeric();
        self::checkNumberOfResultsIsNumeric();
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
            $container->get('moj_resources.suggested_content_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }

    public function get()
    {
        $suggestedContent = $this->suggestedContentApiClass->SuggestedContentApiEndpoint(
            $this->paramater_language_tag,
            $this->parameter_node_id,
            $this->paramater_number,
            $this->paramater_prison
        );
        if (!empty($suggestedContent)) {
            $response = new ResourceResponse($suggestedContent);
            $response->addCacheableDependency($suggestedContent);
            return $response;
        }
        throw new NotFoundHttpException(t('No suggested content found'));
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

    protected function checkCategoryIsNumeric()
    {
        if (is_numeric($this->parameter_node_id)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The category parameter must be numeric'),
            null,
            404
        );
    }

    protected function checkNumberOfResultsIsNumeric()
    {
        if (is_numeric($this->paramater_number)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The number of results parameter must be numeric'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }

    protected function setNodeId()
    {
        return is_null($this->currentRequest->get('_category')) ? 0 : $this->currentRequest->get('_category');
    }

    protected function setNumberOfResults()
    {
        return is_null($this->currentRequest->get('_number')) ? 4 : $this->currentRequest->get('_number');
    }

    protected function setPrison()
    {
        return is_null($this->currentRequest->get('_prison')) ? 0 : $this->currentRequest->get('_prison');
    }
}


