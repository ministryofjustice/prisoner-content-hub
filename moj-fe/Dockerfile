FROM php:5-apache
#Apache configuraton
RUN a2enmod rewrite
RUN rm -f /etc/apache2/sites-enabled/*
COPY ./apache/* /etc/apache2/sites-enabled/
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
