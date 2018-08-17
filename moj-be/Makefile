build-deps:
	composer install --ignore-platform-reqs

build: 
	docker build -t mojdigitalstudio/digital-hub-be .

build-api-docs:
	vendor/zircote/swagger-php/bin/swagger modules/custom/moj_resources
	
clean:
	rm -rf vendor

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD) 
	docker push mojdigitalstudio/digital-hub-be

test:
	cd core && ../vendor/bin/phpunit --testsuite=unit && cd ..

upgrade:
	docker-compose run hub-drush pm-update
	docker-compose run hub-drush updatedb
	docker-compose run hub-drush cr
