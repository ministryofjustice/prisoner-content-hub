build:
	docker build -t prisoner-content-hub-nprrelay . \
		--build-arg BUILD_NUMBER="$(BUILD_NUMBER)" \
		--build-arg GIT_REF="$(GIT_REF)" \
		--build-arg GIT_DATE="$(GIT_DATE)"

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

