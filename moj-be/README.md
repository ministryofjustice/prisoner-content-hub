Digital Hub backend
===================

This is the digital hub backend that uses Drupal

Docker
------

To run the Hub database run the following

    docker run --name hub-db -v /path/of/dump:/docker-entrypoint-initdb.d -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=hubdb -d mariadb

Change password to something useful.

Change /path/of/dump to a full path where you have the development database dump
