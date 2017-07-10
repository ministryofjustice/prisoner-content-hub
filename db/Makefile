build: 
	docker build -t mojdigitalstudio/digital-hub-db .

push:
	@docker login -u $(DOCKER_HUB_USER) -p $(DOCKER_HUB_PASS) 
	docker push mojdigitalstudio/digital-hub-db
