build-deps:
	@./bin/download-plugins

build:
	docker build -t digital-hub-matomo .

push:
	@docker login ${AZURE_DOCKER_REPO} -u $(AZURE_DOCKER_USERNAME) -p $(AZURE_DOCKER_PASSWORD)
	docker tag digital-hub-matomo ${AZURE_DOCKER_REPO}/digital-hub-matomo:latest
	docker push ${AZURE_DOCKER_REPO}/digital-hub-matomo:latest

clean:
	rm -rf plugins