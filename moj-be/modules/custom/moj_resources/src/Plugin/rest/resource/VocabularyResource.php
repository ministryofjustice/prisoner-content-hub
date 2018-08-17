<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\FeaturedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\moj_resources\VocabularyApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Vocabulary Resource
 *
 * @RestResource(
 *   id = "vocabulary_resource",
 *   label = @Translation("Vocabulary resource"),
 *   uri_paths = {
 *     "canonical" = "/api/vocabulary/{category}/{lang}"
 *   }
 * )
 */

class VocabularyResource extends ResourceBase 
{
    protected $vocabularyApiClass;

    protected $currentRequest;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        VocabularyApiClass $VocabularyApiClass,
        Request $currentRequest
    ) {        
        $this->vocabularyApiClass = $VocabularyApiClass;
        $this->currentRequest = $currentRequest;
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
            $container->get('request_stack')->getCurrentRequest()
        );
    }   

    public function get() 
    {
        $lang = $this->currentRequest->get('lang');
        $category = $this->currentRequest->get('category');
        $content = $this->vocabularyApiClass->VocabularyApiEndpoint($lang, $category);
        if (!empty($content)) {
            return new ResourceResponse($content);
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }
}


