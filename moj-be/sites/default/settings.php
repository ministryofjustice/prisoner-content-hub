<?php

/**
 * Example development configuration file
 *
 * This should only be used for development, any testing or production instances should replace this file for now.
 *
 */

$databases = array();

$config_directories = array();

$settings['hash_salt'] = 'TDVdRVDjXzm2ASUFPQ2rVUys-wiXvnYar9n2CWrQXefT1Hc3pLOhDC0lPtgLQcfoPViNEwWo3g';

/**
 * Access control for update.php script.
 *
 * If you are updating your Drupal installation using the update.php script but
 * are not logged in using either an account with the "Administer software
 * updates" permission or the site maintenance account (the account that was
 * created during installation), you will need to modify the access check
 * statement below. Change the FALSE to a TRUE to disable the access check.
 * After finishing the upgrade, be sure to open this file again and change the
 * TRUE back to a FALSE!
 */
$settings['update_free_access'] = FALSE;

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';

/**
 * The default list of directories that will be ignored by Drupal's file API.
 *
 * By default ignore node_modules and bower_components folders to avoid issues
 * with common frontend tools and recursive scanning of directories looking for
 * extensions.
 *
 * @see file_scan_directory()
 * @see \Drupal\Core\Extension\ExtensionDiscovery::scanDirectory()
 */
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

$databases['default']['default'] = array (
  'database' => getenv('HUB_DB_ENV_MYSQL_DATABASE', true),
  'username' => getenv('HUB_DB_ENV_MYSQL_USER', true),'root',
  'password' => getenv('HUB_DB_ENV_MYSQL_PASSWORD', true),
  'prefix' => '',
  'host' => getenv('HUB_DB_PORT_3306_TCP_ADDR', true),
  'port' => getenv('HUB_DB_PORT_3306_TCP_PORT', true),
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
$settings['install_profile'] = 'standard';
$config_directories['sync'] = 'sites/default/files/config_hiCPrEmil_qKiitQisXUTzuqIRyQ3XD22dkInQgVVs0y0f2CqkOyIZnMr-TN6SHtQFIiGBpNYw/sync';
