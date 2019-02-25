<?php

namespace Drupal\Tests\video\Kernel;

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\entity_test\Entity\EntityTest;
use Drupal\Tests\field\Kernel\FieldKernelTestBase;

/**
 * Tests video field serialization.
 *
 * @group video
 */
class VideoItemSerializationTest extends FieldKernelTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['video', 'file', 'serialization'];

  /**
   * {@inheritdoc}
   */
  protected $strictConfigSchema = FALSE;

  /**
   * The serializer service.
   *
   * @var \Symfony\Component\Serializer\SerializerInterface
   */
  protected $serializer;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->installEntitySchema('user');
    $this->serializer = \Drupal::service('serializer');

    // Create a generic video field.
    FieldStorageConfig::create([
      'entity_type' => 'entity_test',
      'field_name' => 'field_test',
      'type' => 'video',
    ])->save();

    FieldConfig::create([
      'entity_type' => 'entity_test',
      'field_name' => 'field_test',
      'bundle' => 'entity_test',
    ])->save();
  }

  /**
   * Tests the deserialization.
   */
  public function testVideoDeserialization() {
    $entity = EntityTest::create();
    $json = json_decode($this->serializer->serialize($entity, 'json'), TRUE);
    $json['field_test'][0]['data'] = 'string data';
    $serialized = json_encode($json, TRUE);
    $this->setExpectedException(\LogicException::class, 'The generic FieldItemNormalizer cannot denormalize string values for "data" properties of the "field_test" field (field item class: Drupal\video\Plugin\Field\FieldType\VideoItem).');
    $this->serializer->deserialize($serialized, EntityTest::class, 'json');
  }

}
