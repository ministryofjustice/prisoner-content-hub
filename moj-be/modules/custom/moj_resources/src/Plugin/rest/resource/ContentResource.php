<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\ContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpFoundation\Request;
use Drupal\moj_resources\ContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Content Resource
 *
 * @RestResource(
 *   id = "content_resource",
 *   label = @Translation("Content resource"),
 *   uri_paths = {
 *     "canonical" = "/api/content/{nid}/{lang}"
 *   }
 * )
 */

class ContentResource extends ResourceBase
{
    protected $contentApiController;

    protected $contentApiClass;

    protected $currentRequest;

    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      ContentApiClass $contentApiClass,
      Request $currentRequest
    ) {        
        $this->contentApiClass = $contentApiClass;
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
        $nid = $this->currentRequest->get('nid');
        $content = $this->contentApiClass->ContentApiEndpoint($lang, $nid);
        if (!empty($content)) {
            return new ResourceResponse($content);
        }
        throw new NotFoundHttpException(t('No content found'));
    }
}


