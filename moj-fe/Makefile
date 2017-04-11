
build-deps:
	npm install
	gulp
	composer install
	composer run-script post-root-package-install
	composer run-script post-create-project-cmd

build: build-deps
	docker build -t moj-hub-fe .

clean:
	rm -rf node_modules
	rm -rf vendor

