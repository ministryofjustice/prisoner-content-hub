Digital Hub for Prisons
=======================

This repo contains two directories.

moj-be/ - Backend CMS based on Drupal
moj-fe/ - Frontend based on Laravel

Together these make the Digital Hub service for prisons.

Docker Compose
--------------

The Docker compose file in this repo should provide a fully working system.

To use this you will need a development database dump which you can get from
Rob Lazzurs or Steve Wilson. This will be fixed shortly to remove data from the
structure of the dump so it can be checked in.

The dump should end in .sql and be in a directory called db_dump in the root
of this repo.

You will also need recent builds of the containers in your local registry as
these are not published yet. Instructions on building containers are in each
subdirectory of this repo. 

Then run

    docker-compose up

Dev version
-----------

To use the dev version of docker compose all of the above instructions apply
but you need to change the command to the following.

    docker-compose -f docker-compose-dev.yml up
