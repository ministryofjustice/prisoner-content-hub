build: 
	docker build -t mojdigitalstudio/digital-hub-db .

push:
	@docker login -u $(DOCKER_HUB_USER) -p $(DOCKER_HUB_PASS) -e $(DOCKER_HUB_EMAIL)
	docker push mojdigitalstudio/digital-hub-db

update-dump:
	mysqldump -uroot -ppassword hubdb dump/hub.sql
