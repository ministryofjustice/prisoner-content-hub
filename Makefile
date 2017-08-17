all: build

docker-clean: docker-stop
	docker ps -a | awk '{print $$1}' | grep -v CONTAINER | xargs docker rm 

docker-stop:
	docker ps -a | awk '{print $$1}' | grep -v CONTAINER | xargs docker stop

prod-up:
	git pull
	docker pull mojdigitalstudio/digital-hub-fe
	docker pull mojdigitalstudio/digital-hub-be
	docker pull mojdigitalstudio/digital-hub-db
	docker-compose -f docker-compose-prod.yml up -d

dev-up:
	docker-compose up

build:
	cd moj-fe ; make build
	cd moj-be ; make build
	cd db ; make build
