build: 
	docker build -t mojdigitalstudio/digital-hub-api-docs .

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD) 
	docker push mojdigitalstudio/digital-hub-api-docs