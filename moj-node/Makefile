build-deps:
	npm install

build:
	docker build -t mojdigitalstudio/digital-hub-node .

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker push mojdigitalstudio/digital-hub-node
