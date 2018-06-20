#!/bin/bash

# Component is the Docker container to rebuild: hub-db,hub-be,hub-fe or hub-memcached
# Site is the name of the website as specificed by it's FQDN e.g. bwi for Berwyn, wli for Wayland
component=$1
site=$2

RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$component" ]
then
printf "${RED}Please provide a component e.g. hub-db,hub-be,hub-fe or hub-memcache.${NC}\n"
exit 1
fi

function hub_db {
  docker run -d --name hub-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hubdb \
  -e MYSQL_USER=hubdb_user \
  -e MYSQL_PASSWORD=hubdb_pass \
  -p 3306:3306 \
  -v /tmp/data/hub-db:/var/lib/mysql mojdigitalstudio/digital-hub-db
}

function hub_memcache {
  docker run -d --name hub-memcache memcached
}

function hub_be {

  if [ ! "$(docker ps -a | grep hub-db)" ]
  then
  hub_db
  fi

  if [ ! "$(docker ps -a | grep hub-memcache)" ]
  then
  hub_memcache
  fi

  docker run -d --name hub-be \
  --link hub-db --link hub-memcache \
   -e HUB_DB_ENV_MYSQL_DATABASE=hubdb \
   -e HUB_DB_ENV_MYSQL_USER=hubdb_user \
   -e HUB_DB_ENV_MYSQL_PASSWORD=hubdb_pass \
   -e HUB_DB_PORT_3306_TCP_ADDR=hub-db \
   -e HUB_EXT_FILE_URL=http://digital-hub.$1.dpn.gov.uk:11001/sites/default/files \
   -e PHP_MEMORY_LIMIT=256M \
   -e PHP_UPLOAD_MAX_FILE_SIZE=256M \
   -e PHP_POST_MAX_SIZE=256M \
   -v /tmp/content/moj_dhub_prod001_app/usr/share/nginx/html/moj_be/sites/default/files:/var/www/html/sites/default/files/ \
   -p 11001:80 mojdigitalstudio/digital-hub-be
}

# Start hub db
if [ $component == "hub-db" ]
then
docker stop hub-db
docker rm hub-db
hub_db
fi


# Start hub backend
if [ $component == "hub-be" ]
then

  if [ -z "$site" ]
  then
  printf "${RED}Please provide a site as the 2nd argument e.g. bwi or wli.${NC}\n"
  exit 1
  fi

docker stop hub-be
docker rm hub-be
hub_be

fi


# Start hub frontend
if [ $component == "hub-fe" ]
then

  if [ ! "$(docker ps -a | grep hub-be)" ]
  then
  hub_be
  fi

docker stop hub-fe
docker rm hub-fe
docker run -d --name hub-fe \
--link hub-be \
-e API_URI=http://hub-be/ \
-p 10001:80 mojdigitalstudio/digital-hub-fe
fi

# Start memcached
if [ $component == "hub-memcache" ]
then
docker stop hub-memcache
docker rm hub-memcache
hub_memcache
fi
