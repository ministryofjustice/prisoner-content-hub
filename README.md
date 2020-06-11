# Digital Hub for Prisons

[![CircleCI](https://circleci.com/gh/ministryofjustice/digital-hub/tree/master.svg?style=svg)](https://circleci.com/gh/ministryofjustice/digital-hub/tree/master)

This is a mono-repo of the following projects

    moj-be/ - Backend service using a customized Drupal instance
    moj-node/ - Frontend NodeJS service
    moj-matomo/ - Matomo analytics

Together these make the Digital Hub for prisons service.

# Run the Digital Hub locally

## Prerequisites
The following software is required

    Docker
    CMake
    Node v12
    Composer

## Initial config

Local database credentials can be configured using environment files. On the first run, the database will be created with the master password, user credentials and database set in environment variables. After this point the environment variables must reflect the state of the database (i.e. changing the password here will not update the MariaDB container)

Copy the following files and update anything you'd like to customise:

```
cp hub-be.env.sample hub-be.env
cp hub-db.env.sample hub-db.env
```

## Starting the service

Pull the latest version of the service

    docker-compose pull

To start the service

    docker-compose up hub-be hub-fe

You can then visit the service locally on http://localhost:10001, with the Drupal backend exposed on http://localhost:11001

## Using Docker-Compose for development

The development version of the Digital-Hub makes use of additional Docker-Compose configuration that mounts volumes on the host machine.

Pull the dependencies for both the frontend and backend projects

    cd moj-node && make build-deps && cd ..
    cd moj-be && make build-deps && cd ..

Start the service

    docker-compose -f docker-compose.yml -f docker-compose-override.yml up hub-be hub-fe

## Notes

All Docker Images are pushed to the Docker Hub organisation here https://hub.docker.com/u/mojdigitalstudio/ with the exception of Matomo which is pushed to a private registry in Azure

If you have Homebrew installed you can run the following in the root of the repository

    brew bundle

This will install all of the packages you will need to do development on the project or you can inspect the Brewfile in the root and see what packages you will need

# Contributing to the project

If you wish to work on the Digital Hub to provide more content types or features, contributions are welcome

Clone the repo

    git@github.com:ministryofjustice/digital-hub.git

Create a feature branch

    git checkout -b feature/your-new-feature

Commit and push your changes and raise a Pull Request
