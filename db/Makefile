build: 
	docker build -t mojdigitalstudio/digital-hub-db .

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD) 
	docker push mojdigitalstudio/digital-hub-db

update-dump:
	mysqldump -h 127.0.0.1 -uroot -ppassword hubdb > dump/hub.sql
