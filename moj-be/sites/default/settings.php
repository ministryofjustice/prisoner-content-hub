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
 * Public file base URL:
 *
 * An alternative base URL to be used for serving public files. This must
 * include any leading directory path.
 *
 * A different value from the domain used by Drupal to be used for accessing
 * public files. This can be used for a simple CDN integration, or to improve
 * security by serving user-uploaded files from a different domain or subdomain
 * pointing to the same server. Do not include a trailing slash.
 */

$settings['file_public_base_url'] = getenv('HUB_EXT_FILE_URL', true);

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
  'username' => getenv('HUB_DB_ENV_MYSQL_USER', true),
  'password' => getenv('HUB_DB_ENV_MYSQL_PASSWORD', true),
  'prefix' => '',
  'host' => getenv('HUB_DB_PORT_3306_TCP_ADDR', true),
  'port' => getenv('HUB_DB_PORT_3306_TCP_PORT', true),
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
$settings['install_profile'] = 'standard';
$config_directories['sync'] = 'sites/default/files/config/sync';

/**
 * Load local development override configuration, if available.
 *
 * Use settings.local.php to override variables on secondary (staging,
 * development, etc) installations of this site. Typically used to disable
 * caching, JavaScript/CSS compression, re-routing of outgoing emails, and
 * other things that should not happen on development and testing sites.
 *
 * Keep this code block at the end of this file to take full effect.
 */

 if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
