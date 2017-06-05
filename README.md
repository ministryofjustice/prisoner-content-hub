Digital Hub for Prisons
=======================

This repo contains two directories.

    moj-be/ - Backend CMS based on Drupal
    moj-fe/ - Frontend based on Laravel

Together these make the Digital Hub for prisons service.

Build status

[![CircleCI](https://circleci.com/gh/noms-digital-studio/digital-hub.svg?style=svg)](https://circleci.com/gh/noms-digital-studio/digital-hub)

Run a local version of the Digital Hub
--------------------------------------

To run a local version of the Digital Hub you will require Docker installed and if you are using macOS we recommend Docker Edge.

The Docker Compose file in this repo should provide a fully working system.

The base containers are now published in our Docker Hub organisation here https://hub.docker.com/u/mojdigitalstudio/. If you wish to see a working version run

     docker-compose up

You can then visit the local version on http://localhost:8181 and the Drupal backend on http://localhost:8182

Edit code and provide new features
----------------------------------

If you wish to work on the Digital Hub to provide more content types or features pull requests are welcome.

To build either the Laravel frontend container or Drupal backend container change into the relevant directory and run

    make build

### Drush

Drush is provided in a Docker container as part of the Docker Compose configuration. To run Drush

    docker-compose run hub-drush

For example if you wanted to run the clear cache command

    docker-compose run hub-drush cc

or reset the admin password for Drupal

    docker-compose run hub-drush upwd --password="newpassword" "admin"

### Drupal CLI

The new Drupal CLI is also provided as a Docker container as part of the Docker Compose configuration. To run the Drupal CLI

    docker-compose run hub-drupal


Run a live version of the Digital Hub
-------------------------------------

We have separated out the Docker Compose file for running a live version of the Digital Hub for now.

To run this version run the following command

    docker-compose -f docker-compose-prod.yml up
