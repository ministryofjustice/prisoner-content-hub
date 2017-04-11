FROM php:5-apache
#Apache configuraton
RUN a2enmod rewrite
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
#Copy the app and set permissions
RUN mkdir /var/www/hub
COPY . /var/www/hub/
RUN chown -R www-data:www-data /var/www/hub/
