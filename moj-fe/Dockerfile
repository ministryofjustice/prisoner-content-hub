FROM php:7-apache
#Apache configuraton
RUN a2enmod rewrite
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
#PHP configuration
RUN apt-get update && apt-get upgrade -y && apt-get install libpng-dev libmemcached-dev zlib1g-dev -y
RUN pecl install memcached
RUN docker-php-ext-enable memcached
#Copy the app and set permissions
RUN mkdir /var/www/hub
COPY . /var/www/hub/
RUN chown -R www-data:www-data /var/www/hub/public
RUN chown -R www-data:www-data /var/www/hub/bootstrap
RUN chown -R www-data:www-data /var/www/hub/app
RUN chown -R www-data:www-data /var/www/hub/config
RUN chown -R www-data:www-data /var/www/hub/resources
RUN chown -R www-data:www-data /var/www/hub/storage
RUN chown -R www-data:www-data /var/www/hub/server.php
RUN chown www-data:www-data /var/www/hub
