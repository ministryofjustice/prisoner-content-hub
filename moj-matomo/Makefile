build-deps:
	mkdir plugins
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/AbTesting/download/3.2.11 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/CustomReports/download/3.1.12 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/Funnels/download/3.1.13 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/HeatmapSessionRecording/download/3.2.26 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/MediaAnalytics/download/3.4.2 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/MultiChannelConversionAttribution/download/3.0.4 | tar -xf- -C ./plugins/
	curl -SL -X POST -F "access_token=$(MATOMO_ACCESS_TOKEN)" https://plugins.matomo.org/api/2.0/plugins/UsersFlow/download/3.1.9 | tar -xf- -C ./plugins/
	curl -SL https://plugins.matomo.org/api/2.0/plugins/EnvironmentVariables/download/latest | tar -xf- -C ./plugins/

build:
	docker build -t digital-hub-matomo .

push:
	@docker login ${AZURE_DOCKER_REPO} -u $(AZURE_DOCKER_USERNAME) -p $(AZURE_DOCKER_PASSWORD)	
	docker tag digital-hub-matomo ${AZURE_DOCKER_REPO}/digital-hub-matomo:latest	
	docker push ${AZURE_DOCKER_REPO}/digital-hub-matomo:latest

clean:
	rm -rf plugins