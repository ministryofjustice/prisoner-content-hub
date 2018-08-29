<?php

/**
 * @file
 * Contains Drupal\moj_resources\Plugin\rest\resource\TermResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Language\LanguageManager;
use Drupal\moj_resources\TermApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

 /**
 * @SWG\Get(
 *     path="/api/term/{tid}",
 *     tags={"Category"},
 *     @SWG\Parameter(
 *          name="_format",
 *          in="query",
 *          required=true,
 *          type="string",
 *          description="Response format, should be 'json'",
 *      ),
 *      @SWG\Parameter(
 *          name="{term}",
 *          in="query",
 *          required=true,
 *          type="integer",
 *          description="ID of term to return",
 *      ),
 *      @SWG\Parameter(
 *          name="_lang",
 *          in="query",
 *          required=false,
 *          type="string",
 *          description="The language tag to translate results, if there is no translation available then the site default is returned, the default is 'en' (English). Options are 'en' (English) or 'cy' (Welsh).",
 *      ),
 *      
 *     @SWG\Response(response="200", description="Hub term resource")
 * )
 */

/**
 * Provides a Term Resource
 *
 * @RestResource(
 *   id = "term_resource",
 *   label = @Translation("Term resource"),
 *   uri_paths = {
 *     "canonical" = "/v1/api/term/{tid}"
 *   }
 * )
 */

class TermResource extends ResourceBase 
{
    protected $termApiClass;

    protected $currentRequest;

    protected $availableLangs;

    protected $languageManager;

    protected $paramater_term_id;

    Protected $paramater_language_tag;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        TermApiClass $TermApiClass,
        Request $currentRequest,
        LanguageManager $languageManager
    ) {        
        $this->termApiClass = $TermApiClass;
        $this->currentRequest = $currentRequest;
        $this->languageManager = $languageManager;

        $this->availableLangs = $this->languageManager->getLanguages();
        $this->paramater_language_tag = self::setLanguage();
        $this->paramater_term_id = $this->currentRequest->get('tid');
        
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
            $container->get('moj_resources.term_api_class'),
            $container->get('request_stack')->getCurrentRequest(),
            $container->get('language_manager')
        );
    }   

    public function get() 
    {
        self::checkTermIsNumeric();
        $content = $this->termApiClass->TermApiEndpoint($this->paramater_language_tag, $this->paramater_term_id);
        if (!empty($content)) {
            return new ResourceResponse($content);
        }
        throw new NotFoundHttpException(t('No term found'));
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

    protected function checkTermIsNumeric()
    {
        if (is_numeric($this->paramater_term_id)) {
            return true;
        }
        throw new NotFoundHttpException(
            t('The term parameter must be a numeric'),
            null,
            404
        );
    }

    protected function setLanguage()
    {
        return is_null($this->currentRequest->get('_lang')) ? 'en' : $this->currentRequest->get('_lang');
    }
}


