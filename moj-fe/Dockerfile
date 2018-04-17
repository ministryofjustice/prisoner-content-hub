FROM composer as composer
RUN mkdir -p /composer
COPY . /composer
WORKDIR /composer
RUN composer install
RUN composer run-script post-root-package-install
RUN composer run-script post-create-project-cmd

FROM node:8-stretch as node
RUN mkdir -p /node
COPY --from=composer /composer /node
WORKDIR /node
#RUN apt-get update && apt-get install -y libsass-dev
RUN mkdir -p node_modules
RUN npm install gulp snyk 
RUN /node/node_modules/gulp/bin/gulp.js

RUN npm run prod
RUN npm run snyk-protect

FROM php:5.6-apache
#Apache configuraton
RUN a2enmod rewrite
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod headers
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
#PHP configuration
RUN apt-get update && apt-get upgrade -y && apt-get install libpng-dev libmemcached-dev zlib1g-dev curl -y
#RUN pecl install memcached
#RUN docker-php-ext-enable memcached
#Copy the app and set permissions
RUN mkdir /var/www/hub
COPY --from=node /node /var/www/hub/
RUN ls -lathr /var/www/hub
RUN chown -R www-data:www-data /var/www/hub/public
RUN chown -R www-data:www-data /var/www/hub/bootstrap
RUN chown -R www-data:www-data /var/www/hub/app
RUN chown -R www-data:www-data /var/www/hub/config
RUN chown -R www-data:www-data /var/www/hub/resources
RUN chown -R www-data:www-data /var/www/hub/storage
RUN chown -R www-data:www-data /var/www/hub/server.php
RUN chown www-data:www-data /var/www/hub