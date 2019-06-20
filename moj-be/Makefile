build-deps:
	composer install --ignore-platform-reqs

build:
	docker build -t digital-hub-be .

build-api-docs:
	vendor/zircote/swagger-php/bin/swagger modules/custom/moj_resources -o ../moj-api-docs/config

clean:
	rm -rf vendor

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker tag digital-hub-be mojdigitalstudio/digital-hub-be:build-$(CIRCLE_BUILD_NUM)
	docker tag digital-hub-be mojdigitalstudio/digital-hub-be:latest
	docker push mojdigitalstudio/digital-hub-be:build-$(CIRCLE_BUILD_NUM)
	docker push mojdigitalstudio/digital-hub-be:latest
