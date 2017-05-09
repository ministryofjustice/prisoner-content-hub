FROM php:7-apache
RUN apt-get update && apt-get install libpng-dev -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
COPY . /var/www/html/
