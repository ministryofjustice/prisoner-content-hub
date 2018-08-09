FROM composer:1.6 as composer
RUN mkdir -p /composer
WORKDIR /composer
COPY . /composer
RUN composer install --ignore-platform-reqs

FROM php:5.6-apache as build
RUN apt-get update && apt-get upgrade -y && apt-get install vim unzip libpng-dev libmemcached-dev zlib1g-dev libfreetype6-dev libjpeg62-turbo-dev mediainfo git -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir
RUN docker-php-ext-install gd
RUN pecl install xdebug-2.5.5 && docker-php-ext-enable xdebug
RUN echo 'zend_extension="/usr/local/lib/php/extensions/no-debug-non-zts-20151012/xdebug.so"' >> /usr/local/etc/php/php.ini
RUN echo 'xdebug.remote_port=9000' >> /usr/local/etc/php/php.ini
RUN echo 'xdebug.remote_enable=1' >> /usr/local/etc/php/php.ini
RUN echo 'xdebug.remote_connect_back=1' >> /usr/local/etc/php/php.ini

#RUN composer update
#RUN pecl install memcached
#RUN docker-php-ext-enable memcached
RUN echo "date.timezone = Europe/London" > /usr/local/etc/php/conf.d/timezone_set.ini
RUN groupmod -g 80 www-data # temporary workaround to facilitate the uid used in the shared filesystem in berwyn
RUN usermod -u 80 www-data
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
COPY --from=composer /composer /var/www/html
