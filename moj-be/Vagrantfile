# -*- mode: ruby -*-
# vi: set ft=ruby :

DB_HOST = "localhost"
DB_NAME = "scotchbox"
DB_USER = "root"
DB_PASS = "root"

$initDrupal = <<SCRIPT
cd /var/www/public
composer install
cd /opt/tests
composer install
SCRIPT

$initDrush = <<SCRIPT
cd
php -r "readfile('https://s3.amazonaws.com/files.drush.org/drush.phar');" > drush
php drush core-status
chmod +x drush
sudo mv drush /usr/local/bin
drush init -y
SCRIPT

$installDrupal = <<SCRIPT
cd /var/www/public
echo "Installing base Drupal"
drush si standard --db-url=mysql://#{DB_USER}:#{DB_PASS}@#{DB_HOST}/#{DB_NAME} \
--account-name=admin --account-pass=moj_password --site-name=OICSS -y
SCRIPT

$initTests = <<SCRIPT
cd /opt/tests
composer install
SCRIPT

Vagrant.configure(2) do |config|
  #
  # replaced with Scochbox VM...
  # it just works
  # more info and spec here
  # https://box.scotch.io
  #
  config.vm.box = "scotch/box"
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true
  config.vm.synced_folder ".", "/var/www/public", :nfs => { :mount_options => ["dmode=777","fmode=666"] }
  config.vm.synced_folder "./behat", "/opt/tests", owner: "vagrant", group: "vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.name = "Drupal 8 - Hub"
    vb.memory = "1024"
    vb.customize [
      "modifyvm", :id,
      "--groups", "/MoJ",
    ]
  config.vm.provision "shell", inline: $initDrush
  config.vm.provision "shell", inline: $initDrupal
  config.vm.provision "shell", inline: $installDrupal
  config.vm.provision "shell", inline: $initTests
  end
end
