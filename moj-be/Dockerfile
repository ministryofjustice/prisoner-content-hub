FROM php:5-apache
RUN apt-get update && apt-get install libpng-dev -y
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
COPY . /var/www/html/
