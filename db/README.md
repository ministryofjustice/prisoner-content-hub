Database container
==================

This directory contains a simple DB container that can be used for development.

This uses the standard MariaDB container and then pushes one file into the container that is a database dump. The current DB dump in the repo is a sample structure used for the digital hub.

Update the dump
---------------

To update the database dump you will need

- A copy of the repo
- A running version of the app with docker compose
- The MySQL cli tools

From this db directory run the following command

    make update-dump

This will update the dump file in the dump directory which when pushed to GitHub will cause a new development database container to be built.
