# -*- mode: ruby -*-
# vi: set ft=ruby :

DB_IP = "192.168.33.11"
DB_HOST = "moj-be-db"
DB_NAME = "d8_moj"
DB_USER = "d8_moj"
DB_PASS = "moj_password"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.define :laravel do |laravel|
    laravel.vm.network "private_network", ip: "192.168.33.7"

    laravel.vm.synced_folder ".", "/var/www/laravel", owner: "www-data", group: "www-data"
      # type: "rsync",
      # rsync__auto: true,
      # rsync__verbose: true,
      # rsync__exclude: ['.git/']

    laravel.vm.provider "virtualbox" do |vb|
      vb.name = "Vagrant - moj-fe.dev"
      vb.memory = "1024"

      vb.customize [
        "modifyvm", :id,
        "--groups", "/MoJ",
      ]
    end

    laravel.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y apache2 mysql-client php5 php5-mysql php5-gd php5-curl php5-xdebug

      sudo a2enmod rewrite

      sudo rm /etc/apache2/sites-available/000-default.conf

      sudo echo "<VirtualHost *:80>" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	ServerAdmin webmaster@localhost" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	DocumentRoot /var/www/laravel/public" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	ErrorLog \${APACHE_LOG_DIR}/error.log" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	CustomLog \${APACHE_LOG_DIR}/access.log combined" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	<Directory /var/www/>" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "		Options Indexes FollowSymLinks MultiViews" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "		AllowOverride All" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "		Order allow,deny" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "		allow from all" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "	</Directory>" >> /etc/apache2/sites-available/000-default.conf
      sudo echo "</VirtualHost>" >> /etc/apache2/sites-available/000-default.conf

      sudo service apache2 restart

      echo "#{DB_IP}    #{DB_HOST}" | sudo tee --append /etc/hosts > /dev/null

      sudo sed -i 's/post_max_size = [[:digit:]]\+M/post_max_size = 512M/' /etc/php5/apache2/php.ini
      sudo sed -i 's/upload_max_filesize = [[:digit:]]\+M/upload_max_filesize = 512M/' /etc/php5/apache2/php.ini

      ! ls /usr/local/bin | grep "composer" \
        && wget https://getcomposer.org/installer \
        && php installer \
        && rm installer \
        && sudo mv composer.phar /usr/local/bin/composer

      cd /var/www/laravel
      composer update && composer install
    SHELL
  end
end
