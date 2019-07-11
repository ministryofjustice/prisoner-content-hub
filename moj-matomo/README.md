# Hub Matomo

## Getting started

### Requirements

- Docker
- Make

### Pull dependencies

`MATOMO_ACCESS_TOKEN={{ACCESS TOKEN}} make build-deps`

### Build image

`make build`

### Clean workspace

`make clean`

### Enable Plugins

Get the Docker container ID for Matomo

`docker ps`

To run the enable-plugins script
(Note. this step requires that the manual Matomo setup to have been completed)

`docker exec {{CONTAINER_ID}} /enable-plugins.sh`
