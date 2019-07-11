#!/bin/sh

./console cache:clear
./console plugin:activate EnvironmentVariables
./console plugin:activate AbTesting
./console plugin:activate CustomReports
./console plugin:activate Funnels
./console plugin:activate HeatmapSessionRecording
./console plugin:activate MediaAnalytics
./console plugin:activate MultiChannelConversionAttribution
./console plugin:activate UsersFlow

chown -R www-data /var/www/html
