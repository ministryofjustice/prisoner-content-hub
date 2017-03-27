<?php

namespace Drupal\moj_pdf_item\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Language\LanguageInterface;
use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Symfony\Component\Serializer\Serializer;

class PdfApiController extends ControllerBase implements ContainerInjectionInterface {

    /**
     * The entity storage for taxonomy terms.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $termStorage;

    /**
     * The custom serializer for pdf nodes.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $serializer;

    /**
     * The custom serializer for pdf nodes.
     *
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $termSerializer;

    /**
     * Gets the language of the current request.
     * @return
     *   The language of the current request.
     */
    protected static function getCurrentLanguage() {
        return \Drupal::languageManager()->getCurrentLanguage(LanguageInterface::TYPE_CONTENT);
    }

    /**
     * Constructs a ViewAjaxController object.
     * @param \Symfony\Component\Serializer\Serializer $serializer
     *   The custom serializer for radio nodes.
     */
    public function __construct(EntityStorageInterface $storage, Serializer $serializer, Serializer $termSerializer) {
        $this->termStorage = $storage;
        $this->serializer = $serializer;
        $this->termSerializer = $termSerializer;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container) {
        return new static(
                $container->get('entity.manager')->getStorage('taxonomy_term'), $container->get('moj_pdf_item.serializer.default'), $container->get('moj_pdf_item.link.serializer.default')
        );
    }

    /**
     * {@inheritdoc}
     */
    protected static function translateTerm($term) {
        $lang = PdfApiController::getCurrentLanguage();
        $langcode = $lang->getId();

        if ($term->hasTranslation($langcode)) {
            return $term->getTranslation($langcode);
        } else {
            return $term;
        }
    }

    public function landingPage($tid) {
        $terms = $this->termStorage->loadTree('moj_pdf_categories', 0, 1, TRUE);

        foreach ($terms as $term) {
            if ($term->tid->value == $tid) {
                $term = PdfApiController::translateTerm($term);

                $course['parent'] = array(
                    "cat_id" => $term->id(),
                    "cat_name" => $term->label(),
                    "cat_description" => $term->description->value,
                    "additional_description" => $term->field_moj_pdf_additional_desc->value,
                    "cat_banner" => !empty($term->field_pdf_category_banner->entity) ? file_create_url($term->field_pdf_category_banner->entity->getFileUri()) : "",
                    "back_link" => !empty($term->field_moj_back_link_url->value) ? $term->field_moj_back_link_url->value : "/"
                );
            }
        }

        if ($course['parent'] == NULL) {
            return new JsonResponse([
                'error' => true,
                'message' => 'Not a valid pdf category term id.'
                    ], 404);
        }

        //Get term children, translate, add to response array and serialize
        $child_terms = $this->termStorage->loadTree('moj_pdf_categories', $tid, NULL, TRUE);
        foreach ($child_terms as &$child_term) {
                $child_term = PdfApiController::translateTerm($child_term);         
        }
        
        $course['children'] = $child_terms;
        $data = $this->termSerializer->serialize($course, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

    public function detailPage($tid) {

        $terms = $this->termStorage->loadTree('moj_pdf_categories', 0, NULL, TRUE);

        foreach ($terms as $term) {
            
            $term = PdfApiController::translateTerm($term);
            
            if ($term->tid->value == $tid) {
                $term_name = $term->getName();
                $term_parent = $term->parents[0];
            }
        }

        if ($term_parent == NULL || $term_parent == 0) {
            return new JsonResponse([
                'error' => true,
                'message' => 'Not a valid pdf category term id.'
                    ], 404);
        }

        if ($term_parent) {
            $term = $this->termStorage->load($term_parent);
            $term = PdfApiController::translateTerm($term);

            $term_cat_description = $term->description->value;
            $term_cat_name = $term->label();
            $term_additional_description = $term->field_moj_pdf_additional_desc->value;
            $term_back_link = !empty($term->field_moj_back_link_url->value) ? $term->field_moj_back_link_url->value : "/";
        }

        $pdfs['parent'] = array(
            "parent_name" => $term_name,
            "parent_tid" => $term_parent,
            "cat_description" => $term_cat_description,
            "cat_name" => $term_cat_name,
            "additional_description" => $term_additional_description,
            "cat_banner" => !empty($term->field_pdf_category_banner->entity) ? file_create_url($term->field_pdf_category_banner->entity->getFileUri()) : "",
            "back_link" => $term_back_link,
        );

        $pdf_ids = \Drupal::entityQuery('node')
                ->condition('field_moj_categories.entity.name', $term_name)
                ->sort('created', 'ASC')
                ->execute();

        $pdfs['pdfs'] = Node::loadMultiple($pdf_ids);
        $data = $this->serializer->serialize($pdfs, 'json', ['plugin_id' => 'entity']);

        return new JsonResponse(json_decode($data));
    }

}
