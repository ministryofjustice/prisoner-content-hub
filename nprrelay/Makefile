build:
	docker build -t prisoner-content-hub-nprrelay .

push:
	@docker login -u="${QUAYIO_USERNAME}" -p="${QUAYIO_PASSWORD}" quay.io
	docker tag prisoner-content-hub-nprrelay quay.io/hmpps/prisoner-content-hub-nprrelay:build-$(CIRCLE_BUILD_NUM)
	docker tag prisoner-content-hub-nprrelay quay.io/hmpps/prisoner-content-hub-nprrelay:latest
	docker push quay.io/hmpps/prisoner-content-hub-nprrelay:build-$(CIRCLE_BUILD_NUM)
	docker push quay.io/hmpps/prisoner-content-hub-nprrelay:latest

push-preview:
	@docker login -u="${QUAYIO_USERNAME}" -p="${QUAYIO_PASSWORD}" quay.io
	docker tag prisoner-content-hub-nprrelay quay.io/hmpps/prisoner-content-hub-nprrelay:preview
	docker push quay.io/hmpps/prisoner-content-hub-nprrelay:preview
