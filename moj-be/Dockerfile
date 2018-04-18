FROM composer:1.6 as composer
RUN mkdir -p /composer
WORKDIR /composer
COPY . /composer
RUN composer install --ignore-platform-reqs

FROM php:5.6-apache as build
COPY --from=composer /composer /var/www/html
RUN apt-get update && apt-get upgrade -y && apt-get install unzip libpng-dev libmemcached-dev zlib1g-dev libfreetype6-dev libjpeg62-turbo-dev mediainfo git -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir
RUN docker-php-ext-install gd
#RUN composer update
#RUN pecl install memcached
#RUN docker-php-ext-enable memcached
RUN echo "date.timezone = Europe/London" > /usr/local/etc/php/conf.d/timezone_set.ini
RUN groupmod -g 80 www-data # temporary workaround to facilitate the uid used in the shared filesystem in berwyn
RUN usermod -u 80 www-data
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/