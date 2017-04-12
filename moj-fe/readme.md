# Ministry of Justice Content Platform Frontend

## License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)..

## Vagrant

The Vagrant box included in this directory is not currently working as planned. WIP.

## Docker

The Docker container can be build with the following command

    make build
    docker run -d -p 8181:80 -e API_URI=http://10.10.10.10/ --name moj-fe-test moj-fe

  API_URI can be left unset if using the current Vagrant box for the backend Drupal instance.
