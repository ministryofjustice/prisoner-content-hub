<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\PromotedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpFoundation\Request;
use Drupal\moj_resources\PromotedContentApiClass;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "promoted_content_resource",
 *   label = @Translation("Promoted content resource"),
 *   uri_paths = {
 *     "canonical" = "/api/content/promoted/{lang}"
 *   }
 * )
 */

class PromotedContentResource extends ResourceBase
{
    protected $promotedContentApiController;

    protected $promotedContentApiClass;

    protected $currentRequest;

    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      PromotedContentApiClass $promotedContentApiClass,
      Request $currentRequest
    ) {        
        $this->promotedContentApiClass = $promotedContentApiClass;
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
            $container->get('moj_resources.promoted_content_api_class'),
            $container->get('request_stack')->getCurrentRequest()
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
}


