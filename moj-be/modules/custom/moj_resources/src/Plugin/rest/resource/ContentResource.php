<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\ContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\moj_resources\ContentApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "content_resource",
 *   label = @Translation("Content resource"),
 *   uri_paths = {
 *     "canonical" = "/api/content/{category}/{number}/{lang}"
 *   }
 * )
 */

class ContentResource extends ResourceBase 
{
    protected $contentApiController;

    protected $currentRequest;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        ContentApiClass $ContentApiClass,
        Request $currentRequest
    ) {        
        $this->contentApiClass = $ContentApiClass;
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
            $container->get('moj_resources.content_api_class'),
            $container->get('request_stack')->getCurrentRequest()
        );
    }   

    public function get() 
    {
        $lang = $this->currentRequest->get('lang');
        $category = $this->currentRequest->get('category');
        $number = $this->currentRequest->get('number');
        $content = $this->contentApiClass->ContentApiEndpoint($lang, $category, $number);
        if (!empty($content)) {
            return new ResourceResponse($content);
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }
}


