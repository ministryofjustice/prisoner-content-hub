all: build

docker-clean: docker-stop
	docker ps -a | awk '{print $$1}' | grep -v CONTAINER | xargs docker rm 

docker-stop:
	docker ps -a | awk '{print $$1}' | grep -v CONTAINER | xargs docker stop

build:
	cd moj-fe ; make build
	cd moj-be ; make build
	cd db ; make build
