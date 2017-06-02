build-deps:
	composer install

build: build-deps
	docker build -t mojdigitalstudio/digital-hub-be .

clean:
	rm -rf vendor

push:
	docker push mojdigitalstudio/digital-hub-be

test:
	cd core && ../vendor/bin/phpunit --testsuite=unit && cd ..
