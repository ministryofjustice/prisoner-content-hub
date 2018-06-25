<?php

/**
 * @file
 * Contains Drupal\\moj_resources\Plugin\rest\resource\MenuResource.
 */

namespace Drupal\moj_resources\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\moj_resources\MenuApiClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a Menu Resource
 *
 * @RestResource(
 *   id = "menu_resource",
 *   label = @Translation("Menu resource"),
 *   uri_paths = {
 *     "canonical" = "/api/menu/{parent}/{lang}"
 *   }
 * )
 */

class MenuResource extends ResourceBase 
{
    protected $menuApiClass;

    protected $currentRequest;

    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        MenuApiClass $MenuApiClass,
        Request $currentRequest
    ) {        
        $this->menuApiClass = $MenuApiClass;
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
            $container->get('moj_resources.menu_api_class'),
            $container->get('request_stack')->getCurrentRequest()
        );
    }   

    public function get() 
    {
        $lang = $this->currentRequest->get('lang');
        $parent = $this->currentRequest->get('parent');
        $menu = $this->menuApiClass->MenuApiEndpoint($lang, $parent);
        if (!empty($menu)) {
            return new ResourceResponse($menu);
        }
        throw new NotFoundHttpException(t('No featured content found'));
    }
}


