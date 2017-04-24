build-deps:
	composer install

build: build-deps
	docker build -t moj-hub-be .

clean:
	rm -rf vendor
