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

Then run

    docker-compose up
