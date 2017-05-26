
build-deps:
	npm install
	npm run prod
	npm run snyk-protect
	composer install
	composer run-script post-root-package-install
	composer run-script post-create-project-cmd

build: build-deps
	docker build -t mojdigitalstudio/digital-hub-fe .

clean:
	rm -rf node_modules
	rm -rf vendor

push:
	docker push mojdigitalstudio/digital-hub-fe
