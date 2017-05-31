FROM php:7-apache
RUN apt-get update && apt-get upgrade -y && apt-get install libpng-dev libmemcached-dev zlib1g-dev libfreetype6-dev libjpeg62-turbo-dev -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir
RUN docker-php-ext-install gd
RUN pecl install memcached
RUN docker-php-ext-enable memcached
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
COPY . /var/www/html/
