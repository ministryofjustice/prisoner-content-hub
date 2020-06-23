# Prisoner Content Hub

The Prisoner Content Hub is a platform for prisoners to access data, content and services supporting individual progression and freeing up staff time.

This repository contains shared modules & utility scripts for the Prisoner Content Hub. Related projects are tagged with the `prisoner-content-hub` topic, which populates [this list](https://github.com/topics/prisoner-content-hub).

In particular, this repo supports development of two major components of the Prisoner Content Hub:

- [Prisoner Content Hub Drupal CMS](https://github.com/ministryofjustice/prisoner-content-hub-backend)
- [Prisoner Content Hub frontend](https://github.com/ministryofjustice/prisoner-content-hub-frontend)

## Prerequisites

- Docker
- Docker Compose

You can get both of these dependencies on OSX with [Docker for Mac](https://docs.docker.com/docker-for-mac/). 

To develop the Node [frontend](https://github.com/ministryofjustice/prisoner-content-hub-frontend) locally you might also want:

- NVM

If you're using Homebrew, install all dependencies with our `Brewfile`:

```
brew bundle
```

## Getting started

The Docker Compose scripts tie together the CMS and frontend components. To do this, it assumes they exist alongside this repository, i.e.

```
  │
  ├── digital-hub (this repository)
  ├── prisoner-content-hub-backend
  └── prisoner-content-hub-frontend
```

### Initial configuration

Local database credentials can be configured using environment files. On the first run, the database will be created with the master password, user credentials and database set in environment variables. After this point the environment variables must reflect the state of the database (i.e. changing the password here will not update the MariaDB container)

Copy the following files and update anything you'd like to customise:

```
cp drupal.env.sample drupal.env
cp drupal-db.env.sample drupal-db.env
cp hub-frontend.env.sample hub-frontend.env
```

### Running the services:

Start all the services with:

>`-d` starts the services up in the background

```
docker-compose up -d 
```

Once all the services have started, you can access them at:

- Drupal CMS: http://localhost:11001
- Content Hub frontend: http://localhost:10001


## Using Docker-Compose for development

The Docker Compose setup has a default override which:

1. Mounts local files into the containers to enable local development changes to be reflected in the running containers.
2. Sets the build context, so local Docker containers can be built and used in the Docker Compose setup.

These overrides are specified in [docker-compose.override.yml](docker-compose.override.yml).

To run the services _without_ the default overrides, you can explicitly load _just_ the `docker-compose.yml` using `-f docker-compose.yml`, e.g.:

```
docker-compose -f docker-compose.yml up -d
```

### Seeding the database

When starting from a clean environment, you can seed the database automagically by placing scripts in [drupal-db/docker-entrypoint-initdb.d/](drupal-db/docker-entrypoint-initdb.d/).

> Scripts in `drupal-db/docker-entrypoint-initdb.d/` will only be run when the database hasn't been initialised, so it won't overwrite an existing setup.

As an example, you could create two files:

1. `drupal-db/docker-entrypoint-initdb.d/01_hub_export-05-14-2020.sql`. This is a standard DB dump of one of our environments.
2. `drupal-db/docker-entrypoint-initdb.d/02_update_hubdb_user_password.sql`. This could be something like:

```sql
USE hubdb;

# This is only used in dev. Set the admin user's password to samplePassw0rd
UPDATE users_field_data SET pass = '$S$5hl6lkBI2ScuUML4W0uvqL0gZ4hu5N7fH1xgdIc0YcXzBoyQkW3E' WHERE uid =1;
DELETE FROM cache_entity WHERE cid = 'values:user:1';
```

If you want to pick another development password, [this page](https://www.useotools.com/drupal-password-hash-generator/output) will generate the appropriate hash. __Don't use this site with production/staging passwords__

### Clearing the database

The MariaDB and ElasticSearch services are backed by persistent volumes. These can be removed to give you a clean environment with:

```
docker-compose down --volumes
```

## Docker images

Custom Docker images are hosted in the [MoJ Docker Hub organisation](https://hub.docker.com/u/mojdigitalstudio/).

# Contributing to the project

Contributions to the Prisoner Content Hub to provide more content types or features are welcome. To propose a change: 

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-new-feature`
3. Commit and push your changes and raise a Pull Request
