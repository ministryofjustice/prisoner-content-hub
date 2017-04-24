FROM php:5-apache
#RUN apt-get -y install mysql-client
RUN docker-php-ext-install pdo_mysql
COPY . /var/www/html/
