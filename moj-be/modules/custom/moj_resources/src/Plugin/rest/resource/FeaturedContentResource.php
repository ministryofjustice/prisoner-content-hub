<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\FeaturedContentResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\moj_resources\FeaturedContentApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Featured Content Resource
 *
 * @RestResource(
 *   id = "featured_content_resource",
 *   label = @Translation("Featured Content resource"),
 *   uri_paths = {
 *     "canonical" = "/api/content/featured/{category}/{number}/{lang}"
 *   }
 * )
 */

class FeaturedContentResource extends ResourceBase
{
    protected $featuredContentApiController;

    protected $currentRequest;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        FeaturedContentApiClass $FeaturedContentApiClass,
        Request $currentRequest
    ) {        
        $this->featuredContentApiClass = $FeaturedContentApiClass;
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
            $container->get('moj_resources.featured_content_api_class'),
            $container->get('request_stack')->getCurrentRequest()
        );
    }   

    public function get() 
    {
        $lang = $this->currentRequest->get('lang');
        $category = $this->currentRequest->get('category');
        $number = $this->currentRequest->get('number');
        $featuredContent = $this->featuredContentApiClass->FeaturedContentApiEndpoint($lang, $category, $number);
        if (!empty($featuredContent)) {
            return new ResourceResponse($featuredContent);
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }
}


