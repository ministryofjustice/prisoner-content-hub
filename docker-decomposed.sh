#!/bin/bash

# For deploying docker containers, including linked containers,
# where docker compose is not available.

# Component is the Docker container to rebuild:
# hub-db, hub-be, hub-fe or hub-memcached

component=$1

RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$MYSQL_ROOT_PASSWORD" ] || \
  [ -z "$MYSQL_USER" ] || \
  [ -z "$MYSQL_PASSWORD" ] || \
  [ -z "$PIWIK_URI" ] || \
  [ -z "$DRUPAL_URL" ]
then
  printf "${RED}Please set the following environment variables:\n"
  printf "MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD, PIWIK_URI, DRUPAL_URL.${NC}\n"
  exit 1
fi

# Grab some image names that are using the date suffix
node_image=$(docker ps --filter "name=hub-node-" --format "{{.Names}}")
be_image=$(docker ps --filter "name=hub-be-" --format "{{.Names}}")
db_image=$(docker ps --filter "name=hub-db-" --format "{{.Names}}")
matomo_image=$(docker ps --filter "name=hub-matomo-" --format "{{.Names}}")
matomo_db_image=$(docker ps --filter "name=hub-matomo-db-" --format "{{.Names}}")

# Start hub db
hub_db() {
  printf "Stopping " && docker stop ${db_image}
  printf "Removing " && docker rm ${db_image}
  printf "Starting $component"
  docker run -d --name hub-db-$(date +%Y%m%d) \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=hubdb \
  -e MYSQL_USER=$MYSQL_USER \
  -e MYSQL_PASSWORD=$MYSQL_PASSWORD \
  -p 3307:3306 \
  -v /data/hub-db:/var/lib/mysql \
  --restart always \
  mojdigitalstudio/digital-hub-db
}

hub_be() {
  docker_code_volume=""

  printf "Stopping " && docker stop ${be_image}
  printf "Removing " && docker rm ${be_image}
  # Flag to export code volume for use by other containers
  if [ -n "$DOCKER_CODE_VOLUME" ]; then
    docker_code_volume="-v hub_be_code:/var/www/html"
    printf "Clearing volume " && docker volume rm hub_be_code
  fi


  docker run -d --name hub-be-$(date +%Y%m%d) \
  --link $(db_image) --link hub-memcache \
  -e HUB_DB_ENV_MYSQL_DATABASE=hubdb \
  -e HUB_DB_ENV_MYSQL_USER=$MYSQL_USER \
  -e HUB_DB_ENV_MYSQL_PASSWORD=$MYSQL_PASSWORD \
  -e HUB_DB_PORT_3306_TCP_ADDR=hub-db \
  -e HUB_EXT_FILE_URL=$DRUPAL_URL/sites/default/files \
  -e PHP_MEMORY_LIMIT=256M \
  -e PHP_UPLOAD_MAX_FILE_SIZE=256M \
  -e PHP_POST_MAX_SIZE=256M \
  -e PIWIK_URI=$PIWIK_URI \
  -v /content/moj_dhub_prod001_app/usr/share/nginx/html/moj_be/sites/default/files:/var/www/html/sites/default/files/ \
  $docker_code_volume \
  -p 11002:80 \
  --restart always \
  mojdigitalstudio/digital-hub-be
}

# hub-fe is no longer used and has been replaced by hub-node
hub_fe() {
  printf "Stopping " && docker stop hub-fe
  printf "Removing " && docker rm hub-fe
  docker run -d --name hub-fe \
  --link hub-be \
  -e API_URI=http://hub-be/ \
  -e PIWIK_URI=$PIWIK_URI \
  -p 10001:80 \
  --restart always \
  mojdigitalstudio/digital-hub-fe
}

hub_node() {
  printf "Stopping ${image}" && docker stop ${node_image}
  printf "Removing ${image}" && docker rm ${node_image}
  docker run -d --name hub-node-$(date +%Y%m%d) \
  --link $(be_image) \
  -e HUB_API_ENDPOINT=http://${be_image} \
  -e PIWIK_URI=$PIWIK_URI \
  -e APP_NAME=$APP_NAME \
  -e MATOMO_URL=$MATOMO_URL \
  -e NODE_ENV=production \
  -p 10002:3000 \
  --restart always \
  mojdigitalstudio/digital-hub-node
}

hub_memcache() {
  printf "Stopping " && docker stop hub-memcache
  printf "Removing " && docker rm hub-memcache
  docker run -d --name hub-memcache \
  --restart always \
  memcached
}

hub_matomo(i) {
  printf "Stopping " && docker stop ${hub_matomo_image}
  printf "Removing " && docker rm   ${hub_matomo_image}
  docker run -d --name hub-matomo-$(date +%Y%m%d) \
  --link ${matomo_db_image} \
  -p 12002:80 \
  -v /data/moj_dhub_matomo_config/:/var/www/html/config/ \
  --restart always \
  matomo:3-apache
}

hub_matomo_db() {
  printf "Stopping " && docker stop ${hub_matomo_db_image}
  printf "Removing " && docker rm   ${hub_matomo_db_image}
  docker run -d --name hub-matomo-db-$(data +%Y%m%d) \
  -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
  -e MYSQL_USER=${MYSQL_MATOMO_USER} \
  -e MYSQL_PASS=${MYSQL_MATOMO_PASS} \
  -e MYSQL_DATABASE=${MYSQL_MATOMO_DB} \
  -v /data/moj_dhub_matomo_db/var/lib/mysql/:/var/lib/mysql/ \
  --restart-always \
  mariadb
}

case $component in
hub-db)
  hub_db
  ;;
hub-be)
  hub_be
  ;;
hub-fe)
  hub_fe
  ;;
hub-node)
  hub_node
  ;;
hub-memcache)
  hub_memcache
  ;;
*)
  printf "${RED}Please provide a component [hub-db hub-be hub-fe hub-node hub-memcache]${NC}\n"
  exit 1
  ;;
esac
