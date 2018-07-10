Digital Hub for Prisons
========================

[![CircleCI](https://circleci.com/gh/ministryofjustice/digital-hub/tree/master.svg?style=svg)](https://circleci.com/gh/ministryofjustice/digital-hub/tree/master)

This repo contains two directories.

    moj-be/ - Backend CMS based on Drupal
    moj-fe/ - Frontend based on Laravel

Together these make the Digital Hub for prisons service.

Run a local version of the Digital Hub
--------------------------------------

To run a local version of the Digital Hub you will require Docker installed and if you are using macOS we recommend Docker Edge.

The Docker Compose file in this repo should provide a fully working system.

As the development version is designed to mount your local directory to allow live editing of the code you will need to install the dependencies. To do this run the following commands.

    cd moj-fe && make build-deps && cd ..
    cd moj-be && make build-deps && cd ..

The base containers are now published in our Docker Hub organisation here https://hub.docker.com/u/mojdigitalstudio/. If you wish to see a working version run

     docker-compose up

You can then visit the local version on http://localhost:8181 and the Drupal backend on http://localhost:8182

You will need to change the Drupal admin password to login which you can do with

    docker-compose run hub-drush upwd --password="newpassword" "admin"

Edit code and provide new features
----------------------------------

If you wish to work on the Digital Hub to provide more content types or features pull requests are welcome.

If you are on macOS and have Homebrew installed you will need to run the following in the root of the repo

    brew bundle

This will install all of the packages you will need to do development on the project or you can inspect the Brewfile in the root and see what packages you will need.

To build either the Laravel frontend container or Drupal backend container change into the relevant directory and run

    make build

### Drush

Drush is provided in a Docker container as part of the Docker Compose configuration. To run Drush

    docker-compose run hub-drush

For example if you wanted to run the clear cache command

    docker-compose run hub-drush cc

### Drupal CLI

The new Drupal CLI is also provided as a Docker container as part of the Docker Compose configuration. To run the Drupal CLI

    docker-compose run hub-drupal


Run a live version of the Digital Hub
-------------------------------------

Due to version incompatibilities with docker compose, we use a shell script to run in live, see `docker-decomposed.sh` for details.
