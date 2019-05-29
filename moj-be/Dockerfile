FROM drupal:8.7-apache

RUN apt-get update && apt-get install curl && apt-get install git-core -y

RUN curl -s https://getcomposer.org/installer | php

RUN mv composer.phar /usr/local/bin/composer

RUN echo "date.timezone = Europe/London" > /usr/local/etc/php/conf.d/timezone_set.ini

RUN groupmod -g 80 www-data # temporary workaround to facilitate the uid used in the shared filesystem in berwyn
RUN usermod -u 80 www-data

RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/

COPY ./modules /var/www/html/modules
COPY ./profiles /var/www/html/profiles
COPY ./sites /var/www/html/sites

RUN chown -R www-data:www-data /var/www/html/sites /var/www/html/modules /var/www/html/themes

RUN composer require mhor/php-mediainfo
