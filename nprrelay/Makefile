build:
	docker build -t prisoner-content-hub-nprrelay .

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker tag prisoner-content-hub-nprrelay mojdigitalstudio/prisoner-content-hub-nprrelay:build-$(CIRCLE_BUILD_NUM)
	docker tag prisoner-content-hub-nprrelay mojdigitalstudio/prisoner-content-hub-nprrelay:latest
	docker push mojdigitalstudio/prisoner-content-hub-nprrelay:build-$(CIRCLE_BUILD_NUM)
	docker push mojdigitalstudio/prisoner-content-hub-nprrelay:latest

push-preview:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker tag prisoner-content-hub-nprrelay mojdigitalstudio/prisoner-content-hub-nprrelay:preview
	docker push mojdigitalstudio/prisoner-content-hub-nprrelay:preview
