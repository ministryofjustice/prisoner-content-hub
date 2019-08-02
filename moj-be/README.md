# Digital Hub Backend

The backend CMS for the Digital Hub service using Drupal

## Getting started

### Prerequisites

    Composer
    Docker

### Install dependencies

    composer clear-cache && \
    composer install --no-dev --no-ansi --no-scripts --prefer-dist --ignore-platform-reqs --no-interaction --no-autoloader

### Running the application

Being a PHP/Drupal application, there is a requirement for Apache to be set up and configured.
The simplest way of setting up the application for development is using Docker-Compose and the provided overrides to mount a volume on the host machine

### Custom Modules

The application is built using Docker, using a Drupal base image.

All custom code specific to the Digital Hub project is implemented as Drupal modules, these are located in

    ./modules/custom

## Restoring a database dump

### Prerequisites
    Docker

### Apply dump to hub_db in Docker

    docker exec -i hub-db mysql -u <DB_USER> --password=<DB_PASS> hubdb < ~/path/to/dump.sql

### Apply dump to hub_db in Kubernetes

    kubectl exec -it <POD_ID> -c mysql -- mysql -u <DB_USER> --password=<DB_PASS> < cat ~/path/to/dump.sql

### Character encoding

You can manually specify the encoding type when importing

    --default-character-set=<ENC_TYPE>
