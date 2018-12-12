FROM composer:1.6 as composer
RUN mkdir -p /composer
COPY . /composer
WORKDIR /composer
RUN composer install
RUN composer run-script post-root-package-install
RUN composer run-script post-create-project-cmd

FROM node:8-stretch as node
RUN mkdir -p /node
COPY --from=composer /composer /node
WORKDIR /node
RUN apt-get update && apt-get install -y libsass-dev
RUN npm install
RUN npm run prod
RUN npm run snyk-protect

FROM php:7-fpm-stretch
RUN apt-get update && apt-get install -y supervisor nginx-full
RUN mkdir -p /app
COPY --from=node /node /app
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY fpm.conf /usr/local/etc/php-fpm.d/www.conf
RUN chown -R www-data:www-data /app
CMD ["/usr/bin/supervisord"]
EXPOSE 80/tcp