build-deps:
#	composer install

build: build-deps
	docker build -t mojdigitalstudio/digital-hub-be .

clean:
	rm -rf vendor

push:
	@docker login -u $(DOCKER_HUB_USER) -p $(DOCKER_HUB_PASS) 
	docker push mojdigitalstudio/digital-hub-be

test:
	cd core && ../vendor/bin/phpunit --testsuite=unit && cd ..

upgrade:
	docker-compose run hub-drush pm-update
	docker-compose run hub-drush updatedb
	docker-compose run hub-drush cr
