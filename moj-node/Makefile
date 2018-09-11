build-deps:
	npm install

build:
	docker build -t mojdigitalstudio/digital-hub-node . \
		--build-arg BUILD_NUMBER=$(BUILD_NUMBER) \
		--build-arg GIT_REF=$(GIT_REF) \
		--build-arg GIT_DATE=$(GIT_DATE)


push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker push mojdigitalstudio/digital-hub-node
