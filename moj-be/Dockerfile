FROM php:7-apache
RUN apt-get update && apt-get upgrade -y && apt-get install libpng-dev libmemcached-dev zlib1g-dev -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
RUN pecl install memcached
RUN docker-php-ext-enable memcached
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
COPY . /var/www/html/
