#!/bin/bash

# Start hub db
docker run -d --name hub-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=hubdb -e MYSQL_USER=hubdb_user -e MYSQL_PASSWORD=hubdb_pass -p 3306:3306 -v /data/hub-db:/var/lib/mysql mojdigitalstudio/digital-hub-db

# Start hub backend
docker run -d --name hub-be --link hub-db -e HUB_DB_ENV_MYSQL_DATABASE=hubdb -e HUB_DB_ENV_MYSQL_USER=hubdb_user -e HUB_DB_ENV_MYSQL_PASSWORD=hubdb_pass -e HUB_DB_PORT_3306_TCP_ADDR=hub-db -e HUB_EXT_FILE_URL=http://localhost:8183/sites/default/files -e PHP_MEMORY_LIMIT=256M -e PHP_UPLOAD_MAX_FILE_SIZE=256M -e PHP_POST_MAX_SIZE=256M -v $(pwd)/sites/default/files:/var/www/html/sites/default/files/ -p 8183:80 --name hub-be mojdigitalstudio/digital-hub-be
99bb4ad8d491ab4a022f8ae1d704a0f31204b028f596d928eb6fdb834fa89292

# Start hub frontend
docker run -d --name hub-fe --link hub-be -e API_URI=http://hub-be/ -p 8181:80 mojdigitalstudio/digital-hub-fe

# Start memcached
docker run -d --name hub-memcache memcached

